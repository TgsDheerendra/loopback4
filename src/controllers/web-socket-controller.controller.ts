import {inject} from '@loopback/core';
import {SocketIoServer} from '@loopback/socketio';

export class ChatController {
  constructor(@inject('servers.socketio') private socket: SocketIoServer) {
    this.socket.on('connection', (ws: any) => {
      console.log('A user connected');

      // Send a message to the client when they connect
      ws.emit('message', 'Hello from server!');

      // Listen for incoming messages from the client
      ws.on('message', (data: any) => {
        console.log('Received from client:', data);
        // Echo the message back to the client
        ws.emit('message', `Server: ${data}`);
      });

      // Handle disconnection
      ws.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }
}
