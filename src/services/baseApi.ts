import { API_URL } from "../config";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import customAxios from "./axiosInstance";

interface ApiCallOptions {
    url: string;
    params?: Record<string, any>;
    data?: string | Record<string, any>;
    headers?: {};
}

interface MFACallOption {
    url: string;
    token: string;
    data: { email: string };
}

export const callApiGet = ({ url, params }: ApiCallOptions) => {
    return customAxios({ url, method: "GET", params });
};

export const callApiPost = ({ url, data, headers }: ApiCallOptions) => {
    return customAxios({ url, method: "POST", data, headers });
};

export const callApiPut = ({ url, data }: ApiCallOptions) => {
    return customAxios({ url, method: "PUT", data });
};

export const callApiDelete = ({ url, data }: ApiCallOptions) => {
    return customAxios({ url, method: "DELETE", data });
};

export const callApiPatch = ({ url, data, params }: ApiCallOptions) => {
    return customAxios({ url, method: "PATCH", data, params });
};

export const callApiWithToken = ({ url, token, data }: MFACallOption) => {
    let customHeader = {};
    if (token) {
        customHeader = { Authorization: `Bearer ${token}` };
    }
    const instance: AxiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
            ...customHeader,
            Accept: "application/json",
        },
    });
    const method = "POST";
    const config: AxiosRequestConfig = {
        url,
        method,
        data,
    };

    return instance(config);
};
