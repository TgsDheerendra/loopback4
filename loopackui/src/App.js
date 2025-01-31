import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000/');  // Connect to WebSocket server

function App() {
  const [message, setMessage] = useState('');
  const [socketMessage, setSocketMessage] = useState('');

  useEffect(() => {
    // Listen to WebSocket events
    socket.on('message', (msg) => {
      setSocketMessage(msg); // Update the state with the message from the server
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleSendMessage = async () => {
    // Send message to WebSocket
    socket.emit('message', message);

    // Send the message to REST API
    await axios.post('http://127.0.0.1:5000/send-message', { text: message });
  };

  return (
    <div>
      <h1>LoopBack 4 with WebSocket</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send Message</button>
      <p>WebSocket Message: {socketMessage}</p>
    </div>
  );
}

export default App;
