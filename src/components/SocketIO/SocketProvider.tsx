/* eslint-disable @typescript-eslint/no-explicit-any */
import { X_ACCESS_TOKEN } from '@src/constants/LStorageKey';
import useGlobalStore from '@src/stores/useGlobalStore';
import Toast from '@src/utils/toastUtils';
import React, { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import socketIOClient from 'socket.io-client';
import { SocketContext } from './index';

const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const socket = useRef<any | null>(null);
  const heartbeatTimeout = useRef<number>(0);
  const sentHB2ServerRef = useRef<number>(0);
  const [isAlive, setIsAlive] = useState(false);
  const userInfo = useGlobalStore((s) => s.userInfo);

  const clearSocket = useCallback(() => {
    if (socket && socket.current) {
      //tslint-disable-next-line
      socket.current.removeAllListeners();
      socket.current.close();
    }
  }, []);

  const checkHeartBeat = useCallback(() => {
    clearTimeout(heartbeatTimeout.current);
    if (!isAlive) return;
    heartbeatTimeout.current = window.setInterval(() => {
      setIsAlive(false);
    }, 5000 * 20);
  }, [isAlive]);

  const reConnectSocket = useCallback(() => {
    if (!userInfo) return;
    if (socket && socket.current && socket.current.connected) return;
    const domain = import.meta.env.VITE_SOCKET_URL;
    socket.current = socketIOClient(domain, {
      query: { token: `Bearer ${window.localStorage.getItem(X_ACCESS_TOKEN)}` },
      reconnection: false,
      transports: ['websocket'],
    });
    if (!socket.current) return;

    socket.current.on('connect', () => {
      console.log(
        '%c [ SocketIO:Connected and authenticated ]-32',
        'font-size:13px; background:pink; color:#bf2c9f;',
      );
      setIsAlive(true);
      checkHeartBeat();
    });

    socket.current.on('error', (msg: string) => {
      console.error(
        '%c [ SocketIO: Error ]-32',
        'font-size:13px; background:pink; color:#bf2c9f;',
        msg,
      );
      setIsAlive(false);
    });

    socket.current.on('disconnect', (reason: any) => {
      console.warn(
        '%c [ SocketIO: disconnect ]-32',
        'font-size:13px; background:pink; color:#bf2c9f;',
        reason,
      );
      setIsAlive(false);
    });

    socket.current.on('connect_error', (error: any) => {
      console.error(
        '%c [ SocketIO: connect_error ]-32',
        'font-size:13px; background:pink; color:#bf2c9f;',
        error,
      );
      setIsAlive(false);
    });

    socket.current.on('heartbeat', (message: string) => {
      console.log('%c [ message ]-41', 'font-size:13px; background:pink; color:#bf2c9f;', message);
      setIsAlive(true);
      checkHeartBeat();
    });

    socket.current.on('notification', (notification: string) => {
      console.info(
        '%c [ SocketIO: notification ]-32',
        'font-size:13px; background:pink; color:#bf2c9f;',
        notification,
      );
      Toast.success(notification);
      setIsAlive(true);
      checkHeartBeat();
    });

    socket.current.on(
      'pull',
      (msg: {
        followerId: number;
        firstName: string;
        lastName: string;
        account: string;
        notificationType: string;
      }) => {
        const name = `${msg.firstName}.${msg.lastName?.[0]?.toUpperCase()}`;
        let content = '';
        switch (msg.notificationType) {
          case 'follow':
            content = 'followed you!';
            break;
          default:
            break;
        }
        Toast.info(`${name} ${content}`);
        setIsAlive(true);
        checkHeartBeat();
      },
    );
    socket.current.on(
      'randomResponse',
      (response: { randomNumber: number; receivedMessage: string; timestamp: number }) => {
        console.info(
          '%c [ SocketIO: timestamp from server:]-32',
          'font-size:13px; background:pink; color:#bf2c9f;',
          response.timestamp,
        );
        Toast.success(`Server response: # ${response.randomNumber}`);
        setIsAlive(true);
        checkHeartBeat();
      },
    );
  }, [checkHeartBeat, userInfo]);

  useEffect(() => {
    clearSocket();
    reConnectSocket();
    return () => {
      clearSocket();
    };
  }, [userInfo, reConnectSocket, clearSocket]);

  const socketSent = useCallback(
    (eN: string, data: any) => {
      if (socket.current) {
        if (!socket.current.connected) {
          reConnectSocket();
        } else {
          socket.current.emit(eN, data);
        }
      }
    },
    [reConnectSocket],
  );

  useEffect(() => {
    if (isAlive) {
      if (socket.current) {
        sentHB2ServerRef.current = window.setInterval(() => {
          socketSent('heartbeat', { userId: userInfo?.id, timestamp: Date.now() });
        }, 1000 * 55);
      }
    }
    return () => {
      sentHB2ServerRef.current && window.clearInterval(sentHB2ServerRef.current);
    };
  }, [isAlive, userInfo?.id, socketSent]);

  return (
    <SocketContext.Provider value={{ socket: socket.current, isAlive, socketSent }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
