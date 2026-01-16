import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import RideCard, { RideData } from '../../components/RideCard';

const MyRidesScreen = () => {
  const [activeTab, setActiveTab] = useState<'created' | 'joined'>('created');

  // Mock Data
  const CREATED_RIDES = [
    {
      id: '1',
      from: 'csdcs',
      to: 'xascas',
      time: '2026-01-22T01:31',
      user: 'fere',
      status: 'Pending',
      requests: 1,
    },
    {
      id: '2',
      from: 'csdcs',
      to: 'xascas',
      time: '2026-01-22T01:31',
      user: 'fere',
      status: 'Pending',
      requests: 1,
    },
  ];

  const JOINED_RIDES = [
    {
      id: '2',
      from: 'csdcs',
      to: 'xascas',
      time: '2026-01-22T01:31',
      user: 'fere',
      status: 'Pending',
    },
    {
      id: '3',
      from: 'csdcs',
      to: 'xascas',
      time: '2026-01-22T01:31',
      user: 'fere',
      status: 'Pending',
    },
  ];

  /* eslint-disable react/no-unstable-nested-components */
  const renderItem = ({ item }: { item: RideData }) => (
    <RideCard item={item} showRequestsBadge={activeTab === 'created'} />
  );
  /* eslint-enable react/no-unstable-nested-components */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Rides</Text>
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabsBackground}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'created' && styles.activeTab]}
            onPress={() => setActiveTab('created')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'created' && styles.activeTabText,
              ]}
            >
              Created
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'joined' && styles.activeTab]}
            onPress={() => setActiveTab('joined')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'joined' && styles.activeTabText,
              ]}
            >
              Joined
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={activeTab === 'created' ? CREATED_RIDES : JOINED_RIDES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: perfectSize(24),
    paddingTop: perfectSize(16),
    paddingBottom: perfectSize(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: scaleAndClampFontSize(24),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tabsContainer: {
    padding: perfectSize(24),
  },
  tabsBackground: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundInput,
    borderRadius: perfectSize(12),
    padding: perfectSize(4),
  },
  tab: {
    flex: 1,
    paddingVertical: perfectSize(8),
    alignItems: 'center',
    borderRadius: perfectSize(8),
  },
  activeTab: {
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: scaleAndClampFontSize(14),
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: perfectSize(24),
  },
});

export default MyRidesScreen;
