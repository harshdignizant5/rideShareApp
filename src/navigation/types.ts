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
  RideDetails: { rideId: string }; // Adding this for future use based on images
};
