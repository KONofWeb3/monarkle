import React, { createContext, useContext, useMemo, useState } from 'react';
import { Job, JobStatus, PayoutRecord, PspProfile } from './types';
import { availableJobs as initialAvailable, jobHistory as initialHistory, payoutHistory as initialPayouts, defaultProfile } from './mockData';

type AppState = {
  isAuthenticated: boolean;
  profile: PspProfile;
  availableJobs: Job[];
  activeJob: Job | null;
  jobHistory: Job[];
  payouts: PayoutRecord[];
  todayEarnings: number;
};

type AppActions = {
  signIn: () => void;
  signOut: () => void;
  acceptJob: (id: string) => void;
  declineJob: (id: string) => void;
  advanceActiveJob: () => void;
  completeActiveJob: (weightKg: number) => void;
};

const Ctx = createContext<(AppState & AppActions) | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile] = useState<PspProfile>(defaultProfile);
  const [jobsAvailable, setJobsAvailable] = useState<Job[]>(initialAvailable);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [history, setHistory] = useState<Job[]>(initialHistory);
  const [payouts] = useState<PayoutRecord[]>(initialPayouts);
  const [todayEarnings, setTodayEarnings] = useState(0);

  const value = useMemo<AppState & AppActions>(() => ({
    isAuthenticated,
    profile,
    availableJobs: jobsAvailable,
    activeJob,
    jobHistory: history,
    payouts,
    todayEarnings,

    signIn: () => setIsAuthenticated(true),
    signOut: () => setIsAuthenticated(false),

    acceptJob: (id) => {
      const job = jobsAvailable.find((j) => j.id === id);
      if (!job) return;
      setJobsAvailable((js) => js.filter((j) => j.id !== id));
      setActiveJob({ ...job, status: 'accepted' });
    },
    declineJob: (id) => setJobsAvailable((js) => js.filter((j) => j.id !== id)),

    advanceActiveJob: () =>
      setActiveJob((j) => {
        if (!j) return j;
        const next: Record<JobStatus, JobStatus> = {
          available: 'accepted', accepted: 'enRoute', enRoute: 'arrived', arrived: 'arrived',
          completed: 'completed', declined: 'declined', cancelled: 'cancelled',
        };
        return { ...j, status: next[j.status] };
      }),

    completeActiveJob: (weightKg) => {
      if (!activeJob) return;
      const done: Job = { ...activeJob, status: 'completed', weightKg };
      setHistory((h) => [done, ...h]);
      setTodayEarnings((e) => e + activeJob.payout);
      setActiveJob(null);
    },
  }), [isAuthenticated, profile, jobsAvailable, activeJob, history, payouts, todayEarnings]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
