export type AuthStackParamList = {
  CreateAccount: undefined;
  VerifyPhone:
    | { mode: 'signup'; phone: string; fullName: string; email?: string; password: string }
    | { mode: 'reset'; phone: string };
  SetupProfile: undefined;
  EnableLocation: undefined;
  EnableNotifications: undefined;
  AllSet: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ForgotPasswordVerify: { phone: string };
  CreateNewPassword: { phone: string };
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
