/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import AbortAxios from './abortAxios';
import type { AxiosOptions, RequestInterceptors, Respones } from './type';

class AxiosRequest {
  // Create a new instance of axios with axios.create function
  private axiosInstance: AxiosInstance;
  // configuration
  private options: AxiosOptions;
  // configuration
  private abortAxios: AbortAxios;
  // interceptors
  private interceptors: RequestInterceptors | undefined;
  constructor(options: AxiosOptions) {
    this.axiosInstance = axios.create(options);
    this.options = options;
    this.interceptors = options.interceptors;
    // initialize the interceptors
    this.setInterceptors();
    // Create cancel controller instance
    this.abortAxios = new AbortAxios();
  }

  getAbortAxios() {
    return this.abortAxios;
  }

  /**
   * register the interceptors
   */
  setInterceptors() {
    if (!this.interceptors) return;

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptor,
      responseInterceptorsCatch,
    } = this.interceptors;

    // request interceptors
    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // whether cancel the request
      const abortRepetitiveRequest =
        (config as unknown as any)?.abortRepetitiveRequest ?? this.options.abortRepetitiveRequest;
      if (abortRepetitiveRequest) {
        this.abortAxios.addPending(config);
      }
      if (requestInterceptors) {
        // Handle the original config by custom requestInterceptors
        config = requestInterceptors(config);
      }
      return config;
    }, requestInterceptorsCatch ?? undefined);

    // response interceptors
    this.axiosInstance.interceptors.response.use(
      (res: AxiosResponse) => {
        // remove the exist request from the pending list
        // Todo: add params to disallow remove
        res && this.abortAxios.removePending(res.config.url, res.config.method);

        if (responseInterceptor) {
          // Handle the response with custom responseInterceptors first
          res = responseInterceptor(res);
        }
        // Whether to directly get the data value according to the options.directlyGetData configuration option
        if (this.options.directlyGetData) {
          res = res.data;
        }
        return res;
      },
      (err: AxiosError) => {
        if (responseInterceptorsCatch) {
          // if responseInterceptorsCatch exists, then let it handle the return value
          return responseInterceptorsCatch(this.axiosInstance, err);
        }
        return err;
      },
    );
  }

  /**
   * Common request method
   */
  request<T = any>(config: AxiosOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Respones>>(config)
        .then((res) => {
          return resolve(res as unknown as Promise<T>);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  get<T = any>(config: AxiosOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' });
  }

  post<T = any>(config: AxiosOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' });
  }

  delete<T = any>(config: AxiosOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' });
  }

  uploadFile<T = any>(config: AxiosOptions): Promise<T> {
    return this.request<T>({
      ...config,
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export default AxiosRequest;
