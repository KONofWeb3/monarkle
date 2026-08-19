import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Job, PayoutRecord, PspProfile } from './types';
import * as pspApi from '../lib/pspApi';
import { getToken } from '../lib/api';

type AppState = {
  isInitializing: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  busy: boolean;
  profile: PspProfile; // only read once isAuthenticated is true, by which point it's always set
  availableJobs: Job[];
  activeJob: Job | null;
  jobHistory: Job[];
  payouts: PayoutRecord[];
  todayEarnings: number;
};

type AppActions = {
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => void;
  clearAuthError: () => void;
  acceptJob: (id: string) => Promise<void>;
  declineJob: (id: string) => Promise<void>;
  advanceActiveJob: () => Promise<void>;
  completeActiveJob: (weightKg: number) => Promise<void>;
  refreshAll: () => Promise<void>;
};

const Ctx = createContext<(AppState & AppActions) | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<PspProfile | null>(null);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [jobHistory, setJobHistory] = useState<Job[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [todayEarnings, setTodayEarnings] = useState(0);

  const refreshAll = useCallback(async () => {
    const [jobs, active, history, earnings, prof] = await Promise.all([
      pspApi.fetchAvailableJobs(),
      pspApi.fetchActiveJob(),
      pspApi.fetchJobHistory(),
      pspApi.fetchEarnings(),
      pspApi.fetchProfile(),
    ]);
    setAvailableJobs(jobs);
    setActiveJob(active);
    setJobHistory(history);
    setPayouts(earnings.payouts);
    setTodayEarnings(earnings.todayEarnings);
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
    profile: profile as PspProfile,
    availableJobs,
    activeJob,
    jobHistory,
    payouts,
    todayEarnings,

    signIn: async (identifier, password) => {
      setBusy(true);
      setAuthError(null);
      try {
        const prof = await pspApi.login(identifier, password);
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
      pspApi.logout();
      setIsAuthenticated(false);
      setProfile(null);
      setAvailableJobs([]);
      setActiveJob(null);
      setJobHistory([]);
      setPayouts([]);
      setTodayEarnings(0);
    },

    clearAuthError: () => setAuthError(null),

    acceptJob: async (id) => {
      const job = await pspApi.acceptJob(id);
      setAvailableJobs((js) => js.filter((j) => j.id !== id));
      setActiveJob(job);
    },

    declineJob: async (id) => {
      await pspApi.declineJob(id);
      setAvailableJobs((js) => js.filter((j) => j.id !== id));
    },

    advanceActiveJob: async () => {
      if (!activeJob) return;
      const updated = await pspApi.advanceJob(activeJob.id);
      setActiveJob(updated);
    },

    completeActiveJob: async (weightKg) => {
      if (!activeJob) return;
      const done = await pspApi.completeJob(activeJob.id, weightKg);
      setJobHistory((h) => [done, ...h]);
      const earnings = await pspApi.fetchEarnings();
      setPayouts(earnings.payouts);
      setTodayEarnings(earnings.todayEarnings);
      setActiveJob(null);
    },

    refreshAll,
  }), [
    isInitializing, isAuthenticated, authError, busy, profile, availableJobs,
    activeJob, jobHistory, payouts, todayEarnings, refreshAll,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
