import { AnyAction } from 'redux';

export interface AppStoreStateList {
  rides: any[];
  createdRides: any[];
  userLocation: { lat: number; lng: number } | null;
  savedAddresses: any[];
}

const initialState: AppStoreStateList = {
  rides: [],
  createdRides: [],
  userLocation: null,
  savedAddresses: [],
};

export const SET_RIDES = 'SET_RIDES';
export const SET_CREATED_RIDES = 'SET_CREATED_RIDES';
export const SET_USER_LOCATION = 'SET_USER_LOCATION';
export const SET_SAVED_ADDRESSES = 'SET_SAVED_ADDRESSES';

export default function appReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_RIDES:
      return {
        ...state,
        rides: action.payload,
      };
    case SET_CREATED_RIDES:
      return {
        ...state,
        createdRides: action.payload,
      };
    case SET_USER_LOCATION:
      return {
        ...state,
        userLocation: action.payload,
      };
    case SET_SAVED_ADDRESSES:
      return {
        ...state,
        savedAddresses: action.payload,
      };
    default:
      return state;
  }
}
