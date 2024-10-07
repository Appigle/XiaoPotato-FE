import { X_ACCESS_TOKEN } from '@src/constants/LStorageKey';
import type { AxiosError } from 'axios';
import axios from 'axios';
import AxiosInstance from './axios';
import { retry } from './axiosRetry';
import { checkErrorStatus } from './checkErrorStatus';
import staticAxiosConfig from './config';
import { RequestInterceptors } from './type';

const _RequestInterceptors: RequestInterceptors = {
  requestInterceptors(config) {
    const token = localStorage.getItem(X_ACCESS_TOKEN);
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  },
  requestInterceptorsCatch(err) {
    return err;
  },
  responseInterceptor(config) {
    return config;
  },
  responseInterceptorsCatch(axiosInstance, err: AxiosError) {
    let errMessage = err.code === 'ECONNABORTED' ? 'Timeout' : undefined;
    if (axios.isCancel(err)) {
      // TODO: handle error
      console.log(
        '%c [ "Cancel request" ]-28',
        'font-size:13px; background:pink; color:#bf2c9f;',
        'Cancel request',
      );
      return Promise.reject(err);
    }
    checkErrorStatus((err as AxiosError).response?.status, errMessage, (message) => {
      errMessage = message;
      console.log(
        '%c [ Error: message ]-27',
        'font-size:13px; background:pink; color:#bf2c9f;',
        message,
      );
    });
    return retry(axiosInstance, err as AxiosError, (err2) => {
      if (!window.navigator.onLine) {
        alert('Network is disconnected!');
        return;
      }
      alert(`Request Error: ${err2}`);
    });
  },
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const useRequest = new AxiosInstance({
  directlyGetData: true,
  baseURL: BASE_URL || staticAxiosConfig.baseUrl,
  timeout: 3000,
  interceptors: _RequestInterceptors,
  abortRepetitiveRequest: true,
  retryConfig: {
    count: 5,
    waitTime: 500,
  },
});

export default useRequest;
