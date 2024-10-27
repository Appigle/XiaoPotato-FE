import i18n from '../i18n';
/**
 * Check the error status
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function checkErrorStatus(
  status: number | undefined,
  message: string | undefined,
  callback: (errorMessage: string) => void,
) {
  let errorMessage = message ?? '';
  if (status) {
    const key = 'Err_' + status;
    errorMessage = i18n.t(key as any);
  }
  callback(errorMessage || 'Oops something went wrong!');
}
