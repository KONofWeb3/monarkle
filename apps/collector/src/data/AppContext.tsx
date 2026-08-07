import React, { createContext, useContext, useMemo, useState } from 'react';
import { CollectorProfile, Route, RouteSummary, Stop, StopStatus } from './types';
import { defaultProfile, defaultRoute, routeHistory as initialHistory } from './mockData';

type AppState = {
  isAuthenticated: boolean;
  profile: CollectorProfile;
  route: Route;
  routeHistory: RouteSummary[];
  activeStopIndex: number;
};

type AppActions = {
  signIn: () => void;
  signOut: () => void;
  startRoute: () => void;
  setStopStatus: (stopId: string, status: StopStatus) => void;
  completeStop: (stopId: string, weightKg: number) => void;
  skipStop: (stopId: string) => void;
  goToNextStop: () => void;
};

const Ctx = createContext<(AppState & AppActions) | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile] = useState<CollectorProfile>(defaultProfile);
  const [route, setRoute] = useState<Route>(defaultRoute);
  const [routeHistory] = useState<RouteSummary[]>(initialHistory);
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  const updateStop = (stopId: string, patch: Partial<Stop>) => {
    setRoute((r) => ({ ...r, stops: r.stops.map((s) => (s.id === stopId ? { ...s, ...patch } : s)) }));
  };

  const value = useMemo<AppState & AppActions>(() => ({
    isAuthenticated,
    profile,
    route,
    routeHistory,
    activeStopIndex,

    signIn: () => setIsAuthenticated(true),
    signOut: () => setIsAuthenticated(false),

    startRoute: () => {
      setRoute((r) => ({ ...r, status: 'inProgress' }));
      updateStop(route.stops[0]?.id, { status: 'enRoute' });
    },

    setStopStatus: (stopId, status) => updateStop(stopId, { status }),

    completeStop: (stopId, weightKg) => {
      updateStop(stopId, { status: 'completed', weightKg });
    },

    skipStop: (stopId) => updateStop(stopId, { status: 'skipped' }),

    goToNextStop: () => {
      setActiveStopIndex((i) => {
        const next = i + 1;
        if (next < route.stops.length) {
          updateStop(route.stops[next].id, { status: 'enRoute' });
          return next;
        }
        setRoute((r) => ({ ...r, status: 'completed' }));
        return i;
      });
    },
  }), [isAuthenticated, profile, route, routeHistory, activeStopIndex]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
