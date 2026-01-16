import React from 'react';
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import CreateRideScreen from '../screens/create/CreateRideScreen';
import MyRidesScreen from '../screens/myrides/MyRidesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { TabParamList } from './types';
import { perfectSize, scaleAndClampFontSize } from '../utils/dimensions';
import { colors } from '../utils/colors';
import { Home, PlusSquare, ClipboardList, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textPlaceholder,
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = scaleAndClampFontSize(24);

          switch (route.name) {
            case 'HomeTab':
              return <Home size={iconSize} color={color} />;
            case 'CreateTab':
              return <PlusSquare size={iconSize} color={color} />;
            case 'MyRidesTab':
              return <ClipboardList size={iconSize} color={color} />;
            case 'ProfileTab':
              return <User size={iconSize} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="CreateTab"
        component={CreateRideScreen}
        options={{ tabBarLabel: 'Create' }}
      />
      <Tab.Screen
        name="MyRidesTab"
        component={MyRidesScreen}
        options={{ tabBarLabel: 'My Rides' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
    height: Platform.OS === 'ios' ? perfectSize(85) : perfectSize(65),
    paddingTop: perfectSize(8),
    paddingBottom: Platform.OS === 'ios' ? perfectSize(20) : perfectSize(8),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabLabel: {
    fontSize: scaleAndClampFontSize(12),
    fontWeight: '600',
    marginTop: perfectSize(4),
  },
});

export default TabNavigator;
