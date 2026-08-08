import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError, asyncHandler } from '../lib/errors.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const pspRouter = Router();
pspRouter.use(requireAuth, requireRole('PSP'));

// Jobs available to accept: pending DISPOSE pickups with no PSP assigned yet.
pspRouter.get(
  '/jobs/available',
  asyncHandler(async (req, res) => {
    const jobs = await prisma.pickup.findMany({
      where: { status: 'PENDING', pspId: null, intent: { in: ['DISPOSE', 'SELL'] } },
      orderBy: { createdAt: 'asc' },
      include: { household: { select: { fullName: true } } },
      take: 20,
    });
    res.json({ jobs });
  })
);

pspRouter.get(
  '/jobs/active',
  asyncHandler(async (req, res) => {
    const job = await prisma.pickup.findFirst({
      where: {
        pspId: req.user!.userId,
        status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
      },
      include: { household: { select: { fullName: true, phone: true } } },
    });
    res.json({ job });
  })
);

pspRouter.post(
  '/jobs/:id/accept',
  asyncHandler(async (req, res) => {
    const pickup = await prisma.pickup.findUnique({ where: { id: req.params.id } });
    if (!pickup) throw new AppError(404, 'Job not found');
    if (pickup.status !== 'PENDING' || pickup.pspId) throw new AppError(400, 'Job is no longer available');

    const updated = await prisma.pickup.update({
      where: { id: pickup.id },
      data: { pspId: req.user!.userId, status: 'ASSIGNED' },
    });
    res.json({ pickup: updated });
  })
);

pspRouter.post(
  '/jobs/:id/decline',
  asyncHandler(async (req, res) => {
    // No-op server-side (job stays available for other PSPs) — exists for
    // symmetry with the app's decline action / future exclusion logic.
    res.json({ declined: true });
  })
);

const advanceSchema = z.object({ status: z.enum(['IN_PROGRESS']) });

pspRouter.post(
  '/jobs/:id/advance',
  asyncHandler(async (req, res) => {
    const { status } = advanceSchema.parse(req.body);
    const pickup = await prisma.pickup.findFirst({
      where: { id: req.params.id, pspId: req.user!.userId },
    });
    if (!pickup) throw new AppError(404, 'Job not found');
    const updated = await prisma.pickup.update({ where: { id: pickup.id }, data: { status } });
    res.json({ pickup: updated });
  })
);

const completeSchema = z.object({ weightKg: z.number().positive() });

pspRouter.post(
  '/jobs/:id/complete',
  asyncHandler(async (req, res) => {
    const { weightKg } = completeSchema.parse(req.body);
    const pickup = await prisma.pickup.findFirst({
      where: { id: req.params.id, pspId: req.user!.userId },
    });
    if (!pickup) throw new AppError(404, 'Job not found');

    const netPayout = pickup.serviceFee > 0 ? pickup.serviceFee : Math.round(weightKg * 200);

    const [updatedPickup] = await prisma.$transaction([
      prisma.pickup.update({
        where: { id: pickup.id },
        data: { status: 'COMPLETED', weightKg, netPayout, completedAt: new Date() },
      }),
      prisma.wallet.update({
        where: { userId: req.user!.userId },
        data: { balance: { increment: netPayout } },
      }),
      prisma.payout.create({
        data: { userId: req.user!.userId, pickupId: pickup.id, amount: netPayout, status: 'PAID' },
      }),
      prisma.pspProfile.updateMany({
        where: { userId: req.user!.userId },
        data: { totalJobs: { increment: 1 } },
      }),
      // Household earns reward points for completed pickups.
      prisma.rewardEntry.create({
        data: {
          userId: pickup.householdId,
          label: `Pickup #${pickup.code} completed`,
          points: 50,
        },
      }),
    ]);

    res.json({ pickup: updatedPickup });
  })
);

pspRouter.get(
  '/jobs/history',
  asyncHandler(async (req, res) => {
    const jobs = await prisma.pickup.findMany({
      where: { pspId: req.user!.userId, status: { in: ['COMPLETED', 'CANCELLED'] } },
      orderBy: { createdAt: 'desc' },
      include: { household: { select: { fullName: true } } },
      take: 30,
    });
    res.json({ jobs });
  })
);

pspRouter.get(
  '/earnings',
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const [wallet, payouts, todayAgg] = await Promise.all([
      prisma.wallet.findUnique({ where: { userId } }),
      prisma.payout.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { pickup: { select: { code: true } } },
      }),
      prisma.payout.aggregate({
        where: { userId, createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        _sum: { amount: true },
      }),
    ]);
    res.json({
      balance: wallet?.balance ?? 0,
      todayEarnings: todayAgg._sum.amount ?? 0,
      payouts,
    });
  })
);

pspRouter.get(
  '/profile',
  asyncHandler(async (req, res) => {
    const [user, profile] = await Promise.all([
      prisma.user.findUnique({ where: { id: req.user!.userId } }),
      prisma.pspProfile.findUnique({ where: { userId: req.user!.userId } }),
    ]);
    if (!user) throw new AppError(404, 'User not found');
    const { passwordHash: _omit, ...safeUser } = user;
    res.json({ user: safeUser, profile });
  })
);
