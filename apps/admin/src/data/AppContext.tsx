import React, { createContext, useContext, useMemo, useState } from 'react';
import { pickups as initialPickups, platformUsers as initialUsers } from './mockData';
import type { AdminPickup, PlatformUser } from './types';

type AppState = {
  isAuthenticated: boolean;
  adminName: string;
  pickups: AdminPickup[];
  users: PlatformUser[];
};

type AppActions = {
  signIn: () => void;
  signOut: () => void;
  setUserStatus: (id: string, status: PlatformUser['status']) => void;
};

const Ctx = createContext<(AppState & AppActions) | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);

  const value = useMemo<AppState & AppActions>(() => ({
    isAuthenticated,
    adminName: 'Ops Admin',
    pickups: initialPickups,
    users,
    signIn: () => setIsAuthenticated(true),
    signOut: () => setIsAuthenticated(false),
    setUserStatus: (id, status) => setUsers((u) => u.map((x) => (x.id === id ? { ...x, status } : x))),
  }), [isAuthenticated, users]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
