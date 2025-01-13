import { createContext } from "react";
import { io } from "socket.io-client";

export const $socket = io("wss://xndrpr.ddns.net", {
  transports: ["websocket"],
  withCredentials: true,
  secure: true,
});

export const SocketContext = createContext($socket);
