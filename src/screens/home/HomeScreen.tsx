import React, { useState, useEffect, useCallback } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import RideCard from '../../components/RideCard';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import { getRides } from '@services/authServices/authServices';
import Toast from 'react-native-toast-message';
import { debounce } from 'lodash';
import { SET_RIDES, SET_USER_LOCATION } from '@store/reducers/appReducer';
import socketEventHandler from '../../socket/socketEventHandler';

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
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  // Use Redux state
  const rides = useSelector((state: any) => state.appReducer.rides);
  const userLocation = useSelector(
    (state: any) => state.appReducer.userLocation,
  );

  const savedAddresses = useSelector(
    (state: any) => state.appReducer.savedAddresses || [],
  );

  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocationFromSearch, setIsLocationFromSearch] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const loginData = useSelector((state: any) => state.authReducer.loginData);
  const JWTToken = useSelector((state: any) => state.authReducer.JWTToken);
  const userData = useSelector((state: any) => state.authReducer.userData);

  console.log('1111111 loginData', loginData);
  console.log('1111111 JWTToken', JWTToken);
  console.log('1111111 userData', userData);

  // Initialize global socket event handler
  useEffect(() => {
    console.log('🚀 HomeScreen: Initializing global socket event handler...');

    // Initialize with Redux dispatch
    socketEventHandler.initialize(dispatch);

    return () => {
      console.log('🔌 HomeScreen: Component unmounting (keeping socket alive)');
      // Don't cleanup here - socket stays active until logout
    };
  }, [dispatch]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useFocusEffect(
    useCallback(() => {
      if (userLocation) {
        fetchRides(isLocationFromSearch);
      }
    }, [userLocation, isLocationFromSearch]),
  );
  /* eslint-enable react-hooks/exhaustive-deps */

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        getCurrentLocation();
      } else {
        console.log('Location permission denied on iOS');
        // Fallback or default location can be handled here if needed
        // For now, if no permission, we can't fetch location-based rides easily
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
        const { latitude, longitude } = position.coords;
        dispatch({
          type: SET_USER_LOCATION,
          payload: { lat: latitude, lng: longitude },
        });
        setIsLocationFromSearch(false);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
        Alert.alert('Error', 'Could not fetch location: ' + error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const searchLocations = async (query: string) => {
    console.log('🚀 HomeScreen: searchLocations', query);

    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`,
      );
      const data = await response.json();
      const mappedData = data.features.map((feature: any) => ({
        place_id: feature.properties.osm_id,
        lat: feature.geometry.coordinates[1].toString(),
        lon: feature.geometry.coordinates[0].toString(),
        display_name:
          feature.properties.name +
          ', ' +
          (feature.properties.city ||
            feature.properties.state ||
            feature.properties.country ||
            ''),
        address: feature.properties,
      }));
      setSuggestions(mappedData);
    } catch (error) {
      console.log('Error fetching locations:error', error);

      console.error('Error fetching locations:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = React.useCallback(
    debounce((text: string) => {
      searchLocations(text);
    }, 500),
    [],
  );

  const handleLocationSelect = async (item: any) => {
    setSearch(item.display_name);
    setSuggestions([]);
    setSelectedAddressId(null); // Clear selected chip if manual search
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    // Update location and fetch rides nearby selected location
    setIsLocationFromSearch(true);
    dispatch({ type: SET_USER_LOCATION, payload: { lat, lng } });
  };

  const handleSavedAddressSelect = (addr: any) => {
    if (selectedAddressId === addr.id) {
      // Deselect
      setSelectedAddressId(null);
      setSearch('');
      getCurrentLocation(); // Go back to current location
      return;
    }

    setSearch(addr.title);
    setSelectedAddressId(addr.id);
    // Correctly accessing latitude and longitude from the address object
    const lat = addr.address.latitude;
    const lng = addr.address.longitude;

    // Update location and fetch rides nearby selected location
    setIsLocationFromSearch(true);
    dispatch({ type: SET_USER_LOCATION, payload: { lat, lng } });
  };

  const fetchRides = async (fromSearch = false) => {
    if (!userLocation) return;

    setLoading(true);
    try {
      const params = {
        lat: userLocation.lat,
        lng: userLocation.lng,
        status: 'OPEN',
        limit: 20,
        offset: 0,
        isSearching: fromSearch, // Check if location is from search
      };
      console.log('Fetch rides params:', params);

      // return;
      const response = await getRides(params);
      console.log('Fetch rides response:', response?.data);

      if (response?.data?.data?.rides) {
        const mappedRides = response.data.data.rides.map((ride: any) => ({
          id: ride.id,
          from: ride.startLocation.address,
          to: ride.endLocation.address,
          time: new Date(ride.departureTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          user: ride.rider.name,
          status: ride.status,
          hasRequested: ride.hasRequested,
          ...ride,
        }));
        // Update Redux Store
        dispatch({ type: SET_RIDES, payload: mappedRides });
      }
    } catch (error: any) {
      console.error('Fetch Home Rides Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not fetch rides nearby',
      });
    } finally {
      setLoading(false);
    }
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

      <View style={[styles.searchContainer, { zIndex: 1000 }]}>
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
            onChangeText={text => {
              setSearch(text);
              debouncedSearch(text);
              if (text.length === 0) {
                getCurrentLocation();
              }
            }}
          />
          {isSearching && (
            <ActivityIndicator size="small" color={colors.primary} />
          )}
        </View>
        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.map(item => (
              <TouchableOpacity
                key={item.place_id}
                style={styles.suggestionItem}
                onPress={() => handleLocationSelect(item)}
              >
                <Text style={styles.suggestionText} numberOfLines={2}>
                  {item.display_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Address Slider */}
      {savedAddresses.length > 0 && (
        <View style={styles.addressSliderContainer}>
          <FlatList
            horizontal
            data={savedAddresses}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.addressSliderContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.addressChip,
                  selectedAddressId === item.id && styles.addressChipSelected,
                ]}
                onPress={() => handleSavedAddressSelect(item)}
              >
                <Text
                  style={[
                    styles.addressChipText,
                    selectedAddressId === item.id &&
                      styles.addressChipTextSelected,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={item => item.id}
          renderItem={renderRideItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => fetchRides(isLocationFromSearch)}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No rides available nearby</Text>
            </View>
          }
        />
      )}
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
  suggestionsContainer: {
    position: 'absolute',
    top: perfectSize(60),
    left: perfectSize(24),
    right: perfectSize(84), // Adjust for filter button width + gap
    backgroundColor: colors.background,
    borderRadius: perfectSize(8),
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    maxHeight: perfectSize(200),
    zIndex: 1000,
  },
  suggestionItem: {
    padding: perfectSize(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: scaleAndClampFontSize(14),
    color: colors.textPrimary,
  },
  addressSliderContainer: {
    marginBottom: perfectSize(16),
  },
  addressSliderContent: {
    paddingHorizontal: perfectSize(24),
    gap: perfectSize(12),
  },
  addressChip: {
    paddingVertical: perfectSize(8),
    paddingHorizontal: perfectSize(16),
    backgroundColor: colors.backgroundLight,
    borderRadius: perfectSize(20),
    borderWidth: 1,
    borderColor: colors.border,
  },
  addressChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  addressChipText: {
    fontSize: scaleAndClampFontSize(14),
    color: colors.textPrimary,
    fontWeight: '500',
  },
  addressChipTextSelected: {
    color: colors.textWhite,
  },
});

export default HomeScreen;
