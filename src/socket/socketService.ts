/**
 * Socket.IO Client Instance
 * Manages WebSocket connection to the backend server
 */

import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config';
import { store } from '@store/index';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  /**
   * Initialize socket connection
   */
  connect(): Socket {
    if (this.socket?.connected) {
      console.log('📡 Socket already connected');
      return this.socket;
    }

    // Get base URL without /api/v1
    const socketUrl = API_URL.replace('/api/v1', '');

    console.log('📡 Connecting to socket:', socketUrl);

    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 20000,
      autoConnect: true,
      auth: cb => {
        // Get JWT token from Redux store
        const state = store.getState();
        const token = state.authReducer.JWTToken;

        if (token) {
          cb({ token });
        } else {
          cb({});
        }
      },
    });

    this.setupEventListeners();

    return this.socket;
  }

  /**
   * Setup connection event listeners
   */
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', reason => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', error => {
      console.error('🔴 Socket connection error:', error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('🔴 Max reconnection attempts reached');
      }
    });

    this.socket.on('error', error => {
      console.error('🔴 Socket error:', error);
    });
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Emit event to server
   */
  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
      console.log('📤 Emitted:', event, data);
    } else {
      console.warn('⚠️ Socket not connected. Cannot emit:', event);
    }
  }

  /**
   * Listen to event from server
   */
  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
      console.log('👂 Listening to:', event);
    }
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
      console.log('🔇 Stopped listening to:', event);
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): void {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      console.log('🔇 Removed all listeners for:', event || 'all events');
    }
  }
}

// Export singleton instance
export default new SocketService();
