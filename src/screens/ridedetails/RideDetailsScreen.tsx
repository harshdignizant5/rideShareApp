import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';

const RideDetailsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RideDetails'>>();
  const { rideId } = route.params;

  const [message, setMessage] = useState('');

  // Mock data based on ID (In a real app, fetch this)
  const rideData = {
    id: rideId,
    from: 'Downtown San Francisco',
    to: 'SFO Airport',
    time: 'Jan 16, 10:00 AM',
    riderName: 'Alex Chen',
    riderCity: 'San Francisco',
    vehicleNumber: 'CA-1234',
    note: 'Going to catch a flight, can pick up from downtown area',
  };

  const handleRequest = () => {
    // Handle request logic
    console.log('Requesting to join:', rideId, 'Message:', message);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Details</Text>
        <View style={{ width: perfectSize(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Route Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Route</Text>

          <View style={styles.routeContainer}>
            {/* Timeline Visual */}
            <View style={styles.timelineContainer}>
              <View style={[styles.dot, { backgroundColor: '#D3F9D8' }]}>
                <Text style={{ fontSize: 10 }}>📍</Text>
              </View>
              <View style={styles.line} />
              <View style={[styles.dot, { backgroundColor: '#E7F5FF' }]}>
                <Text style={{ fontSize: 10 }}>🏁</Text>
              </View>
            </View>

            {/* Route Text */}
            <View style={styles.routeTextContainer}>
              <View style={styles.routeItem}>
                <Text style={styles.routeLabel}>From</Text>
                <Text style={styles.routeValue}>{rideData.from}</Text>
              </View>
              <View style={{ height: perfectSize(24) }} />
              <View style={styles.routeItem}>
                <Text style={styles.routeLabel}>To</Text>
                <Text style={styles.routeValue}>{rideData.to}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.timeRow}>
            <Text style={styles.timeIcon}>🕒</Text>
            <Text style={styles.timeText}>{rideData.time}</Text>
          </View>
        </View>

        {/* Rider Info Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rider Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👤</Text>
            <Text style={styles.infoText}>{rideData.riderName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{rideData.riderCity}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🚲</Text>
            <Text style={styles.infoText}>{rideData.vehicleNumber}</Text>
          </View>
        </View>

        {/* Rider Note Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rider Note</Text>
          <Text style={styles.noteText}>{rideData.note}</Text>
        </View>

        {/* Message Input Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Add a message (optional)</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Let the rider know why you'd like to join..."
            placeholderTextColor={colors.textPlaceholder}
            multiline
            numberOfLines={3}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.requestButton} onPress={handleRequest}>
          <Text style={styles.requestButtonText}>Request to Join</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: perfectSize(16),
    paddingVertical: perfectSize(12),
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: perfectSize(8),
  },
  backButtonIcon: {
    fontSize: scaleAndClampFontSize(24),
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: scaleAndClampFontSize(18),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: perfectSize(16),
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: perfectSize(12),
    padding: perfectSize(16),
    marginBottom: perfectSize(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: scaleAndClampFontSize(14),
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: perfectSize(16),
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: perfectSize(16),
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: perfectSize(16),
    marginTop: perfectSize(4),
  },
  dot: {
    width: perfectSize(24),
    height: perfectSize(24),
    borderRadius: perfectSize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 1,
    height: perfectSize(30),
    backgroundColor: colors.border,
    marginVertical: perfectSize(4),
  },
  routeTextContainer: {
    flex: 1,
  },
  routeItem: {
    justifyContent: 'center',
  },
  routeLabel: {
    fontSize: scaleAndClampFontSize(12),
    color: colors.textTertiary,
    marginBottom: perfectSize(2),
  },
  routeValue: {
    fontSize: scaleAndClampFontSize(16),
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: perfectSize(16),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: scaleAndClampFontSize(16),
    marginRight: perfectSize(8),
  },
  timeText: {
    fontSize: scaleAndClampFontSize(14),
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: perfectSize(12),
  },
  infoIcon: {
    fontSize: scaleAndClampFontSize(16),
    width: perfectSize(24),
    color: colors.textTertiary,
  },
  infoText: {
    fontSize: scaleAndClampFontSize(16),
    color: colors.textPrimary,
  },
  noteText: {
    fontSize: scaleAndClampFontSize(14),
    color: colors.textSecondary,
    lineHeight: perfectSize(20),
  },
  messageInput: {
    backgroundColor: colors.backgroundInput,
    borderRadius: perfectSize(8),
    padding: perfectSize(12),
    fontSize: scaleAndClampFontSize(14),
    color: colors.textPrimary,
    minHeight: perfectSize(80),
  },
  footer: {
    padding: perfectSize(16),
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  requestButton: {
    backgroundColor: colors.primary,
    borderRadius: perfectSize(8),
    paddingVertical: perfectSize(16),
    alignItems: 'center',
  },
  requestButtonText: {
    color: colors.textWhite,
    fontSize: scaleAndClampFontSize(16),
    fontWeight: '700',
  },
});

export default RideDetailsScreen;
