export type WasteCategory = 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'Organic' | 'E-waste';

export type PickupStatus = 'pending' | 'assigned' | 'inProgress' | 'completed' | 'cancelled';

export type AdminPickup = {
  id: string;
  code: string;
  household: string;
  intent: 'Dispose' | 'Sell' | 'Drop-off';
  category: WasteCategory;
  weightKg: number;
  address: string;
  city: string;
  psp: string | null;
  status: PickupStatus;
  value: number;
  date: string;
};

export type UserRole = 'Household' | 'PSP' | 'Collector' | 'Recycler' | 'Corporate';

export type PlatformUser = {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  city: string;
  joined: string;
  status: 'active' | 'suspended' | 'pending';
  totalPickups: number;
};

export type EsgMetric = {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
};

export type MonthlyPoint = {
  month: string;
  plastic: number;
  paper: number;
  metal: number;
  glass: number;
  organic: number;
  eWaste: number;
};

export type CityBreakdown = {
  city: string;
  wasteKg: number;
  co2Kg: number;
  users: number;
};
