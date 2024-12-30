import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../Route/Route';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../Auth/Auth';

interface ChatPreview {
  chatId: string;
  buyerId: string;
  sellerId: string;
  lastMessage: string;
  timestamp: string;
  otherUser: string; // Name or ID of the other participant
}

const ChatsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(response.data);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 hero">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-md flex items-center">
        <Link to="/" className="flex-shrink-0 mr-4">
          <h1 className="text-xl font-semibold text-white">Home</h1>
        </Link>
        <h1 className="text-xl font-semibold flex-grow text-center">Your Chats</h1>
      </header>

      {/* Chats List */}
      <main className={`flex-1 overflow-y-auto p-4 space-y-4 ${chats.length === 0 && "flex justify-center items-center"}`}>
        {loading ? (
          <p>Loading chats...</p>
        ) : chats.length > 0 ? (
          chats.map((chat) => (
            <Link
              to={`/chat/${chat.buyerId}/${chat.sellerId}`}
              key={chat.chatId}
              className="block p-4 bg-white rounded-lg shadow hover:bg-gray-100 transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  {chat.otherUser}
                </h2>
                <small className="text-xs text-gray-500">
                  {new Date(chat.timestamp).toLocaleTimeString()}
                </small>
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            </Link>
          ))
        ) : (
          <strong><p className="text-center text-gray-600 text-3xl">No chats available.</p></strong>
        )}
      </main>
    </div>
  );
};

export default ChatsPage;
