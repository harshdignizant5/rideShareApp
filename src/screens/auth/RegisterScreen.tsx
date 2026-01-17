import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import Button from '../../components/common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '@services/authServices/authServices';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { setUserData } from '@store/actions/authActions';

const RegisterScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Register'>>();
  const { phoneNumber } = route.params;
  const params = route.params;

  const JWTToken = useSelector((state: any) => state.authReducer.JWTToken);
  const userData = useSelector((state: any) => state.authReducer.userData);



  console.log("22222 JWTToken", JWTToken, phoneNumber, params, userData);

  const [fullName, setFullName] = useState('keval');
  const [phone, setPhone] = useState(userData?.phoneNumber);
  const [city, setCity] = useState('surat');
  const [vehicleNumber, setVehicleNumber] = useState('GJ-05-ME7800');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setPhone(userData?.phoneNumber)
  }, [userData])

  const handleSave = async () => {
    if (!fullName || !city || !vehicleNumber) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: fullName,
        city: city,
        vehicleNumber: vehicleNumber
      };

      console.log("Updating user with payload:", payload);

      // updateUser uses baseApi PUT which handles token automatically if in Redux
      // or we need to ensure the token is available
      const response = await updateUser(payload);
      console.log("Updating user with payload: response", response);
      if (response) { // baseApi or axiosInstance usually returns the response object
        Toast.show({
          type: 'success',
          text1: 'Profile Updated',
          text2: 'Your details have been saved successfully.'
        });
        if (response.data.data) { // Assuming user object might be in data.data or similar
          dispatch(setUserData({ ...userData, ...response.data.data, isReregister: true }));
        }
        navigation.navigate('Main', { screen: 'HomeTab' });
      }

    } catch (error: any) {
      console.log("Updating user with payload: error", error?.response);

      console.error("Update User Error:", error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Could not update profile.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Profile Setup</Text>

          <Text style={styles.instructions}>
            Complete your profile to start riding
          </Text>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={colors.textPlaceholder}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                editable={false}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="San Francisco"
                placeholderTextColor={colors.textPlaceholder}
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Number</Text>
              <TextInput
                style={styles.input}
                placeholder="ABC-1234"
                placeholderTextColor={colors.textPlaceholder}
                value={vehicleNumber}
                onChangeText={setVehicleNumber}
              />
            </View>

            <Button
              title={isLoading ? "Saving..." : "Save & Continue"}
              onPress={handleSave}
              disabled={isLoading}
              style={{ marginTop: perfectSize(24) }}
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
  scrollContent: {
    padding: perfectSize(24),
  },
  headerTitle: {
    fontSize: scaleAndClampFontSize(24),
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: perfectSize(16),
    marginBottom: perfectSize(24),
  },
  instructions: {
    fontSize: scaleAndClampFontSize(16),
    color: colors.textSecondary,
    marginBottom: perfectSize(32),
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: perfectSize(20),
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
  },
});

export default RegisterScreen;
