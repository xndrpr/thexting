import { createContext } from "react";
import { io } from "socket.io-client";

export const $socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  secure: true,
});

export const SocketContext = createContext($socket);
