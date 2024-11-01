/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect } from 'react';
export type SocketContextType = {
  socket: any | null;
  isAlive: boolean;
  socketSent: (eN: string, data: any) => void;
};
export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isAlive: false,
  socketSent: () => undefined,
});

export const useSocketContext = () => useContext(SocketContext);

export const useSocketSubscribe = (eventName: string, eventHandler: () => void) => {
  // Get the socket instance
  const { socket } = useContext(SocketContext);

  // when the component, *which uses this hook* mounts,
  // add a listener.
  useEffect(() => {
    console.log('SocketIO: adding listener', eventName);
    socket?.on(eventName, eventHandler);

    // Remove when it unmounts
    return () => {
      console.log('SocketIO: removing listener', eventName);
      socket?.off(eventName, eventHandler);
    };

    // Sometimes the handler function gets redefined
    // when the component using this hook updates (or rerenders)
    // So adding a dependency makes sure the handler is
    // up to date!
  }, [eventHandler, eventName, socket]);
};
