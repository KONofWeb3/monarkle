export type WasteCategory = 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'Organic' | 'E-waste';

export type PickupIntent = 'dispose' | 'sell' | 'dropoff';

export type PickupStatus = 'pending' | 'assigned' | 'inProgress' | 'completed' | 'cancelled';

export type Pickup = {
  id: string;
  code: string;
  intent: PickupIntent;
  category: WasteCategory;
  quantity: 'Small' | 'Medium' | 'Large';
  weightKg?: number;
  address: string;
  scheduledDate: string;
  scheduledTime: string;
  status: PickupStatus;
  serviceFee: number;
  netPayout?: number;
  qrCode?: string;
  psp?: { name: string; phone: string; rating: number };
  createdAt: string;
  completedAt?: string;
};

export type Payout = {
  id: string;
  pickupCode: string;
  category: WasteCategory;
  weightKg: number;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  bank: string;
};

export type RewardEntry = {
  id: string;
  label: string;
  points: number;
  date: string;
};

export type User = {
  fullName: string;
  phone: string;
  email?: string;
  accountType: 'Household' | 'Business' | 'Estate' | 'School' | 'Market';
  avatarInitials: string;
  referralCode: string;
};

export type BankAccount = {
  bankName: string;
  accountNumber: string;
  accountName: string;
};
