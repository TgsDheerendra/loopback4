// src/services/websocket.server.ts
import {injectable} from '@loopback/core';
import * as socketIo from 'socket.io';

@injectable()
export class WebSocketServer {
  private io: socketIo.Server;

  constructor() {
    this.io = new socketIo.Server();
  }

  // Method to start the WebSocket server and attach it to the HTTP server
  startServer(httpServer: any) {
    // Attach Socket.IO server to the HTTP server
    this.io.attach(httpServer, {
      path: '/socket.io', // Optional, you can define a custom path if needed
    });

    this.setupEvents();
  }

  // Set up socket events (e.g., connection, message, etc.)
  private setupEvents() {
    this.io.on('connection', socket => {
      console.log('New client connected');

      // Listen for messages from the client
      socket.on('message', data => {
        console.log('Received message:', data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }

  // Broadcasting messages to all connected clients
  broadcastMessage(message: string) {
    this.io.emit('message', message); // Broadcast to all connected clients
  }
}
