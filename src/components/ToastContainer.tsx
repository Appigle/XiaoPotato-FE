import useGlobalStore from '@src/stores/useGlobalStore';
import { ToastContainer as ToastComp } from 'react-toastify';
const ToastContainer = () => {
  const { currentTheme } = useGlobalStore();
  return (
    <>
      <ToastComp theme={currentTheme} style={{ zIndex: 10000 }} />
    </>
  );
};

export default ToastContainer;
