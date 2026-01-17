import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import Button from '../../components/common/Button';
import { RootState } from '@store/reducer';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import { verifyOtp } from '@services/authServices/authServices';
import { setJWTToken, setUserData } from '@store/actions/authActions';
import { Alert } from 'react-native';
import { Bike } from 'lucide-react-native';

const OtpScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Otp'>>();
  const [code, setCode] = useState('');
  const { phoneNumber } = route.params;

  const loginData = useSelector((state: any) => state.authReducer.loginData);
  console.log('loginData', loginData);

  useEffect(() => {
    if (loginData?.otp) {
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: `Your OTP is ${loginData.otp}`,
        visibilityTime: 20000,
      });
      // Pre-fill for convenience if desired, or just show toast
      // setCode(String(loginData.otp));
    }
  }, [loginData]);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!code || code.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter a valid 6-digit OTP',
      });
      return;
    }

    setIsLoading(true);
    console.log('Verify OTP Response: TEST', {
      phone: phoneNumber,
      otp: code,
    });
    // return
    try {
      const response = await verifyOtp({
        phone: phoneNumber,
        otp: code,
      });

      console.log('Verify OTP Response:', response?.data);
      // return
      if (response?.data) {
        // Dispatch data if your backend returns token/user here
        // Based on standard flows:
        if (response?.data?.data?.token) {
          dispatch(setJWTToken(response?.data?.data?.token));
        }
        if (response.data.data) {
          // Assuming user object might be in data.data or similar
          dispatch(
            setUserData({
              ...response.data?.data?.user,
              phoneNumber: phoneNumber,
              isReregister: response.data.data?.isRegistered ? true : false,
            }),
          );
        }
        Toast.show({
          type: 'success',
          text1: 'Verification Successful',
          text2: 'Welcome to DigniRide!',
        });

        console.log('22222 JWTToken  phoneNumber', phoneNumber);

        if (response.data.data?.isRegistered) {
          navigation.navigate('Main', { screen: 'HomeTab' });
        } else {
          navigation.navigate('Register', { phoneNumber });
        }
      }
    } catch (error: any) {
      console.error('Verify OTP Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: error.message || 'Invalid OTP',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeNumber = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Bike size={scaleAndClampFontSize(40)} color={colors.textWhite} />
            </View>
            <Text style={styles.appName}>Digni Ride</Text>
            <Text style={styles.tagline}>
              Share the ride, share the journey
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Verification Code</Text>
            <Text style={styles.subLabel}>
              Enter the code sent to {phoneNumber}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="000000"
              placeholderTextColor={colors.textPlaceholder}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
              textAlign="left"
            />

            <Button
              title={isLoading ? 'Verifying...' : 'Verify & Continue'}
              onPress={handleVerify}
              disabled={isLoading || code.length < 6}
              style={{ marginBottom: perfectSize(24) }}
            />

            <TouchableOpacity
              style={styles.changeNumberButton}
              onPress={handleChangeNumber}
            >
              <Text style={styles.changeNumberText}>Change Number</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: perfectSize(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: perfectSize(48),
  },
  logoCircle: {
    width: perfectSize(80),
    height: perfectSize(80),
    borderRadius: perfectSize(40),
    backgroundColor: colors.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: perfectSize(16),
  },
  logoIcon: {
    fontSize: scaleAndClampFontSize(40),
  },
  appName: {
    fontSize: scaleAndClampFontSize(28),
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: perfectSize(8),
  },
  tagline: {
    fontSize: scaleAndClampFontSize(16),
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: scaleAndClampFontSize(16),
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: perfectSize(4),
  },
  subLabel: {
    fontSize: scaleAndClampFontSize(14),
    color: colors.textTertiary,
    marginBottom: perfectSize(16),
  },
  input: {
    backgroundColor: colors.backgroundInput,
    borderRadius: perfectSize(8),
    padding: perfectSize(16),
    fontSize: scaleAndClampFontSize(16),
    color: colors.textPrimary,
    marginBottom: perfectSize(24),
  },
  changeNumberButton: {
    alignItems: 'center',
  },
  changeNumberText: {
    color: colors.textPrimary,
    fontSize: scaleAndClampFontSize(14),
    fontWeight: '600',
  },
});

export default OtpScreen;
