import type { AdminPickup, CityBreakdown, EsgMetric, MonthlyPoint, PlatformUser } from './types';

export const kpis = [
  { label: 'Total waste diverted', value: '184.6 t', change: '+12.4% MoM', trend: 'up' as const, icon: 'recycle' },
  { label: 'CO₂ emissions avoided', value: '96.2 t', change: '+9.1% MoM', trend: 'up' as const, icon: 'leaf' },
  { label: 'Active users', value: '12,480', change: '+6.8% MoM', trend: 'up' as const, icon: 'users' },
  { label: 'Marketplace volume', value: '₦48.2M', change: '+18.3% MoM', trend: 'up' as const, icon: 'trending' },
];

export const esgMetrics: EsgMetric[] = [
  { label: 'Jobs created', value: '1,204', change: '+3.2%', trend: 'up' },
  { label: 'Recyclables traded', value: '312.4 t', change: '+11.7%', trend: 'up' },
  { label: 'Landfill diversion rate', value: '68%', change: '+4.1%', trend: 'up' },
  { label: 'Water saved (est.)', value: '2.1M L', change: '+7.5%', trend: 'up' },
];

export const monthlyTrend: MonthlyPoint[] = [
  { month: 'Jan', plastic: 12, paper: 8, metal: 6, glass: 3, organic: 10, eWaste: 2 },
  { month: 'Feb', plastic: 14, paper: 9, metal: 7, glass: 4, organic: 11, eWaste: 2 },
  { month: 'Mar', plastic: 15, paper: 10, metal: 8, glass: 4, organic: 12, eWaste: 3 },
  { month: 'Apr', plastic: 18, paper: 11, metal: 9, glass: 5, organic: 13, eWaste: 3 },
  { month: 'May', plastic: 21, paper: 12, metal: 10, glass: 5, organic: 15, eWaste: 4 },
  { month: 'Jun', plastic: 24, paper: 14, metal: 12, glass: 6, organic: 17, eWaste: 4 },
  { month: 'Jul', plastic: 27, paper: 15, metal: 13, glass: 7, organic: 18, eWaste: 5 },
];

export const cityBreakdown: CityBreakdown[] = [
  { city: 'Lagos', wasteKg: 98400, co2Kg: 52100, users: 6820 },
  { city: 'Abuja', wasteKg: 41200, co2Kg: 21800, users: 2910 },
  { city: 'Port Harcourt', wasteKg: 22600, co2Kg: 11900, users: 1540 },
  { city: 'Ibadan', wasteKg: 15300, co2Kg: 8100, users: 980 },
  { city: 'Kano', wasteKg: 7100, co2Kg: 3700, users: 430 },
];

export const pickups: AdminPickup[] = [
  { id: 'p1', code: 'PK-4021', household: 'Chukwuemeka O.', intent: 'Dispose', category: 'Plastic', weightKg: 12, address: '14 Admiralty Way', city: 'Lagos', psp: 'EcoTransit', status: 'completed', value: 2774, date: 'Jul 8, 2026' },
  { id: 'p2', code: 'PK-4022', household: 'Amaka N.', intent: 'Sell', category: 'Metal', weightKg: 8, address: '21 Admiralty Rd', city: 'Lagos', psp: 'CleanCity', status: 'inProgress', value: 3600, date: 'Jul 8, 2026' },
  { id: 'p3', code: 'PK-4023', household: 'Tunde B.', intent: 'Drop-off', category: 'Paper', weightKg: 5, address: 'EcoHand Depo', city: 'Lagos', psp: null, status: 'completed', value: 400, date: 'Jul 7, 2026' },
  { id: 'p4', code: 'PK-4024', household: 'Biodun K.', intent: 'Dispose', category: 'E-waste', weightKg: 15, address: '5 Glover Rd', city: 'Lagos', psp: 'GreenFleet', status: 'assigned', value: 1500, date: 'Jul 7, 2026' },
  { id: 'p5', code: 'PK-4025', household: 'Fatima Y.', intent: 'Dispose', category: 'Organic', weightKg: 20, address: '3 Ahmadu Bello Way', city: 'Abuja', psp: 'CleanCity', status: 'pending', value: 1200, date: 'Jul 7, 2026' },
  { id: 'p6', code: 'PK-4026', household: 'Ifeoma S.', intent: 'Sell', category: 'Plastic', weightKg: 10, address: '18 Bourdillon Rd', city: 'Lagos', psp: 'EcoTransit', status: 'cancelled', value: 0, date: 'Jul 6, 2026' },
  { id: 'p7', code: 'PK-4027', household: 'Kunle T.', intent: 'Dispose', category: 'Glass', weightKg: 6, address: '3 Ozumba Mbadiwe', city: 'Lagos', psp: 'GreenFleet', status: 'completed', value: 900, date: 'Jul 5, 2026' },
  { id: 'p8', code: 'PK-4028', household: 'Grace O.', intent: 'Drop-off', category: 'Metal', weightKg: 9, address: 'Recycle Point Lekki', city: 'Lagos', psp: null, status: 'completed', value: 4050, date: 'Jul 5, 2026' },
];

export const platformUsers: PlatformUser[] = [
  { id: 'u1', name: 'Chukwuemeka Okafor', role: 'Household', email: 'chuk.okafor@example.com', phone: '+234 801 234 5678', city: 'Lagos', joined: 'Jan 14, 2026', status: 'active', totalPickups: 18 },
  { id: 'u2', name: 'EcoTransit Ltd', role: 'PSP', email: 'ops@ecotransit.ng', phone: '+234 802 345 6789', city: 'Lagos', joined: 'Nov 2, 2025', status: 'active', totalPickups: 412 },
  { id: 'u3', name: 'Michael Eze', role: 'Collector', email: 'm.eze@ecotransit.ng', phone: '+234 803 456 7890', city: 'Lagos', joined: 'Dec 20, 2025', status: 'active', totalPickups: 214 },
  { id: 'u4', name: 'GreenCity Recyclers', role: 'Recycler', email: 'contact@greencity.ng', phone: '+234 804 111 2233', city: 'Lagos', joined: 'Oct 5, 2025', status: 'active', totalPickups: 96 },
  { id: 'u5', name: 'Unilever Nigeria', role: 'Corporate', email: 'esg@unilever.ng', phone: '+234 805 222 3344', city: 'Lagos', joined: 'Sep 1, 2025', status: 'active', totalPickups: 0 },
  { id: 'u6', name: 'Amaka Nwosu', role: 'Household', email: 'amaka.n@example.com', phone: '+234 806 333 4455', city: 'Abuja', joined: 'Feb 2, 2026', status: 'pending', totalPickups: 2 },
  { id: 'u7', name: 'CleanCity Recyclers', role: 'PSP', email: 'dispatch@cleancity.ng', phone: '+234 807 444 5566', city: 'Abuja', joined: 'Jan 18, 2026', status: 'suspended', totalPickups: 88 },
];
