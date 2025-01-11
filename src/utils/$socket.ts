import { createContext } from "react";
import { io } from "socket.io-client";

export const $socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket", "polling"],
});
export const SocketContext = createContext($socket);
