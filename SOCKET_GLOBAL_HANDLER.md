# Global Socket Event Handler

## ✅ Implementation Complete!

All socket events are now handled in one centralized file that dispatches Redux actions.

## 📁 File Structure

```
src/socket/
└── socketEventHandler.ts  ← Global socket event handler
```

## 🎯 How It Works

### 1. **Initialize in HomeScreen**

```typescript
// In HomeScreen.tsx
import socketEventHandler from '../../socket/socketEventHandler';

useEffect(() => {
  // Initialize with Redux dispatch
  socketEventHandler.initialize(dispatch);
}, [dispatch]);
```

### 2. **Socket Events → Redux Actions**

All socket events automatically dispatch Redux actions:

| Socket Event        | Redux Action Type          |
| ------------------- | -------------------------- |
| `ride:created`      | `SOCKET_RIDE_CREATED`      |
| `ride:cancelled`    | `SOCKET_RIDE_CANCELLED`    |
| `ride:completed`    | `SOCKET_RIDE_COMPLETED`    |
| `request:created`   | `SOCKET_REQUEST_CREATED`   |
| `request:accepted`  | `SOCKET_REQUEST_ACCEPTED`  |
| `request:rejected`  | `SOCKET_REQUEST_REJECTED`  |
| `request:cancelled` | `SOCKET_REQUEST_CANCELLED` |
| `connect`           | `SOCKET_CONNECTED`         |
| `disconnect`        | `SOCKET_DISCONNECTED`      |
| `connect_error`     | `SOCKET_ERROR`             |

### 3. **Handle in Your Reducers**

Now you can handle these socket events in your Redux reducers:

```typescript
// In appReducer.ts or homeReducer.ts
export default function appReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case 'SOCKET_RIDE_CREATED':
      // Add new ride to state
      return {
        ...state,
        rides: [action.payload, ...state.rides],
      };

    case 'SOCKET_RIDE_CANCELLED':
      // Remove cancelled ride
      return {
        ...state,
        rides: state.rides.filter(ride => ride.id !== action.payload.id),
      };

    case 'SOCKET_RIDE_COMPLETED':
      // Update ride status
      return {
        ...state,
        rides: state.rides.map(ride =>
          ride.id === action.payload.id
            ? { ...ride, status: 'COMPLETED' }
            : ride,
        ),
      };

    case 'SOCKET_REQUEST_CREATED':
      // Show notification, update badge count
      return {
        ...state,
        requestCount: state.requestCount + 1,
      };

    case 'SOCKET_REQUEST_ACCEPTED':
      // Update request status
      console.log('Request accepted:', action.payload);
      return state;

    case 'SOCKET_CONNECTED':
      return {
        ...state,
        socketConnected: true,
      };

    case 'SOCKET_DISCONNECTED':
      return {
        ...state,
        socketConnected: false,
      };

    default:
      return state;
  }
}
```

## 🔄 Complete Flow

```
Backend emits event (e.g., 'ride:created')
    ↓
socketEventHandler receives it
    ↓
Console logs: "Socket ====> ride:created { data }"
    ↓
Dispatches Redux action: { type: 'SOCKET_RIDE_CREATED', payload: data }
    ↓
Your reducer handles it
    ↓
State updates
    ↓
Components re-render with new data
```

## 📝 Event Payload Examples

### ride:created

```json
{
  "id": "abc-123",
  "riderId": "user-456",
  "startLocation": {
    "lat": 40.7128,
    "lng": -74.006,
    "address": "New York, NY"
  },
  "endLocation": {
    "lat": 40.758,
    "lng": -73.9855,
    "address": "Times Square, NY"
  },
  "departureTime": "2026-01-20T10:00:00Z",
  "status": "OPEN",
  "rider": {
    "id": "user-456",
    "name": "John Doe",
    "city": "New York",
    "vehicleNumber": "NY-1234"
  }
}
```

### request:created

```json
{
  "id": "req-789",
  "rideId": "abc-123",
  "passengerId": "user-999",
  "message": "I'd like to join!",
  "status": "PENDING",
  "passenger": {
    "id": "user-999",
    "name": "Jane Smith",
    "city": "New York"
  }
}
```

## 🎨 Usage Pattern

### Step 1: Add Action Types

Create constants for your socket actions:

```typescript
// store/constant.ts
export const SOCKET_RIDE_CREATED = 'SOCKET_RIDE_CREATED';
export const SOCKET_RIDE_CANCELLED = 'SOCKET_RIDE_CANCELLED';
export const SOCKET_REQUEST_CREATED = 'SOCKET_REQUEST_CREATED';
// ... etc
```

### Step 2: Handle in Reducer

```typescript
// store/reducers/appReducer.ts
import {
  SOCKET_RIDE_CREATED,
  SOCKET_RIDE_CANCELLED,
  SOCKET_REQUEST_CREATED,
} from '../constant';

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case SOCKET_RIDE_CREATED:
      // Your logic here
      return { ...state, rides: [action.payload, ...state.rides] };

    case SOCKET_RIDE_CANCELLED:
      // Your logic here
      return {
        ...state,
        rides: state.rides.filter(r => r.id !== action.payload.id),
      };

    case SOCKET_REQUEST_CREATED:
      // Your logic here
      return { ...state, requestCount: state.requestCount + 1 };

    default:
      return state;
  }
}
```

### Step 3: Components Auto-Update

Your components will automatically re-render when the Redux state changes!

```typescript
// Any component
const HomeScreen = () => {
  const rides = useSelector((state: any) => state.appReducer.rides);

  // This will automatically update when socket events change the rides
  return (
    <FlatList data={rides} {...} />
  );
};
```

## 🔌 Lifecycle

| Event          | When                    | Action                             |
| -------------- | ----------------------- | ---------------------------------- |
| **Initialize** | User reaches HomeScreen | Socket connects, events registered |
| **Active**     | User using app          | Events dispatching to Redux        |
| **Logout**     | User clicks logout      | Socket disconnects, events cleared |

## 💡 Benefits

✅ **Centralized** - All socket logic in one file  
✅ **Redux Integration** - Events → Actions → State updates  
✅ **Automatic Updates** - Components re-render on state changes  
✅ **Clean Separation** - Socket logic separate from UI logic  
✅ **Easy to Extend** - Add new events without touching components  
✅ **Type Safe** - TypeScript types for all events

## 🐛 Debugging

Check your console for:

```
🚀 HomeScreen: Initializing global socket event handler...
🎯 Setting up global socket event handlers...
✅ Socket connected: abc123
✅ Global socket event handlers initialized

Socket ====> ride:created { ... }
Socket ====> request:created { ... }
```

## 🎉 Next Steps

1. **Add action type constants** in `store/constant.ts`
2. **Handle socket actions in your reducer** (appReducer.ts)
3. **Test with backend** - Emit events and see Redux state update
4. **Add notifications** - Show Toast when requests are created
5. **Update UI** - Rides list updates automatically

Everything is wired up and ready to use! Just add your reducer logic! 🚀
