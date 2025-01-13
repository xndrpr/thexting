import { createContext } from "react";
import { io } from "socket.io-client";

export const $socket = io("/", {
  transports: ["websocket"],
  withCredentials: true,
  secure: true,
});

export const SocketContext = createContext($socket);
