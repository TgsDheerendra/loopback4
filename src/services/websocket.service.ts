import {injectable} from '@loopback/core';
import {Server} from 'socket.io';

@injectable()
export class WebSocketService {
  private io: Server;

  constructor() {
    this.io = new Server({
      cors: {
        origin: 'http://localhost:3000', // Allow React client
        methods: ['GET', 'POST'],
      },
    });
  }

  public startServer(server: any) {
    this.io.attach(server);
    this.io.on('connection', socket => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

  // Add methods to emit events
  public sendMessage(message: string) {
    this.io.emit('message', message);
  }
}
