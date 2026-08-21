export type AuthStackParamList = {
  Login: undefined;
  CreateAccount: undefined;
  ApplicationSubmitted: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  JobDetail: { jobId: string };
  ActiveJob: undefined;
  VerifyPickup: undefined;
  JobComplete: { payout: number };
  Profile: undefined;
};

export type JobsStackParamList = {
  JobsMain: undefined;
  JobHistoryDetail: { jobId: string };
};

export type EarningsStackParamList = {
  EarningsMain: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Jobs: undefined;
  Earnings: undefined;
};
