import { UserData } from '@services/authServices/authTypes';
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  RESET_AUTH_DATA,
  SET_IS_ACCOUNT_ACTIVE,
  SET_JWT_TOKEN,
  SET_REFRESH_TOKEN,
  SET_USER_DATA,
} from '@store/constant';
import { AnyAction } from 'redux';

export interface UserStoreStateList {
  JWTToken: string;
  userData: UserData;
  refreshToken: string;
  isAccountActive?: boolean;
  isLoading: boolean;
  error: string | null;
  loginData: any;
}

const initialState: UserStoreStateList = {
  JWTToken: '',
  refreshToken: '',
  userData: {} as UserData,
  loginData: {} as any,
  isLoading: false,
  error: null,
};

export default function authReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loginData: action.payload,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case SET_JWT_TOKEN:
      return {
        ...state,
        JWTToken: action.payload,
      };

    case SET_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };

    case SET_REFRESH_TOKEN:
      return {
        ...state,
        refreshToken: action.payload,
      };

    case SET_IS_ACCOUNT_ACTIVE:
      return {
        ...state,
        isAccountActive: action.payload,
      };

    case LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case LOGOUT_SUCCESS:
      return initialState;

    case LOGOUT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case RESET_AUTH_DATA:
      return initialState;

    default:
      return state;
  }
}
