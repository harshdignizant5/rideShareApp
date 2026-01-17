import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { perfectSize, scaleAndClampFontSize } from '../../utils/dimensions';
import { colors } from '../../utils/colors';
import { deleteRide, getRideRequests, acceptRideRequest, rejectRideRequest } from '@services/authServices/authServices';
import { useDispatch, useSelector } from 'react-redux';
import { SET_CREATED_RIDES } from '@store/reducers/appReducer';
import Toast from 'react-native-toast-message';
import { ArrowLeft, Trash2, MapPin, Flag, Clock, User, MessageCircle, Activity, Inbox } from 'lucide-react-native';

const MyRideDetailsScreen = () => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'MyRideDetails'>>();

    const { ride: initialRide } = route.params;

    const dispatch = useDispatch();
    const createdRides = useSelector((state: any) => state.appReducer.createdRides);
    // Find the live ride object from store
    const ride = createdRides?.find((r: any) => r.id === initialRide?.id) || initialRide;

    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<any[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    React.useEffect(() => {
        if (ride?.id) {
            fetchRequests();
        }
    }, [ride?.id]);

    const fetchRequests = async () => {
        setLoadingRequests(true);
        try {
            const response = await getRideRequests(ride.id);
            if (response?.data?.success) {
                setRequests(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Requests Error:", error);
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            const response = await acceptRideRequest(requestId);
            if (response?.data?.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Request Accepted',
                    text2: 'The passenger has been accepted.'
                });
                fetchRequests(); // Refresh requests
            }
        } catch (error: any) {
            console.error("Accept Request Error:", error);
            Toast.show({
                type: 'error',
                text1: 'Action Failed',
                text2: error?.response?.data?.message || error?.message || 'Could not accept request.'
            });
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            const response = await rejectRideRequest(requestId);
            if (response?.data?.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Request Rejected',
                    text2: 'The passenger request has been rejected.'
                });
                fetchRequests(); // Refresh requests
            }
        } catch (error: any) {
            console.log("Reject Request Error:", error?.response?.data);
            console.error("Reject Request Error:", error);
            Toast.show({
                type: 'error',
                text1: 'Action Failed',
                text2: error?.response?.data?.message || error?.message || 'Could not reject request.'
            });
        }
    };

    if (!ride) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={scaleAndClampFontSize(24)} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Ride Not Found</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>This ride is no longer available.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handleDeleteRide = () => {
        Alert.alert(
            "Delete Ride",
            "Are you sure you want to delete this ride?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await deleteRide(ride.id);
                            Toast.show({
                                type: 'success',
                                text1: 'Ride Deleted',
                                text2: 'Ride successfully deleted.'
                            });

                            // Remove locally from Redux store
                            const updatedRides = createdRides.filter((r: any) => r.id !== ride.id);
                            dispatch({ type: SET_CREATED_RIDES, payload: updatedRides });

                            navigation.goBack();
                        } catch (error: any) {
                            console.error("Delete Ride Error:", error);
                            Toast.show({
                                type: 'error',
                                text1: 'Delete Failed',
                                text2: 'Could not delete ride.'
                            });
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };
    console.log("requests", requests);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLeft size={scaleAndClampFontSize(24)} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ride Details</Text>
                <TouchableOpacity onPress={handleDeleteRide} style={styles.deleteButtonHeader}>
                    <Trash2 size={scaleAndClampFontSize(20)} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Route Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Route</Text>

                    <View style={styles.routeContainer}>
                        {/* Timeline Visual */}
                        <View style={styles.timelineContainer}>
                            <View style={[styles.dot, { backgroundColor: '#D3F9D8' }]}>
                                <MapPin size={10} color={colors.primary} />
                            </View>
                            <View style={styles.line} />
                            <View style={[styles.dot, { backgroundColor: '#E7F5FF' }]}>
                                <Flag size={10} color={colors.textSecondary} />
                            </View>
                        </View>

                        {/* Route Text */}
                        <View style={styles.routeTextContainer}>
                            <View style={styles.routeItem}>
                                <Text style={styles.routeLabel}>Start Location</Text>
                                <Text style={styles.routeValue}>{ride.from}</Text>
                            </View>
                            <View style={{ height: perfectSize(24) }} />
                            <View style={styles.routeItem}>
                                <Text style={styles.routeLabel}>End Location</Text>
                                <Text style={styles.routeValue}>{ride.to}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.timeRow}>
                        <Clock size={scaleAndClampFontSize(16)} color={colors.textSecondary} style={{ marginRight: perfectSize(8) }} />
                        <Text style={styles.timeText}>{ride.time}</Text>
                    </View>
                </View>

                {/* Requests Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Requests ({requests.length})</Text>
                    {loadingRequests ? (
                        <ActivityIndicator color={colors.primary} />
                    ) : requests.length > 0 ? (
                        requests.map((request: any) => (
                            <View key={request.id} style={styles.requestItem}>
                                <View style={styles.requesterHeader}>
                                    <View style={styles.requesterInfo}>
                                        <View style={styles.avatarPlaceholder}>
                                            <User size={scaleAndClampFontSize(16)} color={colors.textPrimary} />
                                        </View>
                                        <View>
                                            <Text style={styles.requesterName}>{request.passenger?.name || 'Unknown'}</Text>
                                            <Text style={styles.requesterCity}>{request.passenger?.city || 'Unknown City'}</Text>
                                        </View>
                                    </View>
                                </View>

                                {request.note && (
                                    <View style={styles.noteBubble}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MessageCircle size={14} color={colors.textPrimary} style={{ marginRight: 4 }} />
                                            <Text style={styles.noteContent}>{request.note}</Text>
                                        </View>
                                    </View>
                                )}

                                {request.status === 'PENDING' ? (
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity
                                            style={styles.acceptButton}
                                            onPress={() => handleAcceptRequest(request.id)}
                                        >
                                            <Text style={styles.acceptButtonText}>Accept</Text>
                                        </TouchableOpacity>
                                        <View style={{ width: perfectSize(12) }} />
                                        <TouchableOpacity
                                            style={styles.rejectButton}
                                            onPress={() => handleRejectRequest(request.id)}
                                        >
                                            <Text style={styles.rejectButtonText}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={[styles.statusBadge, request.status === 'ACCEPTED' ? styles.statusAccepted : styles.statusRejected]}>
                                        <Text style={[styles.statusText, request.status === 'ACCEPTED' ? styles.statusTextAccepted : styles.statusTextRejected]}>
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1).toLowerCase()}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.requestDivider} />
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noRequestsText}>No requests yet.</Text>
                    )}
                </View>

                {/* Rider Info Card - For "My Ride", this is me, so maybe redundant, but good for confirmation */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Calculated Details</Text>
                    <View style={styles.infoRow}>
                        <User size={scaleAndClampFontSize(16)} color={colors.textTertiary} style={{ marginRight: perfectSize(8) }} />
                        <Text style={styles.infoText}>Posted by You ({ride.user})</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Activity size={scaleAndClampFontSize(16)} color={colors.textTertiary} style={{ marginRight: perfectSize(8) }} />
                        <Text style={styles.infoText}>Status: {ride.status}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Inbox size={scaleAndClampFontSize(16)} color={colors.textTertiary} style={{ marginRight: perfectSize(8) }} />
                        <Text style={styles.infoText}>{ride.requests || 0} Request(s)</Text>
                    </View>
                </View>

                {/* Note Card */}
                {ride.note && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Note</Text>
                        <Text style={styles.noteText}>{ride.note}</Text>
                    </View>
                )}

            </ScrollView>

            {/* Footer - Delete Button (Alternative location) */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteRide}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.textWhite} />
                    ) : (
                        <Text style={styles.deleteButtonText}>Delete Ride</Text>
                    )}
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
    headerTitle: {
        fontSize: scaleAndClampFontSize(18),
        fontWeight: '700',
        color: colors.textPrimary,
    },
    deleteButtonHeader: {
        padding: perfectSize(8),
    },
    deleteButtonTextHeader: {
        fontSize: scaleAndClampFontSize(20),
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
        // fontSize: scaleAndClampFontSize(16),
        // marginRight: perfectSize(8),
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
        // fontSize: scaleAndClampFontSize(16),
        // width: perfectSize(24),
        // color: colors.textTertiary,
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
    footer: {
        padding: perfectSize(16),
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    deleteButton: {
        backgroundColor: '#FFE5E5',
        borderRadius: perfectSize(8),
        paddingVertical: perfectSize(16),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFD0D0',
    },
    deleteButtonText: {
        color: '#D92D20',
        fontSize: scaleAndClampFontSize(16),
        fontWeight: '700',
    },
    // Request Item Styles
    requestItem: {
        marginBottom: perfectSize(16),
    },
    requesterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: perfectSize(8),
    },
    requesterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: perfectSize(32),
        height: perfectSize(32),
        borderRadius: perfectSize(16),
        backgroundColor: colors.backgroundInput,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: perfectSize(12),
    },
    avatarText: {
        fontSize: scaleAndClampFontSize(16),
    },
    requesterName: {
        fontSize: scaleAndClampFontSize(16),
        fontWeight: '600',
        color: colors.textPrimary,
    },
    requesterCity: {
        fontSize: scaleAndClampFontSize(12),
        color: colors.textSecondary,
    },
    noteBubble: {
        backgroundColor: colors.backgroundInput,
        padding: perfectSize(12),
        borderRadius: perfectSize(8),
        marginBottom: perfectSize(12),
    },
    noteContent: {
        fontSize: scaleAndClampFontSize(14),
        color: colors.textPrimary,
    },
    actionButtons: {
        flexDirection: 'row',
        marginBottom: perfectSize(12),
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#00C853', // Green
        paddingVertical: perfectSize(10),
        borderRadius: perfectSize(8),
        alignItems: 'center',
    },
    acceptButtonText: {
        color: colors.textWhite,
        fontWeight: '700',
        fontSize: scaleAndClampFontSize(14),
    },
    rejectButton: {
        flex: 1,
        backgroundColor: colors.background,
        paddingVertical: perfectSize(10),
        borderRadius: perfectSize(8),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D92D20',
    },
    rejectButtonText: {
        color: '#D92D20', // Red
        fontWeight: '700',
        fontSize: scaleAndClampFontSize(14),
    },
    requestDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginTop: perfectSize(4),
    },
    noRequestsText: {
        color: colors.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: perfectSize(16),
    },
    statusBadge: {
        paddingVertical: perfectSize(8),
        paddingHorizontal: perfectSize(16),
        borderRadius: perfectSize(8),
        alignSelf: 'flex-start',
        marginBottom: perfectSize(12),
    },
    statusAccepted: {
        backgroundColor: '#E8F5E9', // Light Green
    },
    statusRejected: {
        backgroundColor: '#FFEBEE', // Light Red
    },
    statusText: {
        fontWeight: '700',
        fontSize: scaleAndClampFontSize(14),
    },
    statusTextAccepted: {
        color: '#2E7D32', // Green
    },
    statusTextRejected: {
        color: '#C62828', // Red
    },
});

export default MyRideDetailsScreen;
