import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../lib/jwt.js';
import { AppError, asyncHandler } from '../lib/errors.js';
import { generateReferralCode } from '../lib/codes.js';
import { requireAuth } from '../middleware/auth.js';
import { serializeUser } from '../lib/serialize.js';
import { sendOtp, verifyOtp } from '../lib/sms.js';

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
        wallet: { create: { balance: 0 } },
      },
    });

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
    const { phone, code } = z.object({ phone: z.string().min(7), code: z.string() }).parse(req.body);
    if (!/^\d{4,6}$/.test(code)) throw new AppError(400, 'Invalid code format');
    const ok = verifyOtp(phone, code);
    if (!ok) throw new AppError(400, 'Incorrect or expired code');
    res.json({ verified: true });
  })
);

const resetSchema = z.object({
  phone: z.string().min(7),
  newPassword: z.string().min(6),
});

authRouter.post(
  '/password/reset',
  asyncHandler(async (req, res) => {
    const { phone, newPassword } = resetSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) throw new AppError(404, 'No account found for this phone number');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    res.json({ reset: true });
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
