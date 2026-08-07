export type StopStatus = 'pending' | 'enRoute' | 'arrived' | 'verifying' | 'completed' | 'skipped';

export type Stop = {
  id: string;
  code: string;
  customerName: string;
  category: string;
  quantityLabel: string;
  address: string;
  sequence: number;
  status: StopStatus;
  weightKg?: number;
  qrExpected?: string;
};

export type Route = {
  id: string;
  date: string;
  stops: Stop[];
  status: 'notStarted' | 'inProgress' | 'completed';
};

export type RouteSummary = {
  id: string;
  date: string;
  stopsCompleted: number;
  totalStops: number;
  totalWeightKg: number;
  durationMins: number;
};

export type CollectorProfile = {
  fullName: string;
  phone: string;
  avatarInitials: string;
  vehicleType: string;
  plateNumber: string;
  licenseNumber: string;
  totalRoutes: number;
  verified: boolean;
};
