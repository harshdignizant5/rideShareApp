import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, setJWTToken, setLoginData, setUserData } from '@store/actions/authActions';
import { authLogin } from '@services/authServices/authServices';
import { RootState } from '@store/index';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import Button from '../../components/common/Button';

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const loginData = useSelector((state: RootState) => state.authReducer.loginData);
  const [isLoading, setIsLoading] = useState(false);

  console.log("loginData 111", loginData);

  const [phoneNumber, setPhoneNumber] = useState('7434023679');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  // const loginData = useSelector((state: any) => state.authReducer.loginData);
  const JWTToken = useSelector((state: any) => state.authReducer.JWTToken);
  const userData = useSelector((state: any) => state.authReducer.userData);

  console.log("1111111 loginData", loginData);
  console.log("1111111 JWTToken", JWTToken);
  console.log("1111111 userData", userData);

  const handleContinue = async () => {
    // navigation.navigate('Otp', { phoneNumber });

    setIsLoading(true);
    try {
      const response = await authLogin({
        phone: phoneNumber,
        name: name,
        city: city
      });
      console.log("responseresponse", response);

      if (response?.data) {
        // Dispatch to reducer
        dispatch(setLoginData(response?.data?.data));

        navigation.navigate('Otp', { phoneNumber });

      }
    } catch (error: any) {
      console.log("responseresponse error", error);

      Alert.alert("Error", error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>🚲</Text>
            </View>
            <Text style={styles.appName}>Pillion</Text>
            <Text style={styles.tagline}>
              Share the ride, share the journey
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 9825144252"
              placeholderTextColor={colors.textPlaceholder}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            {/* <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={colors.textPlaceholder}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Bangalore"
              placeholderTextColor={colors.textPlaceholder}
              value={city}
              onChangeText={setCity}
            /> */}

            <Button
              title={isLoading ? "Loading..." : "Continue"}
              onPress={handleContinue}
              disabled={isLoading || phoneNumber.length !== 10}
            />
          </View>
        </ScrollView>
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
    paddingHorizontal: perfectSize(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
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
    backgroundColor: colors.logoBackground, // Blue color mostly matching the image
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
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: perfectSize(8),
  },
  input: {
    backgroundColor: colors.backgroundInput,
    borderRadius: perfectSize(8),
    padding: perfectSize(16),
    fontSize: scaleAndClampFontSize(16),
    color: colors.textPrimary,
    marginBottom: perfectSize(24),
  },
});

export default LoginScreen;
