import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError, asyncHandler } from '../lib/errors.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { generateDropoffQr, generatePickupCode } from '../lib/codes.js';

export const householdRouter = Router();
householdRouter.use(requireAuth, requireRole('HOUSEHOLD'));

// ---------- Pickups ----------

householdRouter.get(
  '/pickups',
  asyncHandler(async (req, res) => {
    const pickups = await prisma.pickup.findMany({
      where: { householdId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      include: { psp: { select: { fullName: true, phone: true } } },
    });
    res.json({ pickups });
  })
);

householdRouter.get(
  '/pickups/:id',
  asyncHandler(async (req, res) => {
    const pickup = await prisma.pickup.findFirst({
      where: { id: req.params.id, householdId: req.user!.userId },
      include: { psp: { select: { fullName: true, phone: true } } },
    });
    if (!pickup) throw new AppError(404, 'Pickup not found');
    res.json({ pickup });
  })
);

const createPickupSchema = z.object({
  intent: z.enum(['DISPOSE', 'SELL', 'DROPOFF']),
  category: z.enum(['Plastic', 'Paper', 'Metal', 'Glass', 'Organic', 'E-waste']),
  quantity: z.enum(['Small', 'Medium', 'Large']),
  address: z.string().min(3),
  city: z.string().optional(),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  recyclerName: z.string().optional(),
});

const SERVICE_FEE = 1500;

householdRouter.post(
  '/pickups',
  asyncHandler(async (req, res) => {
    const data = createPickupSchema.parse(req.body);
    const code = generatePickupCode();

    const pickup = await prisma.pickup.create({
      data: {
        code,
        householdId: req.user!.userId,
        intent: data.intent,
        category: data.category,
        quantity: data.quantity,
        address: data.address,
        city: data.city ?? 'Lagos',
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        recyclerName: data.recyclerName,
        serviceFee: data.intent === 'DISPOSE' ? SERVICE_FEE : 0,
        status: 'PENDING',
        qrCode: data.intent === 'DROPOFF' ? generateDropoffQr(code) : undefined,
      },
    });

    res.status(201).json({ pickup });
  })
);

householdRouter.post(
  '/pickups/:id/cancel',
  asyncHandler(async (req, res) => {
    const pickup = await prisma.pickup.findFirst({
      where: { id: req.params.id, householdId: req.user!.userId },
    });
    if (!pickup) throw new AppError(404, 'Pickup not found');
    if (!['PENDING', 'ASSIGNED'].includes(pickup.status)) {
      throw new AppError(400, 'This pickup can no longer be cancelled');
    }
    const updated = await prisma.pickup.update({
      where: { id: pickup.id },
      data: { status: 'CANCELLED' },
    });
    res.json({ pickup: updated });
  })
);

// ---------- Wallet ----------

householdRouter.get(
  '/wallet',
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const [wallet, bankAccount, payouts] = await Promise.all([
      prisma.wallet.findUnique({ where: { userId } }),
      prisma.bankAccount.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      prisma.payout.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { pickup: { select: { code: true, category: true, weightKg: true } } },
      }),
    ]);
    res.json({ balance: wallet?.balance ?? 0, bankAccount, payouts });
  })
);

const bankAccountSchema = z.object({
  bankName: z.string().min(2),
  accountNumber: z.string().min(6),
  accountName: z.string().min(2),
});

householdRouter.post(
  '/wallet/bank-account',
  asyncHandler(async (req, res) => {
    const data = bankAccountSchema.parse(req.body);
    await prisma.bankAccount.updateMany({
      where: { userId: req.user!.userId },
      data: { isDefault: false },
    });
    const bankAccount = await prisma.bankAccount.create({
      data: { ...data, userId: req.user!.userId, isDefault: true },
    });
    res.status(201).json({ bankAccount });
  })
);

householdRouter.post(
  '/wallet/withdraw',
  asyncHandler(async (req, res) => {
    const { amount } = z.object({ amount: z.number().positive() }).parse(req.body);
    const wallet = await prisma.wallet.findUnique({ where: { userId: req.user!.userId } });
    if (!wallet || wallet.balance < amount) throw new AppError(400, 'Insufficient balance');

    const bankAccount = await prisma.bankAccount.findFirst({
      where: { userId: req.user!.userId, isDefault: true },
    });
    if (!bankAccount) throw new AppError(400, 'Add a bank account before withdrawing');

    const [updatedWallet, payout] = await prisma.$transaction([
      prisma.wallet.update({
        where: { userId: req.user!.userId },
        data: { balance: { decrement: amount } },
      }),
      prisma.payout.create({
        data: {
          userId: req.user!.userId,
          bankAccountId: bankAccount.id,
          amount,
          status: 'PAID',
        },
      }),
    ]);
    res.json({ balance: updatedWallet.balance, payout });
  })
);

// ---------- Rewards ----------

householdRouter.get(
  '/rewards',
  asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const [entries, agg] = await Promise.all([
      prisma.rewardEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 30 }),
      prisma.rewardEntry.aggregate({ where: { userId }, _sum: { points: true } }),
    ]);
    res.json({ points: agg._sum.points ?? 0, history: entries });
  })
);

const redeemSchema = z.object({
  points: z.number().int().positive(),
  label: z.string().min(3),
});

householdRouter.post(
  '/rewards/redeem',
  asyncHandler(async (req, res) => {
    const { points, label } = redeemSchema.parse(req.body);
    const agg = await prisma.rewardEntry.aggregate({
      where: { userId: req.user!.userId },
      _sum: { points: true },
    });
    const balance = agg._sum.points ?? 0;
    if (balance < points) throw new AppError(400, 'Not enough points');

    const entry = await prisma.rewardEntry.create({
      data: { userId: req.user!.userId, label, points: -points },
    });
    res.status(201).json({ entry, remaining: balance - points });
  })
);

// ---------- Profile ----------

const profileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(7).optional(),
  accountType: z.enum(['Household', 'Business', 'Estate', 'School', 'Market']).optional(),
});

householdRouter.patch(
  '/profile',
  asyncHandler(async (req, res) => {
    const data = profileSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.user!.userId }, data });
    const { passwordHash: _omit, ...safe } = user;
    res.json({ user: safe });
  })
);

const DEFAULT_NOTIFICATION_PREFS = {
  assigned: true,
  completed: true,
  wallet: true,
  payout: true,
  promotions: false,
};

householdRouter.get(
  '/notification-prefs',
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    res.json({ prefs: { ...DEFAULT_NOTIFICATION_PREFS, ...((user?.notificationPrefs as object) ?? {}) } });
  })
);

const notificationPrefsSchema = z.object({
  assigned: z.boolean().optional(),
  completed: z.boolean().optional(),
  wallet: z.boolean().optional(),
  payout: z.boolean().optional(),
  promotions: z.boolean().optional(),
});

householdRouter.patch(
  '/notification-prefs',
  asyncHandler(async (req, res) => {
    const patch = notificationPrefsSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    const merged = { ...DEFAULT_NOTIFICATION_PREFS, ...((user?.notificationPrefs as object) ?? {}), ...patch };
    await prisma.user.update({ where: { id: req.user!.userId }, data: { notificationPrefs: merged } });
    res.json({ prefs: merged });
  })
);

householdRouter.get(
  '/refer',
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    const referrals = await prisma.user.findMany({
      where: { referredBy: user?.referralCode ?? '__none__' },
      select: { id: true, fullName: true, createdAt: true },
    });
    res.json({ referralCode: user?.referralCode, referrals });
  })
);
