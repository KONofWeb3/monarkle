export type JobStatus = 'available' | 'accepted' | 'enRoute' | 'arrived' | 'completed' | 'declined' | 'cancelled';

export type Job = {
  id: string;
  code: string;
  customerName: string;
  category: string;
  quantity: 'Small' | 'Medium' | 'Large';
  address: string;
  distanceKm: number;
  scheduledDate: string;
  scheduledTime: string;
  payout: number;
  status: JobStatus;
  weightKg?: number;
  notes?: string;
};

export type PayoutRecord = {
  id: string;
  jobCode: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
};

export type PspProfile = {
  fullName: string;
  phone: string;
  avatarInitials: string;
  vehicleType: string;
  plateNumber: string;
  rating: number;
  totalJobs: number;
  verified: boolean;
};
