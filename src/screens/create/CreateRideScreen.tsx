import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../../components/common/Button';
import { debounce } from 'lodash';
import { createRide } from '@services/authServices/authServices';
import Toast from 'react-native-toast-message';

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

const CreateRideScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Location Search State
  const [startSuggestions, setStartSuggestions] = useState<LocationResult[]>(
    [],
  );
  const [destSuggestions, setDestSuggestions] = useState<LocationResult[]>([]);
  const [isLoadingStart, setIsLoadingStart] = useState(false);
  const [isLoadingDest, setIsLoadingDest] = useState(false);
  const [activeSearch, setActiveSearch] = useState<'start' | 'dest' | null>(
    null,
  );

  // Selected Location Objects
  const [selectedStart, setSelectedStart] = useState<LocationResult | null>(
    null,
  );
  const [selectedDest, setSelectedDest] = useState<LocationResult | null>(null);

  // Function to fetch locations from Nominatim
  const searchLocations = async (query: string, type: 'start' | 'dest') => {
    if (!query || query.length < 3) {
      if (type === 'start') setStartSuggestions([]);
      else setDestSuggestions([]);
      return;
    }

    if (type === 'start') setIsLoadingStart(true);
    else setIsLoadingDest(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query,
        )}&format=json&addressdetails=1&limit=5&countrycodes=in`,
        {
          headers: {
            'User-Agent': 'BikeSharingApp', // Required by Nominatim
          },
        },
      );

      const data = await response.json();

      if (type === 'start') setStartSuggestions(data);
      else setDestSuggestions(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      if (type === 'start') setIsLoadingStart(false);
      else setIsLoadingDest(false);
    }
  };

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((text: string, type: 'start' | 'dest') => {
      searchLocations(text, type);
    }, 500),
    [],
  );

  const handleCreateRide = async () => {
    // Validation
    if (!startLocation.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a start location',
      });
      return;
    }

    if (!destination.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a destination',
      });
      return;
    }

    // Ensure start location coordinates are available
    if (!selectedStart || !selectedStart.lat || !selectedStart.lon) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2:
          'Please select a start location from the suggestions to get coordinates.',
      });
      return;
    }

    // Ensure destination coordinates are available
    if (!selectedDest || !selectedDest.lat || !selectedDest.lon) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2:
          'Please select a destination from the suggestions to get accurate coordinates.',
      });
      return;
    }

    if (!isDateSelected) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please select a departure date and time',
      });
      return;
    }

    // Check if selected date/time is in the past
    const now = new Date();
    if (date <= now) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Date/Time',
        text2: 'Please select a future date and time for your ride',
      });
      return;
    }

    // Final Payload Construction with Safety Checks
    const payload = {
      startLocation: {
        lat: parseFloat(selectedStart.lat),
        lng: parseFloat(selectedStart.lon),
        address: startLocation,
      },
      endLocation: {
        lat: parseFloat(selectedDest.lat),
        lng: parseFloat(selectedDest.lon),
        address: destination,
      },
      departureTime: date.toISOString(),
      note: note || '', // Ensure note is at least an empty string
    };

    console.log('Creating ride payload:', payload);
    setIsLoading(true);

    try {
      const response = await createRide(payload);
      console.log('Create Ride Response:', response?.data);

      if (response) {
        Toast.show({
          type: 'success',
          text1: 'Ride Created',
          text2: 'Your ride has been successfully published!',
        });
        // Reset form or navigate
        setStartLocation('');
        setDestination('');
        setSelectedStart(null);
        setSelectedDest(null);
        setNote('');
        setDate(new Date());
        setIsDateSelected(false);

        navigation.navigate('Main', {
          screen: 'MyRidesTab',
          params: { tab: 'created' },
        });
      }
    } catch (error: any) {
      console.error('Create Ride Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Create Ride',
        text2: error.message || 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (
    item: LocationResult,
    type: 'start' | 'dest',
  ) => {
    console.log('Selected Location Details:', JSON.stringify(item, null, 2));

    if (type === 'start') {
      setStartLocation(item.display_name);
      setSelectedStart(item);
      setStartSuggestions([]);
    } else {
      setDestination(item.display_name);
      setSelectedDest(item);
      setDestSuggestions([]);
    }
    setActiveSearch(null);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');

    if (event.type === 'set' && selectedDate) {
      // For Android, we don't validate the date here
      // We'll validate the complete datetime after time is selected
      setDate(currentDate);
      setIsDateSelected(true);
      // On Android, show time picker after date is selected
      if (Platform.OS === 'android') {
        setShowTimePicker(true);
      }
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');

    if (event.type === 'set' && selectedTime) {
      // Combine the date part from 'date' state and time part from selectedTime
      const updatedDate = new Date(date);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());

      // Validate that the combined date/time is not in the past
      const now = new Date();
      if (updatedDate <= now) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Time',
          text2: 'Please select a future date and time',
        });
        return;
      }

      setDate(updatedDate);
      setIsDateSelected(true);
    }
  };

  const showDateTimePicker = () => {
    setShowDatePicker(true);
    if (Platform.OS === 'ios') {
      // iOS can show both at once, so we'll just use datetime mode
      setShowTimePicker(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create a Ride</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.instructions}>
            Share your journey and find a digni Ride passenger
          </Text>

          {/* Start Location */}
          <View
            style={[
              styles.inputGroup,
              { zIndex: activeSearch === 'start' ? 1000 : 1 },
            ]}
          >
            <Text style={styles.label}>Start Location</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Enter pickup location"
                placeholderTextColor={colors.textPlaceholder}
                value={startLocation}
                onFocus={() => setActiveSearch('start')}
                onChangeText={text => {
                  setStartLocation(text);
                  setSelectedStart(null);
                  debouncedSearch(text, 'start');
                }}
              />
              {isLoadingStart && (
                <ActivityIndicator
                  style={styles.loader}
                  size="small"
                  color={colors.primary}
                />
              )}
            </View>
            {activeSearch === 'start' && startSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {startSuggestions.map(item => (
                  <TouchableOpacity
                    key={item.place_id}
                    style={styles.suggestionItem}
                    onPress={() => handleLocationSelect(item, 'start')}
                  >
                    <Text style={styles.suggestionText} numberOfLines={2}>
                      {item.display_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Destination */}
          <View
            style={[
              styles.inputGroup,
              { zIndex: activeSearch === 'dest' ? 1000 : 1 },
            ]}
          >
            <Text style={styles.label}>Destination</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Enter drop-off location"
                placeholderTextColor={colors.textPlaceholder}
                value={destination}
                onFocus={() => setActiveSearch('dest')}
                onChangeText={text => {
                  setDestination(text);
                  setSelectedDest(null);
                  debouncedSearch(text, 'dest');
                }}
              />
              {isLoadingDest && (
                <ActivityIndicator
                  style={styles.loader}
                  size="small"
                  color={colors.primary}
                />
              )}
            </View>
            {activeSearch === 'dest' && destSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {destSuggestions.map(item => (
                  <TouchableOpacity
                    key={item.place_id}
                    style={styles.suggestionItem}
                    onPress={() => handleLocationSelect(item, 'dest')}
                  >
                    <Text style={styles.suggestionText} numberOfLines={2}>
                      {item.display_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Departure Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Departure Time</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={showDateTimePicker}
            >
              <Text
                style={[
                  styles.dateText,
                  !isDateSelected && { color: colors.textPlaceholder },
                ]}
              >
                {isDateSelected
                  ? date.toLocaleString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Select date & time'}
              </Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>

            {/* iOS Modal DateTime Picker */}
            {Platform.OS === 'ios' && showDatePicker && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={showDatePicker}
                onRequestClose={() => setShowDatePicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={styles.modalButton}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowDatePicker(false);
                          setIsDateSelected(true);
                        }}
                      >
                        <Text style={[styles.modalButton, styles.doneButton]}>
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={date}
                      mode="datetime"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          setDate(selectedDate);
                        }
                      }}
                      minimumDate={new Date()}
                      textColor={colors.textPrimary}
                    />
                  </View>
                </View>
              </Modal>
            )}

            {/* Android DateTime Pickers */}
            {Platform.OS === 'android' && showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            {showTimePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
          </View>

          {/* Note */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Note (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any additional details about the ride..."
              placeholderTextColor={colors.textPlaceholder}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Create Button */}
          <Button
            title={isLoading ? 'Creating Ride...' : 'Create Ride'}
            onPress={handleCreateRide}
            disabled={isLoading}
            variant="secondary"
            style={{ marginTop: perfectSize(16) }}
          />
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
  scrollContent: {
    padding: perfectSize(24),
  },
  instructions: {
    fontSize: scaleAndClampFontSize(16),
    color: colors.textSecondary,
    marginBottom: perfectSize(32),
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
    padding: perfectSize(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: scaleAndClampFontSize(14),
    color: colors.textPrimary,
  },
  dateInputContainer: {
    backgroundColor: colors.backgroundInput,
    borderRadius: perfectSize(8),
    padding: perfectSize(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: scaleAndClampFontSize(16),
    color: colors.textPrimary,
  },
  calendarIcon: {
    fontSize: scaleAndClampFontSize(16),
    opacity: 0.5,
  },
  textArea: {
    minHeight: perfectSize(100),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: perfectSize(20),
    borderTopRightRadius: perfectSize(20),
    paddingBottom: perfectSize(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: perfectSize(20),
    paddingVertical: perfectSize(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalButton: {
    fontSize: scaleAndClampFontSize(16),
    color: colors.primary,
  },
  doneButton: {
    fontWeight: '600',
  },
});

export default CreateRideScreen;
