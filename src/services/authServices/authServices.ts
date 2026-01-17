import { API_URL } from '../../config';
import axios from 'axios';
import {
  callApiDelete,
  callApiGet,
  callApiPatch,
  callApiPost,
  callApiPut,
} from '../baseApi';
import { ENDPOINTS } from './authEndPoints';
import { RefreshPayload } from './authTypes';

// Use a dedicated axios instance for refresh to avoid interceptor loops and stale Authorization headers
const refreshAxios = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (data: any) => {
  return callApiPost({ url: ENDPOINTS.REGISTER, data });
};

export const updateUser = async (data: any) => {
  return callApiPatch({ url: ENDPOINTS.UPDATE_USER, data });
};

export const createRide = async (data: any) => {
  return callApiPost({ url: ENDPOINTS.CREATE_RIDE, data });
};

export const getRides = async (params?: any) => {
  return callApiGet({ url: ENDPOINTS.GET_RIDES, params });
};

export const getCreatedRides = async () => {
  return callApiGet({ url: ENDPOINTS.GET_CREATED_RIDES });
};

export const requestRide = async (rideId: string, data: any) => {
  return callApiPost({ url: `/rides/${rideId}/request`, data });
};

export const verifyUser = async (data: any) => {
  return callApiPost({ url: ENDPOINTS.REGISTER, data });
};

export const verifyEmailAtLogin = async (data: any, headers: {}) => {
  return callApiPost({ url: ENDPOINTS.VERIFY_EMAIL_AT_LOGIN, data, headers });
};

export const verifyOtp = async (data: any, headers?: {}) => {
  return callApiPost({ url: ENDPOINTS.VERIFY_OTP, data, headers });
};

export const updateRefreshToken = async (data: RefreshPayload, headers: {}) => {
  return refreshAxios.post(ENDPOINTS.REFRESH_TOKEN, data, { headers });
};

export const setLogOut = async () => {
  return callApiPost({ url: ENDPOINTS.LOG_OUT });
};

export const resendOtp = async (data: any) => {
  return callApiPost({ url: ENDPOINTS.RESEND_OTP, data });
};

export const mfaEmail = async (data: any) => {
  return callApiPost({ url: ENDPOINTS.MFA_EMAIL, data });
};

export const authLogin = async (data: any) => {
  return callApiPost({ url: ENDPOINTS.LOGIN, data });
};

export const resetPassword = async (data: any) => {
  return callApiPost({ url: ENDPOINTS.RESET_PASSWORD, data });
};

export const suggestUsername = async (data: any) => {
  return callApiPost({ url: ENDPOINTS.USERNAME_SUGGEST, data });
};

export const resetMFA = async (data: any) => {
  return callApiPost({ url: ENDPOINTS.RESET_MFA, data });
};

export const checkIsDataValidate = async (data: any) => {
  return callApiPost({ url: ENDPOINTS.DATA_VALIDATE, data });
};

export const sendQrCode = async (data: any) => {
  return callApiPost({
    url: ENDPOINTS.SEND_QR_CODE,
    data,
  });
};

export const verifyQrCode = async (data: any, headers: {}) => {
  return callApiPost({
    url: ENDPOINTS.VERIFY_QR_CODE,
    data,
    headers,
  });
};

export const updatePassword = async (data: any) => {
  return callApiPost({
    url: ENDPOINTS.SET_PASSWORD,
    data,
  });
};

export const addAlternateEmail = async (data: any) => {
  return callApiPost({
    url: ENDPOINTS.ADD_ALTERNATE_EMAIL,
    data,
  });
};

export const verifyUserLogin = async () => {
  return callApiPost({
    url: ENDPOINTS.VERIFY_LOGIN,
  });
};

export const resendAlternateEmail = async (data: any) => {
  return callApiPost({
    url: ENDPOINTS.ALTERNATE_EMAIL_RESEND,
    data,
  });
};

export const deleteAlternateEmail = async (data: any) => {
  return callApiDelete({
    url: ENDPOINTS.ALTERNATE_EMAIL_DELETE,
    data,
  });
};

export const logoutApi = () => {
  return callApiPost({
    url: ENDPOINTS.LOGOUT,
    data: {},
  });
};
