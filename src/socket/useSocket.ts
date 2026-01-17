/**
 * Socket Hooks
 * React hooks for using socket events in components
 */

import { useEffect, useCallback } from 'react';
import socketManager from './socketManager';
import { RideEventPayload, RequestEventPayload } from './socketEvents';

/**
 * Hook to initialize socket connection
 * Call this in your main app component after user logs in
 */
export const useSocket = () => {
  useEffect(() => {
    socketManager.initialize();

    return () => {
      socketManager.cleanup();
    };
  }, []);

  return {
    isConnected: socketManager.isConnected(),
  };
};

/**
 * Hook to listen for ride events
 */
export const useRideEvents = (callbacks: {
  onRideCreated?: (data: RideEventPayload) => void;
  onRideCancelled?: (data: RideEventPayload) => void;
  onRideCompleted?: (data: RideEventPayload) => void;
}) => {
  const { onRideCreated, onRideCancelled, onRideCompleted } = callbacks;

  useEffect(() => {
    if (onRideCreated) {
      socketManager.onRideCreated(onRideCreated);
    }
    if (onRideCancelled) {
      socketManager.onRideCancelled(onRideCancelled);
    }
    if (onRideCompleted) {
      socketManager.onRideCompleted(onRideCompleted);
    }

    return () => {
      socketManager.removeRideListeners();
    };
  }, [onRideCreated, onRideCancelled, onRideCompleted]);
};

/**
 * Hook to listen for request events
 */
export const useRequestEvents = (callbacks: {
  onRequestCreated?: (data: RequestEventPayload) => void;
  onRequestAccepted?: (data: RequestEventPayload) => void;
  onRequestRejected?: (data: RequestEventPayload) => void;
  onRequestCancelled?: (data: RequestEventPayload) => void;
}) => {
  const {
    onRequestCreated,
    onRequestAccepted,
    onRequestRejected,
    onRequestCancelled,
  } = callbacks;

  useEffect(() => {
    if (onRequestCreated) {
      socketManager.onRequestCreated(onRequestCreated);
    }
    if (onRequestAccepted) {
      socketManager.onRequestAccepted(onRequestAccepted);
    }
    if (onRequestRejected) {
      socketManager.onRequestRejected(onRequestRejected);
    }
    if (onRequestCancelled) {
      socketManager.onRequestCancelled(onRequestCancelled);
    }

    return () => {
      socketManager.removeRequestListeners();
    };
  }, [
    onRequestCreated,
    onRequestAccepted,
    onRequestRejected,
    onRequestCancelled,
  ]);
};

/**
 * Hook to listen for all ride and request events
 */
export const useAllSocketEvents = (callbacks: {
  // Ride events
  onRideCreated?: (data: RideEventPayload) => void;
  onRideCancelled?: (data: RideEventPayload) => void;
  onRideCompleted?: (data: RideEventPayload) => void;
  // Request events
  onRequestCreated?: (data: RequestEventPayload) => void;
  onRequestAccepted?: (data: RequestEventPayload) => void;
  onRequestRejected?: (data: RequestEventPayload) => void;
  onRequestCancelled?: (data: RequestEventPayload) => void;
}) => {
  useRideEvents({
    onRideCreated: callbacks.onRideCreated,
    onRideCancelled: callbacks.onRideCancelled,
    onRideCompleted: callbacks.onRideCompleted,
  });

  useRequestEvents({
    onRequestCreated: callbacks.onRequestCreated,
    onRequestAccepted: callbacks.onRequestAccepted,
    onRequestRejected: callbacks.onRequestRejected,
    onRequestCancelled: callbacks.onRequestCancelled,
  });
};
