import ToastContainer from '@components/ToastContainer';
import { NavbarWithSearch } from '@src/components/NavbarWithSearch';
import SocketProvider from '@src/components/SocketIO/SocketProvider';
import { useAddDynamicTextToDom } from '@src/utils/hooks/useAddDynamicTextToDom';
import useTheme from '@src/utils/hooks/useTheme';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Main App component
const App: React.FC = () => {
  const { toggleTheme: initTheme } = useTheme();

  useAddDynamicTextToDom('.Toastify', '↓  Clear All');

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <SocketProvider>
      <ToastContainer />
      <div className="flex h-screen w-screen flex-col bg-gray-100 dark:bg-blue-gray-900">
        <NavbarWithSearch />
        <div className="flex h-[calc(100%-80px)] flex-1">
          <Outlet />
        </div>
      </div>
    </SocketProvider>
  );
};

export default App;
