import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError, asyncHandler } from '../lib/errors.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole('ADMIN'));

// ---------- Users ----------

adminRouter.get(
  '/users',
  asyncHandler(async (req, res) => {
    const role = typeof req.query.role === 'string' ? req.query.role : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const users = await prisma.user.findMany({
      where: {
        role: role && role !== 'all' ? role.toUpperCase() : undefined,
        OR: search
          ? [
              { fullName: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
            ]
          : undefined,
      },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { pickupsAsHousehold: true } } },
    });

    res.json({
      users: users.map((u) => {
        const { passwordHash: _omit, _count, ...safe } = u;
        return { ...safe, totalPickups: _count.pickupsAsHousehold };
      }),
    });
  })
);

const statusSchema = z.object({ status: z.enum(['ACTIVE', 'SUSPENDED', 'PENDING']) });

adminRouter.post(
  '/users/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = statusSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { status } });
    const { passwordHash: _omit, ...safe } = user;
    res.json({ user: safe });
  })
);

// ---------- Pickups ----------

adminRouter.get(
  '/pickups',
  asyncHandler(async (req, res) => {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const pickups = await prisma.pickup.findMany({
      where: { status: status && status !== 'all' ? status.toUpperCase() : undefined },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        household: { select: { fullName: true } },
        psp: { select: { fullName: true } },
      },
    });
    res.json({ pickups });
  })
);

// ---------- Overview / ESG ----------

adminRouter.get(
  '/overview',
  asyncHandler(async (req, res) => {
    const [completedPickups, activeUsers, marketplaceAgg, allPickups] = await Promise.all([
      prisma.pickup.findMany({ where: { status: 'COMPLETED' } }),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.pickup.aggregate({
        where: { intent: 'SELL', status: 'COMPLETED' },
        _sum: { netPayout: true },
      }),
      prisma.pickup.findMany({ select: { status: true, city: true, weightKg: true } }),
    ]);

    const totalWasteKg = completedPickups.reduce((s, p) => s + (p.weightKg ?? 0), 0);
    const co2Kg = totalWasteKg * 0.52; // rough diversion-to-CO2 estimate for demo purposes

    const monthlyTrend = new Map<string, Record<string, number>>();
    for (const p of completedPickups) {
      const month = (p.completedAt ?? p.createdAt).toISOString().slice(0, 7);
      const bucket = monthlyTrend.get(month) ?? {};
      const key = p.category.toLowerCase().replace('-', '');
      bucket[key] = (bucket[key] ?? 0) + (p.weightKg ?? 0) / 1000;
      monthlyTrend.set(month, bucket);
    }

    const cityMap = new Map<string, { wasteKg: number; users: Set<string> }>();
    for (const p of completedPickups) {
      const entry = cityMap.get(p.city) ?? { wasteKg: 0, users: new Set() };
      entry.wasteKg += p.weightKg ?? 0;
      cityMap.set(p.city, entry);
    }
    const cityUsers = await prisma.user.groupBy({ by: ['city'], _count: { _all: true } });
    const cityBreakdown = Array.from(cityMap.entries()).map(([city, v]) => ({
      city,
      wasteKg: v.wasteKg,
      co2Kg: v.wasteKg * 0.52,
      users: cityUsers.find((c) => c.city === city)?._count._all ?? 0,
    }));

    res.json({
      totalWasteKg,
      co2Kg,
      activeUsers,
      marketplaceVolume: marketplaceAgg._sum.netPayout ?? 0,
      monthlyTrend: Array.from(monthlyTrend.entries()).map(([month, cats]) => ({ month, ...cats })),
      cityBreakdown,
      totalPickups: allPickups.length,
      completedPickups: completedPickups.length,
    });
  })
);

adminRouter.get(
  '/esg',
  asyncHandler(async (req, res) => {
    const [completed, allPickups, tradedAgg] = await Promise.all([
      prisma.pickup.count({ where: { status: 'COMPLETED' } }),
      prisma.pickup.count(),
      prisma.pickup.aggregate({
        where: { status: 'COMPLETED', intent: { in: ['SELL', 'DROPOFF'] } },
        _sum: { weightKg: true },
      }),
    ]);
    const activeCollectorsAndPsps = await prisma.user.count({
      where: { role: { in: ['PSP', 'COLLECTOR'] }, status: 'ACTIVE' },
    });

    res.json({
      jobsCreated: allPickups,
      recyclablesTradedKg: tradedAgg._sum.weightKg ?? 0,
      landfillDiversionRate: allPickups > 0 ? completed / allPickups : 0,
      waterSavedLiters: (tradedAgg._sum.weightKg ?? 0) * 62, // rough demo estimate
      jobsCreatedFromWork: activeCollectorsAndPsps,
    });
  })
);
