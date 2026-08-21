import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError, asyncHandler } from '../lib/errors.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { generateReferralCode } from '../lib/codes.js';

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole('ADMIN'));

// ---------- Users ----------

// Creates a fully working account in one step -- the PSP/Collector apps
// deliberately have no in-app signup (see their LoginScreen copy: "Contact
// MONARKLE Ops to onboard your fleet"), so this endpoint is the only real
// onboarding path for those roles. It also creates the role-specific
// profile row (PspProfile/CollectorProfile) the apps' Home/Profile screens
// expect to exist -- a plain /auth/register call for these roles used to
// leave that missing and would have crashed on first login.
const createUserSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6),
  role: z.enum(['HOUSEHOLD', 'PSP', 'COLLECTOR', 'ADMIN', 'RECYCLER', 'CORPORATE']),
  city: z.string().optional(),
  // PSP + Collector
  vehicleType: z.string().min(2).optional(),
  plateNumber: z.string().min(2).optional(),
  // Collector only
  licenseNumber: z.string().min(2).optional(),
}).refine((d) => d.phone || d.email, { message: 'phone or email is required' })
  .refine((d) => d.role !== 'PSP' || (d.vehicleType && d.plateNumber), {
    message: 'vehicleType and plateNumber are required for PSP accounts',
    path: ['vehicleType'],
  })
  .refine((d) => d.role !== 'COLLECTOR' || (d.vehicleType && d.plateNumber && d.licenseNumber), {
    message: 'vehicleType, plateNumber, and licenseNumber are required for Collector accounts',
    path: ['licenseNumber'],
  });

adminRouter.post(
  '/users',
  asyncHandler(async (req, res) => {
    const data = createUserSchema.parse(req.body);

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          data.phone ? { phone: data.phone } : undefined,
          data.email ? { email: data.email } : undefined,
        ].filter(Boolean) as Array<{ phone: string } | { email: string }>,
      },
    });
    if (existing) throw new AppError(409, 'An account with this phone or email already exists');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const initials = data.fullName
      .split(' ')
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        passwordHash,
        role: data.role,
        accountType: data.role === 'HOUSEHOLD' ? 'Household' : undefined,
        city: data.city ?? 'Lagos',
        avatarInitials: initials || 'U',
        referralCode: data.role === 'HOUSEHOLD' ? generateReferralCode(data.fullName) : undefined,
        wallet: data.role === 'HOUSEHOLD' ? { create: { balance: 0 } } : undefined,
        pspProfile: data.role === 'PSP'
          ? { create: { vehicleType: data.vehicleType!, plateNumber: data.plateNumber!, verified: true } }
          : undefined,
        collectorProfile: data.role === 'COLLECTOR'
          ? { create: { vehicleType: data.vehicleType!, plateNumber: data.plateNumber!, licenseNumber: data.licenseNumber!, verified: true } }
          : undefined,
      },
    });

    const { passwordHash: _omit, ...safe } = user;
    // Password is returned once, here only -- it's hashed from this point
    // on and cannot be recovered. Whoever's creating the account needs to
    // relay it to the new user directly (no email/SMS delivery exists yet).
    res.status(201).json({ user: safe, password: data.password });
  })
);

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

// TEMPORARY one-time cleanup endpoint -- removes a fixed, explicit list of
// confirmed seed/test accounts (and their dependent records) ahead of real
// use. Not a general-purpose delete-user API. Remove this route once run.
adminRouter.post(
  '/_cleanup_seed_data',
  asyncHandler(async (req, res) => {
    const idsToDelete: string[] = req.body?.ids ?? [];
    if (!Array.isArray(idsToDelete) || idsToDelete.length === 0) {
      throw new AppError(400, 'ids array is required');
    }

    const routes = await prisma.route.findMany({ where: { collectorId: { in: idsToDelete } }, select: { id: true } });
    const routeIds = routes.map((r) => r.id);
    const stops = await prisma.stop.deleteMany({ where: { routeId: { in: routeIds } } });
    const routesDeleted = await prisma.route.deleteMany({ where: { id: { in: routeIds } } });
    const payouts = await prisma.payout.deleteMany({ where: { userId: { in: idsToDelete } } });
    const pickups = await prisma.pickup.deleteMany({
      where: { OR: [{ householdId: { in: idsToDelete } }, { pspId: { in: idsToDelete } }, { collectorId: { in: idsToDelete } }] },
    });
    const rewards = await prisma.rewardEntry.deleteMany({ where: { userId: { in: idsToDelete } } });
    const users = await prisma.user.deleteMany({ where: { id: { in: idsToDelete } } });

    res.json({
      stops: stops.count, routes: routesDeleted.count, payouts: payouts.count,
      pickups: pickups.count, rewards: rewards.count, users: users.count,
    });
  })
);
