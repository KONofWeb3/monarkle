import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError, asyncHandler } from '../lib/errors.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const collectorRouter = Router();
collectorRouter.use(requireAuth, requireRole('COLLECTOR'));

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

collectorRouter.get(
  '/route/today',
  asyncHandler(async (req, res) => {
    const route = await prisma.route.findFirst({
      where: { collectorId: req.user!.userId, date: todayStr() },
      include: {
        stops: {
          orderBy: { sequence: 'asc' },
          include: { pickup: { include: { household: { select: { fullName: true } } } } },
        },
      },
    });
    res.json({ route });
  })
);

collectorRouter.post(
  '/route/start',
  asyncHandler(async (req, res) => {
    const stopsInclude = {
      orderBy: { sequence: 'asc' as const },
      include: { pickup: { include: { household: { select: { fullName: true } } } } },
    };
    const route = await prisma.route.findFirst({
      where: { collectorId: req.user!.userId, date: todayStr() },
      include: { stops: stopsInclude },
    });
    if (!route) throw new AppError(404, 'No route scheduled for today');
    if (route.status !== 'NOT_STARTED') return res.json({ route });

    const first = route.stops[0];
    await prisma.$transaction([
      prisma.route.update({ where: { id: route.id }, data: { status: 'IN_PROGRESS', startedAt: new Date() } }),
      ...(first ? [prisma.stop.update({ where: { id: first.id }, data: { status: 'EN_ROUTE' } })] : []),
    ]);
    const updated = await prisma.route.findUnique({
      where: { id: route.id },
      include: { stops: stopsInclude },
    });
    res.json({ route: updated });
  })
);

const stopStatusSchema = z.object({ status: z.enum(['EN_ROUTE', 'ARRIVED']) });

collectorRouter.post(
  '/stops/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = stopStatusSchema.parse(req.body);
    const stop = await prisma.stop.findUnique({
      where: { id: req.params.id },
      include: { route: true },
    });
    if (!stop || stop.route.collectorId !== req.user!.userId) throw new AppError(404, 'Stop not found');
    const updated = await prisma.stop.update({
      where: { id: stop.id },
      data: { status },
      include: { pickup: { include: { household: { select: { fullName: true } } } } },
    });
    res.json({ stop: updated });
  })
);

const verifySchema = z.object({ weightKg: z.number().positive() });

collectorRouter.post(
  '/stops/:id/verify',
  asyncHandler(async (req, res) => {
    const { weightKg } = verifySchema.parse(req.body);
    const stop = await prisma.stop.findUnique({
      where: { id: req.params.id },
      include: { route: { include: { stops: { orderBy: { sequence: 'asc' } } } }, pickup: true },
    });
    if (!stop || stop.route.collectorId !== req.user!.userId) throw new AppError(404, 'Stop not found');

    await prisma.$transaction([
      prisma.stop.update({ where: { id: stop.id }, data: { status: 'COMPLETED', weightKg } }),
      prisma.pickup.update({
        where: { id: stop.pickupId },
        data: { status: 'COMPLETED', weightKg, completedAt: new Date() },
      }),
    ]);

    const nextStop = stop.route.stops.find((s) => s.sequence === stop.sequence + 1);
    if (nextStop) {
      await prisma.stop.update({ where: { id: nextStop.id }, data: { status: 'EN_ROUTE' } });
    } else {
      await prisma.route.update({ where: { id: stop.route.id }, data: { status: 'COMPLETED', completedAt: new Date() } });
      await prisma.collectorProfile.updateMany({
        where: { userId: req.user!.userId },
        data: { totalRoutes: { increment: 1 } },
      });
    }

    res.json({ nextStopId: nextStop?.id ?? null, routeCompleted: !nextStop });
  })
);

collectorRouter.get(
  '/route/history',
  asyncHandler(async (req, res) => {
    const routes = await prisma.route.findMany({
      where: { collectorId: req.user!.userId, status: 'COMPLETED' },
      orderBy: { date: 'desc' },
      include: { stops: true },
      take: 20,
    });
    const summaries = routes.map((r) => ({
      id: r.id,
      date: r.date,
      stopsCompleted: r.stops.filter((s) => s.status === 'COMPLETED').length,
      totalStops: r.stops.length,
      totalWeightKg: r.stops.reduce((sum, s) => sum + (s.weightKg ?? 0), 0),
      durationMins: r.startedAt && r.completedAt
        ? Math.round((r.completedAt.getTime() - r.startedAt.getTime()) / 60000)
        : null,
    }));
    res.json({ routes: summaries });
  })
);

collectorRouter.get(
  '/profile',
  asyncHandler(async (req, res) => {
    const [user, profile] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.user!.userId } }),
      prisma.collectorProfile.findUnique({ where: { userId: req.user!.userId } }),
    ]);
    if (!user) throw new AppError(404, 'User not found');
    const { passwordHash: _omit, ...safeUser } = user;
    res.json({ user: safeUser, profile });
  })
);
