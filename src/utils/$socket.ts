import { createContext } from "react";
import { io } from "socket.io-client";

export const $socket = io('http://localhost:6100');
export const SocketContext = createContext($socket);