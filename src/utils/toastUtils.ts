import { toast, ToastOptions } from 'react-toastify';

const Toast = toast;

export const showToast = (message: string, opt: ToastOptions | undefined) => {
  return Toast(message, opt);
};

export const dismissAllToast = () => Toast.dismiss();

export default Toast;
