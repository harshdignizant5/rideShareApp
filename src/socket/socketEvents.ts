/**
 * Socket Event Constants
 * Defines all socket.io events used in the application
 */

export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Ride events
  RIDE_CREATED: 'ride:created',
  RIDE_CANCELLED: 'ride:cancelled',
  RIDE_COMPLETED: 'ride:completed',

  // Request events
  REQUEST_CREATED: 'request:created',
  REQUEST_ACCEPTED: 'request:accepted',
  REQUEST_REJECTED: 'request:rejected',
  REQUEST_CANCELLED: 'request:cancelled',
} as const;

// Type for socket events
export type SocketEventType =
  (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

// Event payload types
export interface RideEventPayload {
  id: string;
  riderId: string;
  startLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  endLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  departureTime: string;
  status: string;
  note?: string;
  rider?: {
    id: string;
    name: string;
    city: string;
    vehicleNumber: string;
  };
}

export interface RequestEventPayload {
  id: string;
  rideId: string;
  passengerId: string;
  message: string;
  status: string;
  passenger?: {
    id: string;
    name: string;
    city: string;
  };
  ride?: RideEventPayload;
}
