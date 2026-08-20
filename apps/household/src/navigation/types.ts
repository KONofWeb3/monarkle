export type AuthStackParamList = {
  CreateAccount: undefined;
  SetupProfile: undefined;
  EnableLocation: undefined;
  EnableNotifications: undefined;
  AllSet: undefined;
  Login: undefined;
  // Self-service password reset needs a verification channel (SMS/email) to
  // be safe — without one it's either a fake OTP step or an account-takeover
  // hole. Neither is acceptable, so this is a "contact support" screen for
  // now rather than a real reset flow.
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  RequestPickup: { intent: 'dispose' | 'sell' | 'dropoff' };
  PickupDetailsForm: undefined;
  ReviewPickup: undefined;
  PickupPayment: undefined;
  PickupConfirmed: { pickupId: string };
  TrackPickup: { pickupId: string };
  ChooseDropoffPoint: undefined;
  RecyclerDetails: { recyclerName: string };
  PlanVisit: undefined;
  ReviewDropoff: undefined;
  DropoffQRCode: { pickupId: string };
  LogVisit: { pickupId: string };
  VisitLogged: { pickupId: string };
  PickupDetail: { pickupId: string };
  Profile: undefined;
  EditProfile: undefined;
  ReferEarn: undefined;
  ReferralHistory: undefined;
  NotificationSettings: undefined;
  DeleteAccount: undefined;
};

export type WalletStackParamList = {
  WalletMain: undefined;
  EarningsDetail: { payoutId: string };
  EarningsHistory: undefined;
  AddBankAccount: undefined;
};

export type RewardsStackParamList = {
  RewardsMain: undefined;
  PointsHistory: undefined;
  RedeemAirtime: undefined;
  RedeemConfirmed: { amount: number };
};

export type TrackStackParamList = {
  MyPickups: undefined;
  PickupDetail: { pickupId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Wallet: undefined;
  Rewards: undefined;
  Track: undefined;
};
