import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CollectorProfile, Route, RouteSummary } from './types';
import * as collectorApi from '../lib/collectorApi';
import { getToken } from '../lib/api';

type AppState = {
  isInitializing: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  busy: boolean;
  profile: CollectorProfile; // only read once isAuthenticated is true, by which point it's always set
  route: Route | null;
  routeHistory: RouteSummary[];
};

type AppActions = {
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => void;
  clearAuthError: () => void;
  startRoute: () => Promise<void>;
  markEnRoute: (stopId: string) => Promise<void>;
  markArrived: (stopId: string) => Promise<void>;
  completeStop: (stopId: string, weightKg: number) => Promise<void>;
  refreshAll: () => Promise<void>;
};

const Ctx = createContext<(AppState & AppActions) | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<CollectorProfile | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [routeHistory, setRouteHistory] = useState<RouteSummary[]>([]);

  const refreshAll = useCallback(async () => {
    const [todayRoute, history, prof] = await Promise.all([
      collectorApi.fetchTodayRoute(),
      collectorApi.fetchRouteHistory(),
      collectorApi.fetchProfile(),
    ]);
    setRoute(todayRoute);
    setRouteHistory(history);
    setProfile(prof);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
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
    profile: profile as CollectorProfile,
    route,
    routeHistory,

    signIn: async (identifier, password) => {
      setBusy(true);
      setAuthError(null);
      try {
        const prof = await collectorApi.login(identifier, password);
        setProfile(prof);
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
      collectorApi.logout();
      setIsAuthenticated(false);
      setProfile(null);
      setRoute(null);
      setRouteHistory([]);
    },

    clearAuthError: () => setAuthError(null),

    startRoute: async () => {
      const updated = await collectorApi.startRoute();
      setRoute(updated);
    },

    markEnRoute: async (stopId) => {
      const stop = await collectorApi.setStopStatus(stopId, 'enRoute');
      setRoute((r) => (r ? { ...r, stops: r.stops.map((s) => (s.id === stop.id ? stop : s)) } : r));
    },

    markArrived: async (stopId) => {
      const stop = await collectorApi.setStopStatus(stopId, 'arrived');
      setRoute((r) => (r ? { ...r, stops: r.stops.map((s) => (s.id === stop.id ? stop : s)) } : r));
    },

    completeStop: async (stopId, weightKg) => {
      const { routeCompleted } = await collectorApi.verifyStop(stopId, weightKg);
      // The backend auto-advances the next stop to EN_ROUTE (or marks the
      // route COMPLETED if that was the last one) — refetch to pick that up
      // rather than trying to replicate that transition logic on the client.
      const updated = await collectorApi.fetchTodayRoute();
      setRoute(updated);
      if (routeCompleted) {
        const history = await collectorApi.fetchRouteHistory();
        setRouteHistory(history);
      }
    },

    refreshAll,
  }), [isInitializing, isAuthenticated, authError, busy, profile, route, routeHistory, refreshAll]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
