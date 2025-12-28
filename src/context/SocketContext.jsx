import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinDebateRoom = (debateId, username, teamName) => {
    if (socket) {
      socket.emit('join_debate', { debateId, username, teamName });
    }
  };

  const sendMessage = (debateId, userId, teamName, content) => {
    if (socket) {
      socket.emit('send_message', { debateId, userId, teamName, content });
    }
  };

  const voteMessage = (messageId, userId, teamName, value, debateId) => {
    if (socket) {
      socket.emit('vote_message', { messageId, userId, teamName, value, debateId });
    }
  };

  const startDebateTimer = (debateId) => {
    if (socket) {
      socket.emit('start_debate_timer', { debateId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinDebateRoom,
        sendMessage,
        voteMessage,
        startDebateTimer,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
