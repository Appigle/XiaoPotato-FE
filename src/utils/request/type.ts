/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

/**
 *  configuration of axios instance, extend AxiosRequestConfig
 */
export interface AxiosOptions extends AxiosRequestConfig {
  // Whether get response data directly
  directlyGetData?: boolean;
  // Define default interceptors
  interceptors?: RequestInterceptors;
  // cancel repeated request config
  abortRepetitiveRequest?: boolean;
  // reconnect count time config
  retryConfig?: {
    // retry count
    count: number;
    // retry wait time
    waitTime: number;
  };
}

/**
 *  define interceptors abstract class, implement in index.ts
 */
export abstract class RequestInterceptors {
  // request interceptor
  abstract requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  // request error interceptor
  abstract requestInterceptorsCatch: (err: Error) => Error;
  // response interceptor
  abstract responseInterceptor?: (res: AxiosResponse) => AxiosResponse;
  // response error interceptor
  abstract responseInterceptorsCatch?: (axiosInstance: AxiosInstance, error: AxiosError) => void;
}

/**
 *  define return response type
 */
export interface Respones<T = any> {
  code: number;
  result: T;
}
