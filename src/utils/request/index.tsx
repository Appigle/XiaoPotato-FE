import { X_ACCESS_TOKEN } from '@src/constants/LStorageKey';
import axios, { AxiosError } from 'axios';
import logUtils from '../logUtils';
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
    logUtils.info(config.config.url, config);
    config.data?.data?.token && localStorage.setItem(X_ACCESS_TOKEN, config.data.data.token || '');
    if (config.config.params?.noResCheck) return config;
    if ((config.data?.code as number) > 0 && config.data?.code !== HTTP_RES_CODE.SUCCESS) {
      if (config.data?.code === HTTP_RES_CODE.ERROR_40101) {
        window.localStorage.removeItem(X_ACCESS_TOKEN);
        window.location.href = '/';
        return config;
      }
      let errMessage = 'Oops! Something went wrong!';
      checkErrorStatus(config.data?.code, config.data?.message, (message) => {
        errMessage = message;
      });
      Toast.error(errMessage);
    }
    return config;
  },
  responseInterceptorsCatch(axiosInstance, err: AxiosError) {
    if (axios.isCancel(err)) {
      logUtils.warn(err?.config?.url);
      return Promise.reject(err);
    }
    return retry(axiosInstance, err as AxiosError, (err2) => {
      if (!window.navigator.onLine) {
        Toast.error('Network is disconnected!');
        return;
      }
      let errMessage = err2?.code === 'ECONNABORTED' ? 'Timeout' : undefined;
      checkErrorStatus((err2 as AxiosError)?.response?.status, errMessage, (message) => {
        errMessage = message;
      });
      Toast.error(errMessage);
    });
  },
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
const IS_PROD = import.meta.env.PROD;

const useRequest = new AxiosInstance({
  directlyGetData: true,
  baseURL: BASE_URL || staticAxiosConfig.baseUrl,
  timeout: IS_PROD ? 30000 : 1000 * 60,
  interceptors: _RequestInterceptors,
  abortRepetitiveRequest: true,
  retryConfig: {
    count: 1,
    waitTime: 1500,
  },
});

export default useRequest;
