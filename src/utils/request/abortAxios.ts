import { AxiosRequestConfig } from 'axios';

/**
 * Cache cancel request
 */
const pendingMap = new Map<string, AbortController>();

/**
 * Create each request unique identification
 * @param config
 * @returns identification
 */
const getRequestId = (config: AxiosRequestConfig) => {
  return [config.url, config.method].join(':');
};

/**
 * Abort request class encapsulation
 */
class AbortAxios {
  addPending(config: AxiosRequestConfig) {
    this.removePending(config);
    const url = getRequestId(config);
    const abortController = new AbortController();
    config.signal = abortController.signal;
    if (!pendingMap.has(url)) {
      pendingMap.set(url, abortController);
    }
  }

  removePending(config: AxiosRequestConfig) {
    const url = getRequestId(config);
    if (pendingMap.has(url)) {
      const abortController = pendingMap.get(url);
      abortController?.abort();
      pendingMap.delete(url);
    }
  }

  removeAllPending() {
    pendingMap.forEach((abortController) => {
      abortController.abort();
    });
    this.clear();
  }

  clear() {
    pendingMap.clear();
  }
}

export default AbortAxios;
