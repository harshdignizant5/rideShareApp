import React, { useState } from 'react';
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

const OtpScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Otp'>>();
  const [code, setCode] = useState('');
  const { phoneNumber } = route.params;

  const handleVerify = () => {
    // Basic validation or logic here
    navigation.navigate('Register', { phoneNumber });
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
              <Text style={styles.logoIcon}>🚲</Text>
            </View>
            <Text style={styles.appName}>Pillion</Text>
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
              title="Verify & Continue"
              onPress={handleVerify}
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
