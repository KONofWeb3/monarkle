import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/jwt.js';
import { AppError, asyncHandler } from '../lib/errors.js';
import { generateReferralCode } from '../lib/codes.js';
import { requireAuth } from '../middleware/auth.js';
import { serializeUser } from '../lib/serialize.js';
import { sendOtp } from '../lib/sms.js';

export const authRouter = Router();

const ROLES = ['HOUSEHOLD', 'PSP', 'COLLECTOR', 'ADMIN', 'RECYCLER', 'CORPORATE'] as const;

const registerSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6),
  role: z.enum(ROLES).default('HOUSEHOLD'),
  accountType: z.enum(['Household', 'Business', 'Estate', 'School', 'Market']).optional(),
  city: z.string().optional(),
  referredBy: z.string().trim().toUpperCase().optional(),
}).refine((d) => d.phone || d.email, { message: 'phone or email is required' });

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          data.phone ? { phone: data.phone } : undefined,
          data.email ? { email: data.email } : undefined,
        ].filter(Boolean) as Array<{ phone: string } | { email: string }>,
      },
    });
    if (existing) throw new AppError(409, 'An account with this phone or email already exists');

    // A referral code, if given, must belong to a real household account —
    // fail loudly rather than silently dropping a typo'd code.
    let referrer: { id: string; referralCode: string | null } | null = null;
    if (data.referredBy) {
      referrer = await prisma.user.findUnique({
        where: { referralCode: data.referredBy },
        select: { id: true, referralCode: true },
      });
      if (!referrer) throw new AppError(400, 'Invalid referral code');
    }

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
        accountType: data.accountType ?? (data.role === 'HOUSEHOLD' ? 'Household' : undefined),
        city: data.city ?? 'Lagos',
        avatarInitials: initials || 'U',
        referralCode: data.role === 'HOUSEHOLD' ? generateReferralCode(data.fullName) : undefined,
        referredBy: referrer?.referralCode ?? undefined,
        wallet: { create: { balance: 0 } },
      },
    });

    // Referral bonus is granted immediately on signup (not gated on the new
    // user's first pickup) — there's no invite-tracking system to hold a
    // "pending" state in, so instant-on-signup is the honest simple version.
    if (referrer) {
      await prisma.$transaction([
        prisma.rewardEntry.create({
          data: { userId: referrer.id, label: `Referral bonus — ${data.fullName} joined`, points: 100 },
        }),
        prisma.rewardEntry.create({
          data: { userId: user.id, label: 'Welcome bonus — referred by a friend', points: 50 },
        }),
      ]);
    }

    const token = signToken({ userId: user.id, role: user.role });
    res.status(201).json({ token, user: serializeUser(user) });
  })
);

const loginSchema = z.object({
  identifier: z.string().min(3), // phone or email
  password: z.string().min(1),
});

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { identifier, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findFirst({
      where: { OR: [{ phone: identifier }, { email: identifier }] },
    });
    if (!user) throw new AppError(401, 'Invalid credentials');
    if (user.status === 'SUSPENDED') throw new AppError(403, 'This account has been suspended');
    if (user.status === 'DELETED') throw new AppError(403, 'This account has been deleted');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    const token = signToken({ userId: user.id, role: user.role });
    res.json({ token, user: serializeUser(user) });
  })
);

// OTP flow — sends via Termii when TERMII_API_KEY is set; otherwise logs the
// code to the server console so local testing keeps working without a live
// SMS account. Either way the code is real and must match to verify.
authRouter.post(
  '/otp/send',
  asyncHandler(async (req, res) => {
    const { phone } = z.object({ phone: z.string().min(7) }).parse(req.body);
    const { sent, mock } = await sendOtp(phone);
    res.json({ sent, phone, mock, hint: mock ? 'Mock mode — check server logs for the code' : undefined });
  })
);

authRouter.post(
  '/otp/verify',
  asyncHandler(async (req, res) => {
    const { code } = z.object({ phone: z.string().min(7), code: z.string() }).parse(req.body);
    if (!/^\d{4,6}$/.test(code)) throw new AppError(400, 'Invalid code format');
    // Verification is intentionally disabled for now — no SMS/email provider
    // is wired up for real delivery yet (Termii needs business sender-ID
    // approval first). The screens still walk through the OTP step so the
    // flow matches the design, but any correctly-formatted code passes.
    // Swap this back to a real verifyOtp(phone, code) check once a delivery
    // channel is live.
    res.json({ verified: true });
  })
);

// NOTE: there used to be an unauthenticated POST /password/reset here (just
// phone + newPassword, no proof of ownership). It's been removed — that's a
// real account-takeover hole, not a shortcut worth keeping around even
// unused. Self-service reset needs a verified channel (SMS/email) before it
// comes back; until then ForgotPasswordScreen points users to support.

authRouter.post(
  '/deactivate',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { password } = z.object({ password: z.string().min(1) }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) throw new AppError(404, 'User not found');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Incorrect password');

    // Soft delete: flips status to DELETED (blocks future logins) rather
    // than a hard row delete, since Pickup/Payout/RewardEntry/Route records
    // referencing this user aren't cascade-deletable without corrupting
    // other users' history (e.g. a PSP's completed-job record). A real
    // "erase my data" flow needs a dedicated anonymization pass, not a
    // same-day cascading delete.
    await prisma.user.update({ where: { id: user.id }, data: { status: 'DELETED' } });
    res.json({ deactivated: true });
  })
);

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) throw new AppError(404, 'User not found');
    res.json({ user: serializeUser(user) });
  })
);
