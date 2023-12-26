import io from 'socket.io-client';

class SocketApi {
  constructor(token) {
    this.endpoint = process.env.REACT_APP_API_URL;
    this.socket = io(this.endpoint);
    this.id = this.socket.id;
    this.socket.auth = token;
  }

  connect() {
    this.socket.connect();
    if (this.socket.connected) {
      console.log('Connected to socket.io server. Socket id: ' + this.socket.id);
    }
  }

  on(e, cb) {
    this.socket.on(e, cb);
  }

  disconnect() {
    this.socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });
  }

  emit(k, v) {
    this.socket.emit(k, v);
  }
}

export default SocketApi;
