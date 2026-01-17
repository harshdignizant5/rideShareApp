import { UserData } from '@services/authServices/authTypes';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  RESET_AUTH_DATA,
  SET_IS_ACCOUNT_ACTIVE,
  SET_JWT_TOKEN,
  SET_REFRESH_TOKEN,
  SET_USER_DATA,
} from '@store/constant';

export const setUserData = (payload: UserData) => {
  return { type: SET_USER_DATA, payload };
};

export const setJWTToken = (payload: string) => {
  return { type: SET_JWT_TOKEN, payload };
};

export const setRefreshToken = (payload: string) => {
  return { type: SET_REFRESH_TOKEN, payload };
};

export const resetAuthData = () => {
  return { type: RESET_AUTH_DATA };
};

export const setIsAccountActive = (payload: boolean) => {
  return { type: SET_IS_ACCOUNT_ACTIVE, payload };
};

export const loginRequest = (payload: any) => {
  return { type: LOGIN_REQUEST, payload };
};

export const setLoginData = (payload: any) => {
  return { type: LOGIN_SUCCESS, payload };
};

export const loginFailure = (payload: string) => {
  return { type: LOGIN_FAILURE, payload };
};

export const logoutRequest = () => {
  return { type: LOGOUT_REQUEST };
};

export const logoutSuccess = () => {
  return { type: LOGOUT_SUCCESS };
};

export const logoutFailure = (payload: string) => {
  return { type: LOGOUT_FAILURE, payload };
};
