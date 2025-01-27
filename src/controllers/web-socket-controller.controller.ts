import {}
import {Socket} from 'socket.io';

export class WebSocketController {
  constructor(
    @ws.socket() private socket: Socket, // Inject WebSocket Socket instance
  ) {}

  // Listen for a 'message' event from the client
  @ws.on('message')
  onMessage(data: any) {
    console.log('Received message: ', data);
    // Emit back the received message to all connected clients
    this.socket.broadcast.emit('message', data);
  }

  // Listen for 'join' event and let users join a room
  @ws.on('join')
  onJoin(room: string) {
    this.socket.join(room);
    console.log(`User joined room: ${room}`);
  }

  // Listen for 'leave' event and let users leave a room
  @ws.on('leave')
  onLeave(room: string) {
    this.socket.leave(room);
    console.log(`User left room: ${room}`);
  }
}
