import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import RideCard from '../../components/RideCard';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import Geolocation from 'react-native-geolocation-service';
import { useSelector } from 'react-redux';
import { getRides } from '@services/authServices/authServices';
import Toast from 'react-native-toast-message';

// Mock Data
const RIDES = [
  {
    id: '1',
    from: 'Downtown San Francisco',
    to: 'SFO Airport',
    time: 'Jan 16, 10:00 AM',
    user: 'Alex Chen',
    status: 'Open',
  },
  {
    id: '2',
    from: 'Mission District',
    to: 'Berkeley',
    time: 'Jan 16, 2:00 PM',
    user: 'Sarah Martinez',
    status: 'Open',
  },
  {
    id: '3',
    from: 'Palo Alto',
    to: 'San Jose',
    time: 'Jan 16, 4:30 PM',
    user: 'Mike Johnson',
    status: 'Open',
  },
];

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState('');

  const loginData = useSelector((state: any) => state.authReducer.loginData);
  const JWTToken = useSelector((state: any) => state.authReducer.JWTToken);
  const userData = useSelector((state: any) => state.authReducer.userData);

  console.log("1111111 loginData", loginData);
  console.log("1111111 JWTToken", JWTToken);
  console.log("1111111 userData", userData);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        getCurrentLocation();
      } else {
        console.log('Location permission denied on iOS');
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'BikeSharing needs access to your location ' +
              'so you can find rides nearby.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('Location permission denied on Android');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(
          'User Current Location:',
          JSON.stringify(position, null, 2),
        );
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        Alert.alert('Error', 'Could not fetch location: ' + error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const renderRideItem = ({ item }: { item: any }) => (
    <RideCard
      item={item}
      onPress={() => navigation.navigate('RideDetails', { rideId: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find a Ride</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search
            size={scaleAndClampFontSize(18)}
            color={colors.textPlaceholder}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destination..."
            placeholderTextColor={colors.textPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal
            size={scaleAndClampFontSize(20)}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={RIDES}
        keyExtractor={item => item.id}
        renderItem={renderRideItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  },
  title: {
    fontSize: scaleAndClampFontSize(28),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: perfectSize(24),
    gap: perfectSize(12),
    marginBottom: perfectSize(24),
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: perfectSize(8),
    paddingHorizontal: perfectSize(16),
    height: perfectSize(48),
  },
  searchIcon: {
    marginRight: perfectSize(8),
  },
  searchInput: {
    flex: 1,
    fontSize: scaleAndClampFontSize(16),
    color: colors.textPrimary,
  },
  filterButton: {
    width: perfectSize(48),
    height: perfectSize(48),
    borderRadius: perfectSize(8),
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: perfectSize(24),
    paddingBottom: perfectSize(24),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: perfectSize(50),
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: scaleAndClampFontSize(16),
  },
});

export default HomeScreen;
