import { AnyAction } from "redux";

export interface HomeStoreStateList {
    rides: any[];
    userLocation: { lat: number; lng: number } | null;
}

const initialState: HomeStoreStateList = {
    rides: [],
    userLocation: null,
};

export const SET_RIDES = "SET_RIDES";
export const SET_USER_LOCATION = "SET_USER_LOCATION";

export default function homeReducer(state = initialState, action: AnyAction) {
    switch (action.type) {
        case SET_RIDES:
            return {
                ...state,
                rides: action.payload,
            };
        case SET_USER_LOCATION:
            return {
                ...state,
                userLocation: action.payload,
            };
        default:
            return state;
    }
}
