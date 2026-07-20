import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_WS_URL, {
  transports: ["websocket", "polling"],
  autoConnect: false,
});

export const connectSocket = (employeeId) => {
  socket.io.opts.query = { employeeId };
  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};
