import { api, setToken } from './api';
import { CollectorProfile, Route, RouteSummary, Stop, StopStatus } from '../data/types';

// --- Server <-> app shape adapters -----------------------------------------

const ROUTE_STATUS_MAP: Record<string, Route['status']> = {
  NOT_STARTED: 'notStarted',
  IN_PROGRESS: 'inProgress',
  COMPLETED: 'completed',
};

const STOP_STATUS_MAP: Record<string, StopStatus> = {
  PENDING: 'pending',
  EN_ROUTE: 'enRoute',
  ARRIVED: 'arrived',
  COMPLETED: 'completed',
};

function adaptStop(raw: any): Stop {
  return {
    id: raw.id,
    code: raw.pickup?.code ?? '—',
    customerName: raw.pickup?.household?.fullName ?? 'Household',
    category: raw.pickup?.category ?? '—',
    quantityLabel: raw.pickup?.quantity ?? '—',
    address: raw.pickup?.address ?? '—',
    sequence: raw.sequence,
    status: STOP_STATUS_MAP[raw.status] ?? 'pending',
    weightKg: raw.weightKg ?? undefined,
    qrExpected: raw.pickup?.code ? `DO-${raw.pickup.code}` : undefined,
  };
}

function adaptRoute(raw: any): Route {
  return {
    id: raw.id,
    date: raw.date,
    status: ROUTE_STATUS_MAP[raw.status] ?? 'notStarted',
    stops: (raw.stops ?? []).map(adaptStop),
  };
}

// --- Auth --------------------------------------------------------------

export async function login(identifier: string, password: string): Promise<CollectorProfile> {
  const res = await api.post<{ token: string; user: any }>('/auth/login', { identifier, password });
  if (res.user.role !== 'COLLECTOR') {
    throw new Error('This account is not registered as a collector.');
  }
  await setToken(res.token);
  return fetchProfile();
}

export function logout() {
  setToken(null);
}

// --- Profile -------------------------------------------------------------

export async function fetchProfile(): Promise<CollectorProfile> {
  const res = await api.get<{ user: any; profile: any }>('/collector/profile');
  return {
    fullName: res.user.fullName,
    phone: res.user.phone ?? '',
    avatarInitials: res.user.avatarInitials,
    vehicleType: res.profile?.vehicleType ?? 'Not set',
    plateNumber: res.profile?.plateNumber ?? '—',
    licenseNumber: res.profile?.licenseNumber ?? '—',
    totalRoutes: res.profile?.totalRoutes ?? 0,
    verified: res.profile?.verified ?? false,
  };
}

// --- Route / stops -----------------------------------------------------

export async function fetchTodayRoute(): Promise<Route | null> {
  const res = await api.get<{ route: any | null }>('/collector/route/today');
  return res.route ? adaptRoute(res.route) : null;
}

export async function startRoute(): Promise<Route> {
  const res = await api.post<{ route: any }>('/collector/route/start');
  return adaptRoute(res.route);
}

export async function setStopStatus(stopId: string, status: 'enRoute' | 'arrived'): Promise<Stop> {
  const backendStatus = status === 'enRoute' ? 'EN_ROUTE' : 'ARRIVED';
  const res = await api.post<{ stop: any }>(`/collector/stops/${stopId}/status`, { status: backendStatus });
  return adaptStop(res.stop);
}

export async function verifyStop(stopId: string, weightKg: number): Promise<{ nextStopId: string | null; routeCompleted: boolean }> {
  return api.post(`/collector/stops/${stopId}/verify`, { weightKg });
}

export async function fetchRouteHistory(): Promise<RouteSummary[]> {
  const res = await api.get<{ routes: any[] }>('/collector/route/history');
  return res.routes.map((r) => ({
    id: r.id,
    date: r.date,
    stopsCompleted: r.stopsCompleted,
    totalStops: r.totalStops,
    totalWeightKg: r.totalWeightKg,
    durationMins: r.durationMins as number | null,
  }));
}
