import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  BankAccount,
  Payout,
  Pickup,
  PickupIntent,
  RewardEntry,
  User,
  WasteCategory,
} from './types';
import {
  defaultBankAccount,
  defaultUser,
  initialPayouts,
  initialPickups,
  initialRewardHistory,
} from './mockData';

export type PickupDraft = {
  intent: PickupIntent;
  category?: WasteCategory;
  quantity?: 'Small' | 'Medium' | 'Large';
  address?: string;
  date?: string;
  time?: string;
  recyclerName?: string;
};

type AppState = {
  hasOnboarded: boolean;
  isAuthenticated: boolean;
  user: User;
  pickups: Pickup[];
  payouts: Payout[];
  walletBalance: number;
  bankAccount: BankAccount | null;
  rewardPoints: number;
  rewardHistory: RewardEntry[];
  pickupDraft: PickupDraft | null;
};

type AppActions = {
  completeOnboarding: () => void;
  signIn: (user?: Partial<User>) => void;
  signOut: () => void;
  startPickupDraft: (intent: PickupIntent) => void;
  updatePickupDraft: (patch: Partial<PickupDraft>) => void;
  submitPickupDraft: () => Pickup;
  cancelPickup: (id: string) => void;
  ratePickup: (id: string, rating: number, feedback?: string) => void;
  setBankAccount: (acc: BankAccount) => void;
  withdraw: (amount: number) => void;
  redeemPoints: (points: number, label: string) => void;
  updateUser: (patch: Partial<User>) => void;
};

const AppStateContext = createContext<(AppState & AppActions) | undefined>(undefined);

function genCode(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [pickups, setPickups] = useState<Pickup[]>(initialPickups);
  const [payouts, setPayouts] = useState<Payout[]>(initialPayouts);
  const [walletBalance, setWalletBalance] = useState(0);
  const [bankAccount, setBankAccountState] = useState<BankAccount | null>(defaultBankAccount);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [rewardHistory, setRewardHistory] = useState<RewardEntry[]>(initialRewardHistory);
  const [pickupDraft, setPickupDraft] = useState<PickupDraft | null>(null);

  const value = useMemo<AppState & AppActions>(() => ({
    hasOnboarded,
    isAuthenticated,
    user,
    pickups,
    payouts,
    walletBalance,
    bankAccount,
    rewardPoints,
    rewardHistory,
    pickupDraft,

    completeOnboarding: () => setHasOnboarded(true),
    signIn: (patch) => {
      if (patch) setUser((u) => ({ ...u, ...patch }));
      setIsAuthenticated(true);
    },
    signOut: () => setIsAuthenticated(false),

    startPickupDraft: (intent) => setPickupDraft({ intent }),
    updatePickupDraft: (patch) => setPickupDraft((d) => (d ? { ...d, ...patch } : d)),
    submitPickupDraft: () => {
      const draft = pickupDraft;
      const code = genCode('PK');
      const newPickup: Pickup = {
        id: code.toLowerCase(),
        code,
        intent: draft?.intent ?? 'dispose',
        category: draft?.category ?? 'Plastic',
        quantity: draft?.quantity ?? 'Medium',
        address: draft?.address ?? 'Saved address',
        scheduledDate: draft?.date ?? 'Today',
        scheduledTime: draft?.time ?? 'Morning',
        status: 'pending',
        serviceFee: 1500,
        createdAt: 'Just now',
        psp: undefined,
      };
      setPickups((p) => [newPickup, ...p]);
      setPickupDraft(null);
      return newPickup;
    },
    cancelPickup: (id) =>
      setPickups((p) => p.map((pk) => (pk.id === id ? { ...pk, status: 'cancelled' } : pk))),
    ratePickup: () => {
      // mock: no-op persistence beyond UI toast
    },

    setBankAccount: (acc) => setBankAccountState(acc),
    withdraw: (amount) => setWalletBalance((b) => Math.max(0, b - amount)),
    redeemPoints: (points, label) => {
      setRewardPoints((p) => Math.max(0, p - points));
      setRewardHistory((h) => [{ id: genCode('r').toLowerCase(), label, points: -points, date: 'Just now' }, ...h]);
    },
    updateUser: (patch) => setUser((u) => ({ ...u, ...patch })),
  }), [hasOnboarded, isAuthenticated, user, pickups, payouts, walletBalance, bankAccount, rewardPoints, rewardHistory, pickupDraft]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
