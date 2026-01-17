import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  HomeTab: undefined;
  CreateTab: undefined;
  MyRidesTab: { tab?: string };
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Otp: { phoneNumber: string };
  Register: { phoneNumber: string };
  Main: NavigatorScreenParams<TabParamList>;
  RideDetails: { rideId: string };
  MyRideDetails: { ride: any; showRequestsBadge?: boolean }; // Adding showRequestsBadge here as well since I saw it used in MyRideDetailsScreen updates
  AddAddress: undefined;
};
