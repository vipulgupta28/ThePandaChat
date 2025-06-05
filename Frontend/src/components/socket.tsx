let socket: WebSocket | null = null;

export const setSocket = (ws: WebSocket) => {
  socket = ws;
};

export const getSocket = () => socket;
