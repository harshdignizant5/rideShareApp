/**
 * Socket Manager
 * High-level API for managing socket events related to rides and requests
 */

import socketService from './socketService';
import {
  SOCKET_EVENTS,
  RideEventPayload,
  RequestEventPayload,
} from './socketEvents';

class SocketManager {
  /**
   * Initialize socket connection
   * Should be called after user logs in
   */
  initialize() {
    socketService.connect();
  }

  /**
   * Cleanup socket connection
   * Should be called when user logs out
   */
  cleanup() {
    socketService.disconnect();
  }

  // ============================================
  // RIDE EVENTS - LISTENERS
  // ============================================

  /**
   * Listen for new ride created
   */
  onRideCreated(callback: (data: RideEventPayload) => void) {
    socketService.on(SOCKET_EVENTS.RIDE_CREATED, data => {
      console.log('🚴 Socket ====> New ride created:', data);
      callback(data);
    });
  }

  /**
   * Listen for ride cancelled
   */
  onRideCancelled(callback: (data: RideEventPayload) => void) {
    socketService.on(SOCKET_EVENTS.RIDE_CANCELLED, data => {
      console.log('❌  Socket ====> Ride cancelled:', data);
      callback(data);
    });
  }

  /**
   * Listen for ride completed
   */
  onRideCompleted(callback: (data: RideEventPayload) => void) {
    socketService.on(SOCKET_EVENTS.RIDE_COMPLETED, data => {
      console.log('✅  Socket ====> Ride completed:', data);
      callback(data);
    });
  }

  // ============================================
  // REQUEST EVENTS - LISTENERS
  // ============================================

  /**
   * Listen for new request created
   */
  onRequestCreated(callback: (data: RequestEventPayload) => void) {
    socketService.on(SOCKET_EVENTS.REQUEST_CREATED, data => {
      console.log('📩  Socket ====> New request created:', data);
      callback(data);
    });
  }

  /**
   * Listen for request accepted
   */
  onRequestAccepted(callback: (data: RequestEventPayload) => void) {
    socketService.on(SOCKET_EVENTS.REQUEST_ACCEPTED, data => {
      console.log('✅  Socket ====> Request accepted:', data);
      callback(data);
    });
  }

  /**
   * Listen for request rejected
   */
  onRequestRejected(callback: (data: RequestEventPayload) => void) {
    socketService.on(SOCKET_EVENTS.REQUEST_REJECTED, data => {
      console.log('❌  Socket ====> Request rejected:', data);
      callback(data);
    });
  }

  /**
   * Listen for request cancelled
   */
  onRequestCancelled(callback: (data: RequestEventPayload) => void) {
    socketService.on(SOCKET_EVENTS.REQUEST_CANCELLED, data => {
      console.log('🚫  Socket ====> Request cancelled:', data);
      callback(data);
    });
  }

  // ============================================
  // REMOVE LISTENERS
  // ============================================

  /**
   * Remove ride event listeners
   */
  removeRideListeners() {
    socketService.off(SOCKET_EVENTS.RIDE_CREATED);
    socketService.off(SOCKET_EVENTS.RIDE_CANCELLED);
    socketService.off(SOCKET_EVENTS.RIDE_COMPLETED);
  }

  /**
   * Remove request event listeners
   */
  removeRequestListeners() {
    socketService.off(SOCKET_EVENTS.REQUEST_CREATED);
    socketService.off(SOCKET_EVENTS.REQUEST_ACCEPTED);
    socketService.off(SOCKET_EVENTS.REQUEST_REJECTED);
    socketService.off(SOCKET_EVENTS.REQUEST_CANCELLED);
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    socketService.removeAllListeners();
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return socketService.isConnected();
  }

  /**
   * Get the socket instance for direct access
   */
  getSocket() {
    return socketService.getSocket();
  }
}

// Export singleton instance
export default new SocketManager();
