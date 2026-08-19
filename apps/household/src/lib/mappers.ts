import { Pickup, Payout, RewardEntry, User, BankAccount, PickupIntent, PickupStatus, WasteCategory } from '../data/types';

const intentMap: Record<string, PickupIntent> = {
  DISPOSE: 'dispose',
  SELL: 'sell',
  DROPOFF: 'dropoff',
};

const statusMap: Record<string, PickupStatus> = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export function mapPickup(p: any): Pickup {
  return {
    id: p.id,
    code: p.code,
    intent: intentMap[p.intent] ?? 'dispose',
    category: p.category as WasteCategory,
    quantity: p.quantity,
    weightKg: p.weightKg ?? undefined,
    address: p.address,
    scheduledDate: p.scheduledDate,
    scheduledTime: p.scheduledTime,
    status: statusMap[p.status] ?? 'pending',
    serviceFee: p.serviceFee ?? 0,
    netPayout: p.netPayout ?? undefined,
    qrCode: p.qrCode ?? undefined,
    psp: p.psp ? { name: p.psp.fullName, phone: p.psp.phone, rating: 4.8 } : undefined,
    createdAt: p.createdAt,
    completedAt: p.completedAt ?? undefined,
  };
}

export function mapPayout(p: any): Payout {
  return {
    id: p.id,
    pickupCode: p.pickup?.code ?? '-',
    category: (p.pickup?.category as WasteCategory) ?? 'Plastic',
    weightKg: p.pickup?.weightKg ?? 0,
    amount: p.amount,
    status: (p.status?.toLowerCase() ?? 'paid') as Payout['status'],
    date: new Date(p.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }),
    bank: p.bankAccount ? `${p.bankAccount.bankName} ****${p.bankAccount.accountNumber.slice(-4)}` : 'MONARKLE Wallet',
  };
}

export function mapRewardEntry(r: any): RewardEntry {
  return {
    id: r.id,
    label: r.label,
    points: r.points,
    date: new Date(r.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
}

export function mapUser(u: any): User {
  return {
    fullName: u.fullName,
    phone: u.phone ?? '',
    email: u.email ?? undefined,
    accountType: u.accountType ?? 'Household',
    avatarInitials: u.avatarInitials,
    referralCode: u.referralCode ?? '',
  };
}

export function mapBankAccount(b: any): BankAccount | null {
  if (!b) return null;
  return { bankName: b.bankName, accountNumber: b.accountNumber, accountName: b.accountName };
}
