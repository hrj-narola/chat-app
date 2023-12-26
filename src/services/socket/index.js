import {io} from "socket.io-client";
import {localStorageGet} from "../../utils/localStorage";

export const socket = io(process.env.REACT_APP_API_URL, {
  autoConnect: false,
});

export const establishSocketConnection = () => {
  const authToken = localStorageGet("token");
  socket.auth = {
    token: authToken,
  };
  if (!socket.connected) {
    socket.connect();
  }
};

export const distroySocketConnection = () => {
  if (socket.connected) {
    socket.removeAllListeners();
  }
  socket.disconnect();
};
