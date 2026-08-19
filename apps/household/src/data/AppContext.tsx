import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  BankAccount,
  Payout,
  Pickup,
  PickupIntent,
  RewardEntry,
  User,
  WasteCategory,
} from './types';
import * as householdApi from '../lib/householdApi';
import { getToken } from '../lib/api';

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
  isInitializing: boolean;
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
  authError: string | null;
  busy: boolean;
};

type AppActions = {
  completeOnboarding: () => void;
  registerAccount: (input: { fullName: string; phone: string; email?: string; password: string }) => Promise<void>;
  finishSignup: () => void;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => void;
  clearAuthError: () => void;

  startPickupDraft: (intent: PickupIntent) => void;
  updatePickupDraft: (patch: Partial<PickupDraft>) => void;
  submitPickupDraft: () => Promise<Pickup>;
  cancelPickup: (id: string) => Promise<void>;
  ratePickup: (id: string, rating: number, feedback?: string) => void;

  setBankAccount: (acc: { bankName: string; accountNumber: string; accountName: string }) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  redeemPoints: (points: number, label: string) => Promise<void>;
  updateUser: (patch: Partial<User>) => Promise<void>;

  refreshAll: () => Promise<void>;
};

const AppStateContext = createContext<(AppState & AppActions) | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [bankAccount, setBankAccountState] = useState<BankAccount | null>(null);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [rewardHistory, setRewardHistory] = useState<RewardEntry[]>([]);
  const [pickupDraft, setPickupDraft] = useState<PickupDraft | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refreshAll = useCallback(async () => {
    const [pickupsRes, walletRes, rewardsRes] = await Promise.all([
      householdApi.fetchPickups(),
      householdApi.fetchWallet(),
      householdApi.fetchRewards(),
    ]);
    setPickups(pickupsRes);
    setWalletBalance(walletRes.balance);
    setBankAccountState(walletRes.bankAccount);
    setPayouts(walletRes.payouts);
    setRewardPoints(rewardsRes.points);
    setRewardHistory(rewardsRes.history);
  }, []);

  // On cold start, restore a persisted session if one exists.
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const me = await householdApi.fetchMe();
          setUser(me);
          setIsAuthenticated(true);
          setHasOnboarded(true);
          await refreshAll();
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
    hasOnboarded,
    isAuthenticated,
    user: user as User,
    pickups,
    payouts,
    walletBalance,
    bankAccount,
    rewardPoints,
    rewardHistory,
    pickupDraft,
    authError,
    busy,

    completeOnboarding: () => setHasOnboarded(true),

    // Creates the account and stores the session token, but deliberately does
    // NOT flip `isAuthenticated` yet — the signup flow still has profile/
    // permission screens to show (SetupProfile -> ... -> AllSet), and those
    // live in AuthNavigator which only renders while isAuthenticated is false.
    // finishSignup() flips it once the user reaches the end of that flow.
    registerAccount: async (input) => {
      setBusy(true);
      setAuthError(null);
      try {
        const u = await householdApi.register(input);
        setUser(u);
        await refreshAll();
      } catch (e: any) {
        setAuthError(e.message ?? 'Could not create your account');
        throw e;
      } finally {
        setBusy(false);
      }
    },

    finishSignup: () => {
      setIsAuthenticated(true);
      setHasOnboarded(true);
    },

    signIn: async (identifier, password) => {
      setBusy(true);
      setAuthError(null);
      try {
        const u = await householdApi.login(identifier, password);
        setUser(u);
        setIsAuthenticated(true);
        setHasOnboarded(true);
        await refreshAll();
      } catch (e: any) {
        setAuthError(e.message ?? 'Login failed');
        throw e;
      } finally {
        setBusy(false);
      }
    },

    signOut: () => {
      householdApi.logout();
      setIsAuthenticated(false);
      setUser(null);
      setPickups([]);
      setPayouts([]);
      setWalletBalance(0);
      setBankAccountState(null);
      setRewardPoints(0);
      setRewardHistory([]);
    },

    clearAuthError: () => setAuthError(null),

    startPickupDraft: (intent) => setPickupDraft({ intent }),
    updatePickupDraft: (patch) => setPickupDraft((d) => (d ? { ...d, ...patch } : d)),

    submitPickupDraft: async () => {
      if (!pickupDraft) throw new Error('No pickup in progress');
      const pickup = await householdApi.createPickup({
        intent: pickupDraft.intent,
        category: pickupDraft.category ?? 'Plastic',
        quantity: pickupDraft.quantity ?? 'Medium',
        address: pickupDraft.address ?? 'Saved address',
        scheduledDate: pickupDraft.date ?? 'Today',
        scheduledTime: pickupDraft.time ?? 'Morning',
        recyclerName: pickupDraft.recyclerName,
      });
      setPickups((p) => [pickup, ...p]);
      setPickupDraft(null);
      return pickup;
    },

    cancelPickup: async (id) => {
      const updated = await householdApi.cancelPickup(id);
      setPickups((p) => p.map((pk) => (pk.id === id ? updated : pk)));
    },

    ratePickup: () => {
      // No backend rating endpoint yet — kept as a local-only UI acknowledgment.
    },

    setBankAccount: async (acc) => {
      const saved = await householdApi.addBankAccount(acc);
      setBankAccountState(saved);
    },

    withdraw: async (amount) => {
      const balance = await householdApi.withdraw(amount);
      setWalletBalance(balance);
      const walletRes = await householdApi.fetchWallet();
      setPayouts(walletRes.payouts);
    },

    redeemPoints: async (points, label) => {
      await householdApi.redeemPoints(points, label);
      const rewardsRes = await householdApi.fetchRewards();
      setRewardPoints(rewardsRes.points);
      setRewardHistory(rewardsRes.history);
    },

    updateUser: async (patch) => {
      const u = await householdApi.updateProfile(patch);
      setUser(u);
    },

    refreshAll,
  }), [
    isInitializing, hasOnboarded, isAuthenticated, user, pickups, payouts,
    walletBalance, bankAccount, rewardPoints, rewardHistory, pickupDraft,
    authError, busy, refreshAll,
  ]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
