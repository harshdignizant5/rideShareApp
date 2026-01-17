import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import Button from '../../components/common/Button';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { SET_SAVED_ADDRESSES } from '@store/reducers/appReducer';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { addAddress, getAddresses } from '@services/authServices/authServices';

interface LocationResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  address?: any;
}

const AddAddressScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const savedAddresses = useSelector(
    (state: any) => state.appReducer.savedAddresses || [],
  );

  const [title, setTitle] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);

  const searchLocations = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
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
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      searchLocations(text);
    }, 500),
    [],
  );

  const handleLocationSelect = (item: LocationResult) => {
    setAddressQuery(item.display_name);
    setSelectedLocation(item);
    setSuggestions([]);
  };

  const handleSaveAddress = async () => {
    if (!title.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a title for this address (e.g., Home, Work).',
      });
      return;
    }

    if (!selectedLocation) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select an address from the suggestions.',
      });
      return;
    }

    const payload = {
      title: title.trim(),
      address: {
        street:
          selectedLocation.address?.street ||
          selectedLocation.display_name.split(',')[0],
        city:
          selectedLocation.address?.city ||
          selectedLocation.address?.town ||
          selectedLocation.address?.village ||
          '',
        province: selectedLocation.address?.state || '',
        zipCode: selectedLocation.address?.postcode || '',
        country: selectedLocation.address?.country || '',
        latitude: parseFloat(selectedLocation.lat),
        longitude: parseFloat(selectedLocation.lon),
      },
    };

    console.log('Adding address payload:', payload);

    try {
      const response = await addAddress(payload);
      console.log('Add Address Response:', response?.data);
      if (response?.data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Address Saved',
          text2: `${title} has been added to your saved addresses.`,
        });
        // Refresh addresses in profile or global state
        const addressesResponse = await getAddresses();
        if (addressesResponse?.data?.success) {
          dispatch({
            type: SET_SAVED_ADDRESSES,
            payload: addressesResponse.data.data,
          });
        }
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Add Address Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Save',
        text2: error?.message || 'Could not save address.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft
            size={scaleAndClampFontSize(24)}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title (e.g., Home, Work)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            placeholderTextColor={colors.textPlaceholder}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={[styles.inputGroup, { zIndex: 1000 }]}>
          <Text style={styles.label}>Address</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Search for address"
              placeholderTextColor={colors.textPlaceholder}
              value={addressQuery}
              onChangeText={text => {
                setAddressQuery(text);
                setSelectedLocation(null);
                debouncedSearch(text);
              }}
            />
            {isLoading && (
              <ActivityIndicator
                style={styles.loader}
                size="small"
                color={colors.primary}
              />
            )}
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map(item => (
                <TouchableOpacity
                  key={item.place_id}
                  style={styles.suggestionItem}
                  onPress={() => handleLocationSelect(item)}
                >
                  <MapPin
                    size={16}
                    color={colors.textSecondary}
                    style={{ marginRight: 8, marginTop: 2 }}
                  />
                  <Text style={styles.suggestionText} numberOfLines={2}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Button
          title="Save Address"
          onPress={handleSaveAddress}
          variant="primary"
          style={{ marginTop: perfectSize(24) }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: perfectSize(16),
    paddingVertical: perfectSize(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: perfectSize(8),
    marginRight: perfectSize(8),
  },
  headerTitle: {
    fontSize: scaleAndClampFontSize(18),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  content: {
    padding: perfectSize(24),
  },
  inputGroup: {
    marginBottom: perfectSize(24),
    position: 'relative',
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
  loader: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: perfectSize(80),
    left: 0,
    right: 0,
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
    flexDirection: 'row',
    padding: perfectSize(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'flex-start',
  },
  suggestionText: {
    fontSize: scaleAndClampFontSize(14),
    color: colors.textPrimary,
    flex: 1,
  },
});

export default AddAddressScreen;
