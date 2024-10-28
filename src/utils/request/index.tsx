import { X_ACCESS_TOKEN } from '@src/constants/LStorageKey';
import type { AxiosError } from 'axios';
import axios from 'axios';
import Toast from '../toastUtils';
import AxiosInstance from './axios';
import { retry } from './axiosRetry';
import { checkErrorStatus } from './checkErrorStatus';
import staticAxiosConfig from './config';
import HTTP_RES_CODE from './httpResCode';
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
    config.data?.data?.token && localStorage.setItem(X_ACCESS_TOKEN, config.data.data.token || '');
    if (config.config.params?.noResCheck) return config;
    if ((config.data?.code as number) > 0 && config.data?.code !== HTTP_RES_CODE.SUCCESS) {
      Toast.error(config.data?.message || 'Oops! Something went wrong!!!');
      return config;
    }
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
        Toast.error('Network is disconnected!');
        return;
      }
      Toast.error(`Request Error: ${err2}`);
    });
  },
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const useRequest = new AxiosInstance({
  directlyGetData: true,
  baseURL: BASE_URL || staticAxiosConfig.baseUrl,
  timeout: 30000,
  interceptors: _RequestInterceptors,
  abortRepetitiveRequest: true,
  retryConfig: {
    count: 1,
    waitTime: 1500,
  },
});

export default useRequest;
