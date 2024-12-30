import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../Route/Route';
import { API_BASE_URL } from '../../Pages/Auth/Auth';
import { User } from '../../Pages/Profile/ProfilePage';
import axios from 'axios';
import { Send, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  _id: string; // Unique identifier for the message
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: string;
  deleted: boolean;
  updatedAt: string;
  updated: boolean;
}

interface Props {
  senderId: string; // Logged-in user ID
  receiverId: string; // The ID of the seller being chatted with
}

const ChatPage: React.FC<Props> = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [dropdownMessageId, setDropdownMessageId] = useState<string | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const resp = await axios.get(
          `${API_BASE_URL}/user/${user?.id === senderId ? receiverId : senderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOtherUser(resp.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOtherUser();
    const socketInstance = io('http://localhost:3000', {
      auth: { token: token },
    });

    setSocket(socketInstance);
    console.log('r',receiverId)
    socketInstance.emit('join_chat', { senderId, receiverId });

    // Fetch chat history
    socketInstance.on('chat_history', (chatHistory: Message[]) => {
      console.log(chatHistory)
      setMessages(chatHistory);
    });

    // Listen for new messages
    socketInstance.on('receive_message', (message: Message) => {
      console.log(message)
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for deleted messages
    socketInstance.on('message_deleted', (messageId: string) => {
      console.log(messageId)
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, deleted: true } : msg)),
      );
    });
    // Listen for updated messages
    socketInstance.on('message_updated', (updatedMessage: Message) => {
      console.log(updatedMessage)
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? { ...msg, content: updatedMessage.content, updated: updatedMessage.updated } : msg,
        ),
      );
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [senderId, receiverId, token]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Partial<Message> = {
      senderId: user!.id,
      receiverId: otherUser!._id,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    console.log(editingMessage)
    if (editingMessage) {
      // Update existing message
      console.log(editingMessage)
      socket?.emit('update_message', {messageId: editingMessage._id, content: newMessage})
    } else {
      // Send new message
      socket?.emit('send_message', message); // Emit the message to the server
    }

    setNewMessage(''); // Clear the input field
  };

  const deleteMessage = (messageId: string) => {
    socket?.emit('delete_message', {messageId} );
  };

  const startEditing = (message: Message) => {
    setNewMessage(message.content);
    setEditingMessage(message);
    setDropdownMessageId(null); // Close dropdown menu
  };

  const toggleDropdown = (messageId: string) => {
    setDropdownMessageId((prevId) => (prevId === messageId ? null : messageId));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 hero">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md flex items-center justify-between">
        <h1 className="text-xl font-semibold cursor-pointer" onClick={ () => navigate("/chats")}>Chat</h1>
        <p className="text-sm opacity-75">{otherUser?.name}</p>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length == 0 ? 
        (
        <div className="flex items-center justify-center h-[80%]">
          <i style={{color: '#333a44'}} className='font-bold text-2xl'>No conversation initated yet...</i>
        </div>) : (
          messages.map((msg) => (
            !msg.deleted &&
            <div
              key={msg._id}
              className={`max-w-[70%] p-4 rounded-lg shadow-md ${
                msg.senderId !== otherUser?._id
                  ? 'ml-auto bg-blue-100 text-blue-800'
                  : 'mr-auto bg-gray-100 text-gray-800'
              } relative`}
            >
              <p>{msg.content}</p>
              <small className="block text-xs text-gray-500 mt-2">
                <i>{msg?.updated ? "Edited  " : ""}</i>
                {new Date(msg.updatedAt || '').toLocaleTimeString()}
              </small>
              {msg.senderId === user?.id && (
                <div className="absolute top-0 right-0 flex items-center h-full">
                  <span
                    onClick={() => toggleDropdown(msg._id)}
                    className="text-gray-500 hover:text-gray-700 flex items-center justify-center hover:cursor-pointer"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </span>
                  {dropdownMessageId === msg._id && (
                    <div className="absolute top-full right-0 bg-white shadow-lg border rounded-md z-10">
                      <button
                        onClick={() => startEditing(msg)}
                        className="block px-4 py-2 text-sm text-blue-500 hover:bg-blue-100 w-full text-left"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="block px-4 py-2 text-sm text-red-500 hover:bg-red-100 w-full text-left"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </main>

      {/* Input Area */}
        <div className="flex items-center justify-center space-x-2 p -4">
          <input
            className="flex-[0.85] p-3 border rounded-full bg-gray-100 focus:ring focus:ring-blue-300 outline-none"
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
    </div>
  );
};

export default ChatPage;
