import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: string;
}

interface Props {
  buyerId: string;
  sellerId: string;
  jwtToken: string; // JWT token for authentication
}

const MessageComponent: React.FC<Props> = ({ buyerId, sellerId, jwtToken }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:3000', {
      auth: { token: jwtToken },
    });

    setSocket(socketInstance);

    socketInstance.emit('join_chat', { buyerId, sellerId });

    socketInstance.on('receive_message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [buyerId, sellerId, jwtToken]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      senderId: buyerId,
      receiverId: sellerId,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit('send_message', message);

    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col border rounded-lg shadow-md">
      {/* Header */}
      <div className="p-4 bg-gray-100 border-b text-center">
        <h3 className="text-lg font-medium">
          Chat with {buyerId === sellerId ? 'Yourself' : 'Seller'}
        </h3>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.senderId === buyerId
                ? 'ml-auto bg-blue-100 text-blue-800'
                : 'mr-auto bg-gray-100 text-gray-800'
            }`}
          >
            <p>{msg.content}</p>
            <small className="block text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp || '').toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center p-4 bg-gray-100 border-t">
        <input
          className="flex-1 p-2 border rounded-lg outline-none focus:ring focus:ring-blue-300"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageComponent;
