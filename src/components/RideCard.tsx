import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors } from '../utils/colors';
import { perfectSize, scaleAndClampFontSize } from '../utils/dimensions';
import { MapPin, Clock, User, ChevronRight } from 'lucide-react-native';

export interface RideData {
  id: string;
  from: string;
  to: string;
  time: string;
  user: string;
  status: string;
  requests?: number;
}

interface RideCardProps {
  item: RideData;
  onPress?: () => void;
  showRequestsBadge?: boolean;
  style?: ViewStyle;
}

const RideCard: React.FC<RideCardProps> = ({
  item,
  onPress,
  showRequestsBadge = false,
  style,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
    >
      <View style={styles.cardHeader}>
        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <MapPin
              size={scaleAndClampFontSize(16)}
              color={colors.textTertiary}
              fill="none"
              strokeWidth={2}
            />
            <Text style={styles.locationText}>{item.from}</Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin
              size={scaleAndClampFontSize(16)}
              color={colors.textPrimary}
              fill={colors.textPrimary}
              strokeWidth={2}
            />
            <Text style={styles.locationText}>{item.to}</Text>
          </View>
        </View>

        {showRequestsBadge && typeof item.requests === 'number' ? (
          <View style={styles.requestBadge}>
            <Text style={styles.requestText}>
              {item.requests} request{item.requests !== 1 ? 's' : ''}
            </Text>
          </View>
        ) : (
          <View style={styles.chevronContainer}>
            <ChevronRight
              size={scaleAndClampFontSize(20)}
              color={colors.textPlaceholder}
            />
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          <Clock size={scaleAndClampFontSize(14)} color={colors.textTertiary} />
          <Text style={styles.metaText}>{item.time.replace('T', ' ')}</Text>
        </View>

        <View style={styles.metaRow}>
          <User size={scaleAndClampFontSize(14)} color={colors.textTertiary} />
          <Text style={styles.metaText}>{item.user}</Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: perfectSize(12),
    padding: perfectSize(12),
    marginBottom: perfectSize(16),
    borderWidth: 1,
    borderColor: colors.borderDark,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: perfectSize(8),
  },
  locationContainer: {
    flex: 1,
    gap: perfectSize(8),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: perfectSize(8),
  },
  locationIcon: {
    fontSize: scaleAndClampFontSize(16),
    width: perfectSize(20),
    textAlign: 'center',
  },
  locationText: {
    fontSize: scaleAndClampFontSize(16),
    fontWeight: '500',
    color: colors.textPrimary,
  },
  chevronContainer: {
    justifyContent: 'center',
  },
  chevron: {
    fontSize: scaleAndClampFontSize(24),
    color: colors.textPlaceholder,
    fontWeight: '600',
  },
  requestBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: perfectSize(8),
    paddingVertical: perfectSize(4),
    borderRadius: perfectSize(8),
  },
  requestText: {
    fontSize: scaleAndClampFontSize(12),
    fontWeight: '700',
    color: colors.textWhite,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderDark,
    marginBottom: perfectSize(8),
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: perfectSize(4),
  },
  metaIcon: {
    // fontSize removed
  },
  metaText: {
    fontSize: scaleAndClampFontSize(13),
    color: colors.textTertiary,
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: colors.successBackground,
    paddingHorizontal: perfectSize(12),
    paddingVertical: perfectSize(4),
    borderRadius: perfectSize(12),
  },
  statusText: {
    fontSize: scaleAndClampFontSize(12),
    fontWeight: '700',
    color: colors.success,
  },
});

export default RideCard;
