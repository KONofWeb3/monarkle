import { api, setToken } from './api';
import { Job, JobStatus, PayoutRecord, PspProfile } from '../data/types';

// --- Server <-> app shape adapters -----------------------------------------
// The API returns Prisma's raw shapes (uppercase enums, `household` relation,
// ISO dates). The app's UI types use the friendlier shapes the screens were
// originally built against — adapt here so screens don't need to change.

const STATUS_MAP: Record<string, JobStatus> = {
  PENDING: 'available',
  ASSIGNED: 'accepted',
  IN_PROGRESS: 'enRoute',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

function adaptJob(raw: any): Job {
  return {
    id: raw.id,
    code: raw.code,
    customerName: raw.household?.fullName ?? 'Household',
    category: raw.category,
    quantity: raw.quantity,
    address: raw.address,
    distanceKm: raw.distanceKm ?? 2.4,
    scheduledDate: raw.scheduledDate,
    scheduledTime: raw.scheduledTime,
    payout: raw.serviceFee > 0 ? raw.serviceFee : raw.netPayout ?? 0,
    status: STATUS_MAP[raw.status] ?? 'available',
    weightKg: raw.weightKg ?? undefined,
    notes: raw.notes ?? undefined,
  };
}

function adaptPayout(raw: any): PayoutRecord {
  return {
    id: raw.id,
    jobCode: raw.pickup?.code ?? '—',
    amount: raw.amount,
    date: new Date(raw.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: raw.status === 'PAID' ? 'paid' : 'pending',
  };
}

// --- Auth --------------------------------------------------------------

export async function login(identifier: string, password: string): Promise<PspProfile> {
  const res = await api.post<{ token: string; user: any }>('/auth/login', { identifier, password });
  if (res.user.role !== 'PSP') {
    throw new Error('This account is not registered as a PSP partner.');
  }
  await setToken(res.token);
  return fetchProfile();
}

export function logout() {
  setToken(null);
}

// --- Profile -------------------------------------------------------------

export async function fetchProfile(): Promise<PspProfile> {
  const res = await api.get<{ user: any; profile: any }>('/psp/profile');
  return {
    fullName: res.user.fullName,
    phone: res.user.phone ?? '',
    avatarInitials: res.user.avatarInitials,
    vehicleType: res.profile?.vehicleType ?? 'Not set',
    plateNumber: res.profile?.plateNumber ?? '—',
    rating: res.profile?.rating ?? 5,
    totalJobs: res.profile?.totalJobs ?? 0,
    verified: res.profile?.verified ?? false,
  };
}

// --- Jobs ------------------------------------------------------------------

export async function fetchAvailableJobs(): Promise<Job[]> {
  const res = await api.get<{ jobs: any[] }>('/psp/jobs/available');
  return res.jobs.map(adaptJob);
}

export async function fetchActiveJob(): Promise<Job | null> {
  const res = await api.get<{ job: any | null }>('/psp/jobs/active');
  return res.job ? adaptJob(res.job) : null;
}

export async function fetchJobHistory(): Promise<Job[]> {
  const res = await api.get<{ jobs: any[] }>('/psp/jobs/history');
  return res.jobs.map(adaptJob);
}

export async function acceptJob(id: string): Promise<Job> {
  const res = await api.post<{ pickup: any }>(`/psp/jobs/${id}/accept`);
  return adaptJob(res.pickup);
}

export async function declineJob(id: string): Promise<void> {
  await api.post(`/psp/jobs/${id}/decline`);
}

export async function advanceJob(id: string): Promise<Job> {
  const res = await api.post<{ pickup: any }>(`/psp/jobs/${id}/advance`, { status: 'IN_PROGRESS' });
  return adaptJob(res.pickup);
}

export async function completeJob(id: string, weightKg: number): Promise<Job> {
  const res = await api.post<{ pickup: any }>(`/psp/jobs/${id}/complete`, { weightKg });
  return adaptJob(res.pickup);
}

// --- Earnings ----------------------------------------------------------

export async function fetchEarnings(): Promise<{ balance: number; todayEarnings: number; payouts: PayoutRecord[] }> {
  const res = await api.get<{ balance: number; todayEarnings: number; payouts: any[] }>('/psp/earnings');
  return { balance: res.balance, todayEarnings: res.todayEarnings, payouts: res.payouts.map(adaptPayout) };
}
