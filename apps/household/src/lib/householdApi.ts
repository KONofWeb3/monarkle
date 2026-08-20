import { api, setToken } from './api';
import { mapBankAccount, mapPayout, mapPickup, mapRewardEntry, mapUser } from './mappers';
import { PickupIntent, WasteCategory } from '../data/types';

const intentToApi: Record<PickupIntent, string> = {
  dispose: 'DISPOSE',
  sell: 'SELL',
  dropoff: 'DROPOFF',
};

// ---------- Auth ----------
// (OTP send/verify client calls were removed along with the in-app OTP step
// — see ForgotPasswordScreen and CreateAccountScreen for why.)

export async function register(input: {
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  referredBy?: string;
}) {
  const res = await api.post<{ token: string; user: any }>('/auth/register', {
    ...input,
    role: 'HOUSEHOLD',
  });
  await setToken(res.token);
  return mapUser(res.user);
}

export async function login(identifier: string, password: string) {
  const res = await api.post<{ token: string; user: any }>('/auth/login', { identifier, password });
  await setToken(res.token);
  return mapUser(res.user);
}

export async function fetchMe() {
  const res = await api.get<{ user: any }>('/auth/me');
  return mapUser(res.user);
}

export async function deactivateAccount(password: string) {
  const res = await api.post<{ deactivated: boolean }>('/auth/deactivate', { password });
  await setToken(null);
  return res.deactivated;
}

export async function logout() {
  await setToken(null);
}

// ---------- Profile ----------

export async function updateProfile(patch: { fullName?: string; phone?: string; accountType?: string }) {
  const res = await api.patch<{ user: any }>('/household/profile', patch);
  return mapUser(res.user);
}

export type NotificationPrefs = {
  assigned: boolean;
  completed: boolean;
  wallet: boolean;
  payout: boolean;
  promotions: boolean;
};

export async function fetchNotificationPrefs() {
  const res = await api.get<{ prefs: NotificationPrefs }>('/household/notification-prefs');
  return res.prefs;
}

export async function updateNotificationPrefs(patch: Partial<NotificationPrefs>) {
  const res = await api.patch<{ prefs: NotificationPrefs }>('/household/notification-prefs', patch);
  return res.prefs;
}

export async function fetchReferrals() {
  const res = await api.get<{ referralCode: string; referrals: any[] }>('/household/refer');
  return res;
}

// ---------- Pickups ----------

export async function fetchPickups() {
  const res = await api.get<{ pickups: any[] }>('/household/pickups');
  return res.pickups.map(mapPickup);
}

export type CreatePickupInput = {
  intent: PickupIntent;
  category: WasteCategory;
  quantity: 'Small' | 'Medium' | 'Large';
  address: string;
  scheduledDate: string;
  scheduledTime: string;
  recyclerName?: string;
};

export async function createPickup(input: CreatePickupInput) {
  const res = await api.post<{ pickup: any }>('/household/pickups', {
    ...input,
    intent: intentToApi[input.intent],
  });
  return mapPickup(res.pickup);
}

export async function cancelPickup(id: string) {
  const res = await api.post<{ pickup: any }>(`/household/pickups/${id}/cancel`);
  return mapPickup(res.pickup);
}

// ---------- Wallet ----------

export async function fetchWallet() {
  const res = await api.get<{ balance: number; bankAccount: any; payouts: any[] }>('/household/wallet');
  return {
    balance: res.balance,
    bankAccount: mapBankAccount(res.bankAccount),
    payouts: res.payouts.map(mapPayout),
  };
}

export async function addBankAccount(input: { bankName: string; accountNumber: string; accountName: string }) {
  const res = await api.post<{ bankAccount: any }>('/household/wallet/bank-account', input);
  return mapBankAccount(res.bankAccount)!;
}

export async function withdraw(amount: number) {
  const res = await api.post<{ balance: number }>('/household/wallet/withdraw', { amount });
  return res.balance;
}

// ---------- Rewards ----------

export async function fetchRewards() {
  const res = await api.get<{ points: number; history: any[] }>('/household/rewards');
  return { points: res.points, history: res.history.map(mapRewardEntry) };
}

export async function redeemPoints(points: number, label: string) {
  const res = await api.post<{ remaining: number }>('/household/rewards/redeem', { points, label });
  return res.remaining;
}
