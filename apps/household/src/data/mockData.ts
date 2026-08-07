import { BankAccount, Payout, Pickup, RewardEntry, User, WasteCategory } from './types';

export const wasteCategories: { key: WasteCategory; icon: string }[] = [
  { key: 'Plastic', icon: 'water-outline' },
  { key: 'Paper', icon: 'document-text-outline' },
  { key: 'Metal', icon: 'hardware-chip-outline' },
  { key: 'Glass', icon: 'wine-outline' },
  { key: 'Organic', icon: 'leaf-outline' },
  { key: 'E-waste', icon: 'phone-portrait-outline' },
];

export const defaultUser: User = {
  fullName: 'Chukwuemeka Okafor',
  phone: '+234 801 234 5678',
  email: '',
  accountType: 'Household',
  avatarInitials: 'CO',
  referralCode: 'EMEKA-7K2P',
};

export const initialPickups: Pickup[] = [
  {
    id: 'pk-0041',
    code: 'PK-0041',
    intent: 'dispose',
    category: 'Plastic',
    quantity: 'Medium',
    address: '14 Admiralty Way, Lekki Phase 1',
    scheduledDate: 'Jun 28, 2026',
    scheduledTime: 'Morning',
    status: 'completed',
    serviceFee: 1500,
    netPayout: 2774,
    psp: { name: 'John Doe (EcoTransit)', phone: '+234 802 345 6789', rating: 4.8 },
    createdAt: 'Jun 26, 2026',
    completedAt: 'Jun 28, 2026 · 2:18pm',
  },
  {
    id: 'pk-0038',
    code: 'PK-0038',
    intent: 'sell',
    category: 'Metal',
    quantity: 'Small',
    address: '14 Admiralty Way, Lekki Phase 1',
    scheduledDate: 'Jun 20, 2026',
    scheduledTime: 'Afternoon',
    status: 'completed',
    serviceFee: 0,
    netPayout: 2774,
    createdAt: 'Jun 19, 2026',
    completedAt: 'Jun 20, 2026 · 2:18pm',
  },
  {
    id: 'pk-0035',
    code: 'PK-0035',
    intent: 'dropoff',
    category: 'Paper',
    quantity: 'Small',
    address: 'CleanCity Recycler, Victoria Island',
    scheduledDate: 'Jun 15, 2026',
    scheduledTime: 'Any time',
    status: 'completed',
    serviceFee: 0,
    netPayout: 925,
    createdAt: 'Jun 15, 2026',
    completedAt: 'Jun 15, 2026',
  },
];

export const initialPayouts: Payout[] = [
  { id: 'py-1', pickupCode: 'PK-1031', category: 'Metal', weightKg: 12, amount: 2774, status: 'paid', date: 'Jun 24, 2026', bank: 'GTBank ****4821' },
  { id: 'py-2', pickupCode: 'PK-1005', category: 'Plastic', weightKg: 8, amount: 925, status: 'pending', date: 'May 28, 2026', bank: 'GTBank ****4821' },
  { id: 'py-3', pickupCode: 'PK-992', category: 'E-waste', weightKg: 4.3, amount: 2000, status: 'failed', date: 'May 3, 2026', bank: 'GTBank ****4821' },
];

export const initialRewardHistory: RewardEntry[] = [
  { id: 'r1', label: 'Pickup #PK-1010 completed', points: 120, date: 'Jun 16, 2026' },
  { id: 'r2', label: 'Airtime redemption — ₦500 cost', points: -200, date: 'Jun 10, 2026' },
  { id: 'r3', label: 'Pickup #PK-1005 completed', points: 90, date: 'May 28, 2026' },
  { id: 'r4', label: 'Pickup #PK-992 completed', points: 130, date: 'May 3, 2026' },
  { id: 'r5', label: 'Welcome bonus', points: 150, date: 'May 1, 2026' },
];

export const defaultBankAccount: BankAccount | null = {
  bankName: 'GTBank',
  accountNumber: '0234567890',
  accountName: 'Chukwuemeka Okafor',
};

export const banks = ['Access Bank', 'GTBank', 'Zenith Bank', 'UBA', 'First Bank', 'Kuda', 'Opay', 'Moniepoint'];
