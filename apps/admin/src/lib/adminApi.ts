import { api, setToken } from './api';
import type { AdminPickup, CityBreakdown, MonthlyPoint, PickupStatus, PlatformUser, UserRole, WasteCategory } from '../data/types';

// --- Server <-> app shape adapters -----------------------------------------

const PICKUP_STATUS_MAP: Record<string, PickupStatus> = {
  PENDING: 'pending', ASSIGNED: 'assigned', IN_PROGRESS: 'inProgress', COMPLETED: 'completed', CANCELLED: 'cancelled',
};

const INTENT_MAP: Record<string, AdminPickup['intent']> = {
  DISPOSE: 'Dispose', SELL: 'Sell', DROPOFF: 'Drop-off',
};

const ROLE_MAP: Record<string, UserRole> = {
  HOUSEHOLD: 'Household', PSP: 'PSP', COLLECTOR: 'Collector', RECYCLER: 'Recycler', CORPORATE: 'Corporate',
};

const USER_STATUS_MAP: Record<string, PlatformUser['status']> = {
  ACTIVE: 'active', SUSPENDED: 'suspended', PENDING: 'pending',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function adaptPickup(raw: any): AdminPickup {
  return {
    id: raw.id,
    code: raw.code,
    household: raw.household?.fullName ?? '—',
    intent: INTENT_MAP[raw.intent] ?? 'Dispose',
    category: raw.category as WasteCategory,
    weightKg: raw.weightKg ?? 0,
    address: raw.address,
    city: raw.city,
    psp: raw.psp?.fullName ?? null,
    status: PICKUP_STATUS_MAP[raw.status] ?? 'pending',
    value: raw.serviceFee > 0 ? raw.serviceFee : (raw.netPayout ?? 0),
    date: formatDate(raw.createdAt),
  };
}

function adaptUser(raw: any): PlatformUser | null {
  const role = ROLE_MAP[raw.role];
  if (!role) return null; // skip ADMIN accounts — not a role the Users table models
  return {
    id: raw.id,
    name: raw.fullName,
    role,
    email: raw.email ?? '—',
    phone: raw.phone ?? '—',
    city: raw.city,
    joined: formatDate(raw.createdAt),
    status: USER_STATUS_MAP[raw.status] ?? 'pending',
    totalPickups: raw.totalPickups ?? 0,
  };
}

// The backend keys its monthly category buckets from
// `category.toLowerCase().replace('-', '')`, so "E-waste" becomes "ewaste"
// rather than the "eWaste" camelCase key the frontend's MonthlyPoint expects.
function adaptMonthlyPoint(raw: any): MonthlyPoint {
  return {
    month: raw.month,
    plastic: raw.plastic ?? 0,
    paper: raw.paper ?? 0,
    metal: raw.metal ?? 0,
    glass: raw.glass ?? 0,
    organic: raw.organic ?? 0,
    eWaste: raw.ewaste ?? 0,
  };
}

// --- Auth --------------------------------------------------------------

export async function login(email: string, password: string): Promise<{ name: string }> {
  const res = await api.post<{ token: string; user: any }>('/auth/login', { identifier: email, password });
  if (res.user.role !== 'ADMIN') {
    throw new Error('This account does not have admin access.');
  }
  setToken(res.token);
  return { name: res.user.fullName };
}

export function logout() {
  setToken(null);
}

// --- Pickups -------------------------------------------------------------

export async function fetchPickups(): Promise<AdminPickup[]> {
  const res = await api.get<{ pickups: any[] }>('/admin/pickups');
  return res.pickups.map(adaptPickup);
}

// --- Users -----------------------------------------------------------------

export async function fetchUsers(): Promise<PlatformUser[]> {
  const res = await api.get<{ users: any[] }>('/admin/users');
  return res.users.map(adaptUser).filter((u): u is PlatformUser => u !== null);
}

export async function setUserStatus(id: string, status: PlatformUser['status']): Promise<void> {
  const backendStatus = status === 'active' ? 'ACTIVE' : status === 'suspended' ? 'SUSPENDED' : 'PENDING';
  await api.post(`/admin/users/${id}/status`, { status: backendStatus });
}

const ROLE_TO_BACKEND: Record<UserRole, string> = {
  Household: 'HOUSEHOLD', PSP: 'PSP', Collector: 'COLLECTOR', Recycler: 'RECYCLER', Corporate: 'CORPORATE',
};

export type CreateUserInput = {
  fullName: string;
  phone?: string;
  email?: string;
  password: string;
  role: UserRole | 'Admin';
  city?: string;
  vehicleType?: string;
  plateNumber?: string;
  licenseNumber?: string;
};

// Returns the plain password back once — the caller must show it to whoever
// is creating the account, since it's hashed server-side from this point on
// and there's no email/SMS delivery to send it automatically.
export async function createUser(input: CreateUserInput): Promise<{ user: PlatformUser | null; password: string }> {
  const backendRole = input.role === 'Admin' ? 'ADMIN' : ROLE_TO_BACKEND[input.role];
  const res = await api.post<{ user: any; password: string }>('/admin/users', { ...input, role: backendRole });
  return { user: adaptUser(res.user), password: res.password };
}

// --- Overview / ESG ----------------------------------------------------

export type Kpi = { label: string; value: string; icon: 'recycle' | 'leaf' | 'users' | 'trending' };

export async function fetchOverview(): Promise<{
  kpis: Kpi[];
  monthlyTrend: MonthlyPoint[];
  cityBreakdown: CityBreakdown[];
}> {
  const res = await api.get<{
    totalWasteKg: number; co2Kg: number; activeUsers: number; marketplaceVolume: number;
    monthlyTrend: any[]; cityBreakdown: CityBreakdown[];
  }>('/admin/overview');

  return {
    kpis: [
      { label: 'Total waste diverted', value: `${(res.totalWasteKg / 1000).toFixed(1)} t`, icon: 'recycle' },
      { label: 'CO₂ emissions avoided', value: `${(res.co2Kg / 1000).toFixed(1)} t`, icon: 'leaf' },
      { label: 'Active users', value: res.activeUsers.toLocaleString(), icon: 'users' },
      { label: 'Marketplace volume', value: `₦${res.marketplaceVolume.toLocaleString()}`, icon: 'trending' },
    ],
    monthlyTrend: res.monthlyTrend.map(adaptMonthlyPoint),
    cityBreakdown: res.cityBreakdown,
  };
}

export type EsgMetric = { label: string; value: string };

export async function fetchEsg(): Promise<EsgMetric[]> {
  const res = await api.get<{
    jobsCreated: number; recyclablesTradedKg: number; landfillDiversionRate: number; waterSavedLiters: number;
  }>('/admin/esg');

  return [
    { label: 'Jobs created', value: res.jobsCreated.toLocaleString() },
    { label: 'Recyclables traded', value: `${(res.recyclablesTradedKg / 1000).toFixed(1)} t` },
    { label: 'Landfill diversion rate', value: `${Math.round(res.landfillDiversionRate * 100)}%` },
    { label: 'Water saved (est.)', value: `${(res.waterSavedLiters / 1_000_000).toFixed(1)}M L` },
  ];
}
