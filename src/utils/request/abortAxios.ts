import { AxiosRequestConfig } from 'axios';

/**
 * Cache cancel request
 */
const pendingMap = new Map<string, AbortController>();

/**
 * Abort request class encapsulation
 */
class AbortAxios {
  /**
   * Create each request unique identification
   * @param config
   * @returns identification
   */
  getRequestId = (url?: string, method?: string) => {
    return [url, method].join(':');
  };

  addPending(config: AxiosRequestConfig) {
    this.removePending(config.url, config.method);
    const url = this.getRequestId(config.url, config.method);
    const abortController = new AbortController();
    config.signal = abortController.signal;
    if (!pendingMap.has(url)) {
      pendingMap.set(url, abortController);
    }
  }

  removePending(curl: string = '', method?: string) {
    const url = this.getRequestId(curl, method);
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
