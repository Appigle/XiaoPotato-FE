/* eslint-disable @typescript-eslint/no-explicit-any */
import { X_ACCESS_TOKEN } from '@src/constants/LStorageKey';
import useGlobalStore from '@src/stores/useGlobalStore';
import Logger from '@src/utils/logUtils';
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
      Logger.debug('SocketIO: connected!');
      setIsAlive(true);
      checkHeartBeat();
      socket.current.emit('heartbeat', { userId: userInfo?.id, timestamp: Date.now() });
    });

    socket.current.on('error', (msg: string) => {
      Logger.error('SocketIO: connect failure: ', msg);
      setIsAlive(false);
    });

    socket.current.on('disconnect', (reason: any) => {
      Logger.debug('SocketIO: disconnect reason: ', reason);
      setIsAlive(false);
    });

    socket.current.on('connect_error', (error: any) => {
      Logger.error('SocketIO: connect_error: ', error);
      setIsAlive(false);
    });

    socket.current.on('heartbeat', () => {
      setIsAlive(true);
      checkHeartBeat();
    });

    socket.current.on(
      'notification',
      (msg: {
        followerId: number;
        firstName: string;
        lastName: string;
        account: string;
        notificationType: string;
        content: string;
      }) => {
        const name = `${msg.firstName}.${msg.lastName?.[0]?.toUpperCase()}`;
        let content = '';
        switch (msg.notificationType) {
          case 'follow':
            content = 'followed you!';
            break;
          case 'like':
            content = 'liked your post!';
            break;
          case 'save':
            content = 'saved your post!';
            break;
          case 'comment':
            content = 'commented your post!';
            break;
          case 'recommendation':
            content = `${msg.content}`;
            break;
          default:
            break;
        }
        Toast(<div>🦄 {msg.firstName ? `${name} ${content}` : content}</div>, {
          autoClose: 1000 * 60 * 60 * 2,
          hideProgressBar: true,
          progress: undefined,
        });
        setIsAlive(true);
        checkHeartBeat();
      },
    );

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
        Toast(<div>🦄 {`${name} ${content}`}</div>, {
          hideProgressBar: true,
          progress: undefined,
        });
        setIsAlive(true);
        checkHeartBeat();
      },
    );
    socket.current.on(
      'randomResponse',
      (response: { randomNumber: number; receivedMessage: string; timestamp: number }) => {
        Logger.debug('SocketIO: randomResponse: ', response.timestamp);
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
