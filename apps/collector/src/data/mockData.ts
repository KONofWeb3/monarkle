import { CollectorProfile, Route, RouteSummary, Stop } from './types';

export const defaultProfile: CollectorProfile = {
  fullName: 'Michael Eze',
  phone: '+234 803 456 7890',
  avatarInitials: 'ME',
  vehicleType: 'MONARKLE Collection Truck',
  plateNumber: 'LND-118-XY',
  licenseNumber: 'DVL-88213-LG',
  totalRoutes: 132,
  verified: true,
};

export const todaysStops: Stop[] = [
  {
    id: 'st-1', code: 'PK-3011', customerName: 'Grace O.', category: 'Plastic', quantityLabel: 'Medium (5-20kg)',
    address: '14 Admiralty Way, Lekki Phase 1', sequence: 1, status: 'pending', qrExpected: 'DO-2026-3011',
  },
  {
    id: 'st-2', code: 'PK-3012', customerName: 'Femi A.', category: 'Metal', quantityLabel: 'Small (0-5kg)',
    address: '9 Freedom Way, Lekki Phase 1', sequence: 2, status: 'pending', qrExpected: 'DO-2026-3012',
  },
  {
    id: 'st-3', code: 'PK-3013', customerName: 'Ngozi K.', category: 'Paper', quantityLabel: 'Large (20+kg)',
    address: '21 Admiralty Rd, Lekki Phase 1', sequence: 3, status: 'pending', qrExpected: 'DO-2026-3013',
  },
  {
    id: 'st-4', code: 'PK-3014', customerName: 'David I.', category: 'E-waste', quantityLabel: 'Medium (5-20kg)',
    address: '5 Glover Rd, Ikoyi', sequence: 4, status: 'pending', qrExpected: 'DO-2026-3014',
  },
];

export const defaultRoute: Route = {
  id: 'rt-today',
  date: 'Today',
  stops: todaysStops,
  status: 'notStarted',
};

export const routeHistory: RouteSummary[] = [
  { id: 'rt-1', date: 'Jun 28, 2026', stopsCompleted: 6, totalStops: 6, totalWeightKg: 58, durationMins: 210 },
  { id: 'rt-2', date: 'Jun 27, 2026', stopsCompleted: 5, totalStops: 6, totalWeightKg: 41, durationMins: 195 },
  { id: 'rt-3', date: 'Jun 26, 2026', stopsCompleted: 7, totalStops: 7, totalWeightKg: 66, durationMins: 240 },
];
