/**
 * Socket Module Exports
 * Central export point for all socket-related functionality
 */

export { default as socketService } from './socketService';
export { default as socketManager } from './socketManager';
export { SOCKET_EVENTS } from './socketEvents';
export type {
  RideEventPayload,
  RequestEventPayload,
  SocketEventType,
} from './socketEvents';
export {
  useSocket,
  useRideEvents,
  useRequestEvents,
  useAllSocketEvents,
} from './useSocket';
