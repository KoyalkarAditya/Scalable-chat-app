"use client";
import { io, Socket } from "socket.io-client";
import React, { useCallback, useContext, useEffect, useState } from "react";
interface SocketContextType {
  sendMessage: (message: string) => any;
  messages: string[];
}
const SocketContext = React.createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("state is undefined");
  return state;
};
export const SocketProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("connect", () => {
      console.log("connected");
      setSocket(_socket);
    });
    _socket.on("message", onMessageRecieved);
    _socket.on("disconnect", () => {
      setSocket(undefined);
    });

    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageRecieved);
      setSocket(undefined);
    };
  }, []);
  const onMessageRecieved = useCallback((msg: string) => {
    const { message } = JSON.parse(msg);
    setMessages((prev) => [...prev, message]);
    console.log("Message recieved", message);
  }, []);
  const sendMessage: SocketContextType["sendMessage"] = useCallback(
    (msg) => {
      console.log(msg);
      if (socket) {
        socket.emit("event:message", { message: msg });
      } else {
        console.log("Socket not connected");
      }
    },
    [socket]
  );

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
