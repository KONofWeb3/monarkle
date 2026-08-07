export type AuthStackParamList = {
  Login: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  StopDetail: { stopId: string };
  VerifyCollection: { stopId: string };
  StopComplete: { stopId: string };
  RouteComplete: undefined;
  Profile: undefined;
};

export type HistoryStackParamList = {
  RouteHistoryMain: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
};
