import type { AxiosError, AxiosInstance } from 'axios';

export function retry(
  instance: AxiosInstance,
  err: AxiosError,
  onRetryEnd?: (err?: AxiosError, count?: number) => void,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any = err.config;
  const { waitTime, count } = config.retryConfig ?? {};
  config.currentCount = config.currentCount ?? 0;
  console.log(
    `%c [ Url: ${config.url} ]`,
    'font-size:13px; background:pink; color:#bf2c9f;',
    `Retry: ${config.currentCount}`,
  );
  if (config.currentCount >= count) {
    // eslint-disable-next-line
    onRetryEnd && onRetryEnd(err, count);
    return Promise.reject(err);
  }
  config.currentCount++;
  return wait(waitTime).then(() => instance(config));
}

function wait(waitTime: number) {
  return new Promise((resolve) => setTimeout(resolve, waitTime));
}
