import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as adminApi from '../lib/adminApi';
import { getToken } from '../lib/api';
import type { AdminPickup, CityBreakdown, MonthlyPoint, PlatformUser } from './types';
import type { EsgMetric, Kpi } from '../lib/adminApi';

type AppState = {
  isInitializing: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  busy: boolean;
  adminName: string;
  pickups: AdminPickup[];
  users: PlatformUser[];
  kpis: Kpi[];
  monthlyTrend: MonthlyPoint[];
  cityBreakdown: CityBreakdown[];
  esgMetrics: EsgMetric[];
};

type AppActions = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  clearAuthError: () => void;
  setUserStatus: (id: string, status: PlatformUser['status']) => Promise<void>;
  refreshAll: () => Promise<void>;
};

const Ctx = createContext<(AppState & AppActions) | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [adminName, setAdminName] = useState('Ops Admin');
  const [pickups, setPickups] = useState<AdminPickup[]>([]);
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyPoint[]>([]);
  const [cityBreakdown, setCityBreakdown] = useState<CityBreakdown[]>([]);
  const [esgMetrics, setEsgMetrics] = useState<EsgMetric[]>([]);

  const refreshAll = useCallback(async () => {
    const [pickupsRes, usersRes, overview, esg] = await Promise.all([
      adminApi.fetchPickups(),
      adminApi.fetchUsers(),
      adminApi.fetchOverview(),
      adminApi.fetchEsg(),
    ]);
    setPickups(pickupsRes);
    setUsers(usersRes);
    setKpis(overview.kpis);
    setMonthlyTrend(overview.monthlyTrend);
    setCityBreakdown(overview.cityBreakdown);
    setEsgMetrics(esg);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (getToken()) {
          await refreshAll();
          setIsAuthenticated(true);
        }
      } catch {
        // Stale/invalid token — fall through to logged-out state.
      } finally {
        setIsInitializing(false);
      }
    })();
  }, [refreshAll]);

  const value = useMemo<AppState & AppActions>(() => ({
    isInitializing,
    isAuthenticated,
    authError,
    busy,
    adminName,
    pickups,
    users,
    kpis,
    monthlyTrend,
    cityBreakdown,
    esgMetrics,

    signIn: async (email, password) => {
      setBusy(true);
      setAuthError(null);
      try {
        const { name } = await adminApi.login(email, password);
        setAdminName(name);
        await refreshAll();
        setIsAuthenticated(true);
      } catch (e: any) {
        setAuthError(e.message ?? 'Login failed');
        throw e;
      } finally {
        setBusy(false);
      }
    },

    signOut: () => {
      adminApi.logout();
      setIsAuthenticated(false);
      setPickups([]);
      setUsers([]);
      setKpis([]);
      setMonthlyTrend([]);
      setCityBreakdown([]);
      setEsgMetrics([]);
    },

    clearAuthError: () => setAuthError(null),

    setUserStatus: async (id, status) => {
      await adminApi.setUserStatus(id, status);
      setUsers((u) => u.map((x) => (x.id === id ? { ...x, status } : x)));
    },

    refreshAll,
  }), [isInitializing, isAuthenticated, authError, busy, adminName, pickups, users, kpis, monthlyTrend, cityBreakdown, esgMetrics, refreshAll]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
