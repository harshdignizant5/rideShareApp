/**
 * Global Socket Event Handlers
 * Centralized socket event listeners that dispatch Redux actions
 */

import { Dispatch } from 'redux';
import socketManager from '../socket/socketManager';

class SocketEventHandler {
  private dispatch: Dispatch | null = null;
  private initialized = false;

  /**
   * Initialize socket event listeners
   * @param dispatch - Redux dispatch function
   */
  initialize(dispatch: Dispatch) {
    if (this.initialized) {
      console.log('⚠️ Socket events already initialized');
      return;
    }

    this.dispatch = dispatch;

    // Initialize socket connection
    socketManager.initialize();

    // Get socket instance
    const socket = socketManager.getSocket();

    if (!socket) {
      console.error('❌ Socket instance not available');
      return;
    }

    console.log('🎯 Setting up global socket event handlers...');

    // ============================================
    // RIDE EVENTS
    // ============================================

    socket.on('ride:created', (data: any) => {
      console.log('Socket ====> ride:created', data);

      // Dispatch Redux action
      if (this.dispatch) {
        this.dispatch({
          type: 'SOCKET_RIDE_CREATED',
          payload: data,
        });
      }
    });

    socket.on('ride:cancelled', (data: any) => {
      console.log('Socket ====> ride:cancelled', data);

      if (this.dispatch) {
        this.dispatch({
          type: 'SOCKET_RIDE_CANCELLED',
          payload: data,
        });
      }
    });

    socket.on('ride:completed', (data: any) => {
      console.log('Socket ====> ride:completed', data);

      if (this.dispatch) {
        this.dispatch({
          type: 'SOCKET_RIDE_COMPLETED',
          payload: data,
        });
      }
    });

    // ============================================
    // REQUEST EVENTS
    // ============================================

    socket.on('request:created', (data: any) => {
      console.log('Socket ====> request:created', data);

      if (this.dispatch) {
        this.dispatch({
          type: 'SOCKET_REQUEST_CREATED',
          payload: data,
        });
      }
    });

    socket.on('request:accepted', (data: any) => {
      console.log('Socket ====> request:accepted', data);

      if (this.dispatch) {
        this.dispatch({
          type: 'SOCKET_REQUEST_ACCEPTED',
          payload: data,
        });
      }
    });

    socket.on('request:rejected', (data: any) => {
      console.log('Socket ====> request:rejected', data);

      if (this.dispatch) {
        this.dispatch({
          type: 'SOCKET_REQUEST_REJECTED',
          payload: data,
        });
      }
    });

    socket.on('request:cancelled', (data: any) => {
      console.log('Socket ====> request:cancelled', data);

      if (this.dispatch) {
        this.dispatch({
          type: 'SOCKET_REQUEST_CANCELLED',
          payload: data,
        });
      }
    });

    // ============================================
    // CONNECTION EVENTS
    // ============================================

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);

      if (this.dispatch) {
        this.dispatch({
          type: 'SOCKET_CONNECTED',
          payload: { socketId: socket.id },
        });
      }
    });

    socket.on('disconnect', (reason: string) => {
      console.log('❌ Socket disconnected:', reason);

      if (this.dispatch) {
        this.dispatch({
          type: 'SOCKET_DISCONNECTED',
          payload: { reason },
        });
      }
    });

    socket.on('connect_error', (error: Error) => {
      console.error('🔴 Socket connection error:', error.message);

      if (this.dispatch) {
        this.dispatch({
          type: 'SOCKET_ERROR',
          payload: { error: error.message },
        });
      }
    });

    this.initialized = true;
    console.log('✅ Global socket event handlers initialized');
  }

  /**
   * Cleanup socket events and disconnect
   */
  cleanup() {
    console.log('🔌 Cleaning up socket event handlers...');

    socketManager.cleanup();
    this.dispatch = null;
    this.initialized = false;

    console.log('✅ Socket event handlers cleaned up');
  }

  /**
   * Check if initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Export singleton instance
export default new SocketEventHandler();
