import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import TabNavigator from './TabNavigator';
import RideDetailsScreen from '../screens/ridedetails/RideDetailsScreen';
import MyRideDetailsScreen from '../screens/myrides/MyRideDetailsScreen';

import { useSelector } from 'react-redux';
import { RootState } from '@store/index';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { JWTToken, userData } = useSelector((state: RootState) => state.authReducer);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!JWTToken ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
        </>
      ) : (
        !userData?.isReregister ? (
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            initialParams={{ phoneNumber: userData?.phone || '' }}
          />
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="RideDetails" component={RideDetailsScreen} />
            <Stack.Screen name="MyRideDetails" component={MyRideDetailsScreen} />
          </>
        )
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
