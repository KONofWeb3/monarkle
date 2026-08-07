import { Job, PayoutRecord, PspProfile } from './types';

export const defaultProfile: PspProfile = {
  fullName: 'John Doe',
  phone: '+234 802 345 6789',
  avatarInitials: 'JD',
  vehicleType: 'EcoTransit Van',
  plateNumber: 'LND-442-KJ',
  rating: 4.8,
  totalJobs: 214,
  verified: true,
};

export const availableJobs: Job[] = [
  {
    id: 'jb-2041', code: 'PK-2041', customerName: 'Chidinma A.', category: 'Plastic', quantity: 'Medium',
    address: '14 Admiralty Way, Lekki Phase 1', distanceKm: 2.4, scheduledDate: 'Today', scheduledTime: 'Morning',
    payout: 1200, status: 'available',
  },
  {
    id: 'jb-2042', code: 'PK-2042', customerName: 'Tunde B.', category: 'Metal', quantity: 'Small',
    address: '9 Freedom Way, Lekki Phase 1', distanceKm: 3.1, scheduledDate: 'Today', scheduledTime: 'Afternoon',
    payout: 900, status: 'available',
  },
  {
    id: 'jb-2043', code: 'PK-2043', customerName: 'Amaka N.', category: 'E-waste', quantity: 'Large',
    address: '21 Admiralty Rd, Lekki Phase 1', distanceKm: 4.6, scheduledDate: 'Tomorrow', scheduledTime: 'Morning',
    payout: 2500, status: 'available',
  },
];

export const jobHistory: Job[] = [
  {
    id: 'jb-1998', code: 'PK-1998', customerName: 'Biodun K.', category: 'Paper', quantity: 'Small',
    address: '5 Glover Rd, Ikoyi', distanceKm: 1.8, scheduledDate: 'Jun 28, 2026', scheduledTime: 'Morning',
    payout: 800, status: 'completed', weightKg: 6,
  },
  {
    id: 'jb-1990', code: 'PK-1990', customerName: 'Ifeoma S.', category: 'Plastic', quantity: 'Medium',
    address: '18 Bourdillon Rd, Ikoyi', distanceKm: 2.9, scheduledDate: 'Jun 24, 2026', scheduledTime: 'Afternoon',
    payout: 1400, status: 'completed', weightKg: 11,
  },
  {
    id: 'jb-1975', code: 'PK-1975', customerName: 'Kunle T.', category: 'Metal', quantity: 'Large',
    address: '3 Ozumba Mbadiwe Ave, VI', distanceKm: 5.2, scheduledDate: 'Jun 18, 2026', scheduledTime: 'Morning',
    payout: 3200, status: 'cancelled',
  },
];

export const payoutHistory: PayoutRecord[] = [
  { id: 'py-1', jobCode: 'PK-1998', amount: 800, date: 'Jun 28, 2026', status: 'paid' },
  { id: 'py-2', jobCode: 'PK-1990', amount: 1400, date: 'Jun 24, 2026', status: 'paid' },
  { id: 'py-3', jobCode: 'PK-1965', amount: 1100, date: 'Jun 15, 2026', status: 'pending' },
];
