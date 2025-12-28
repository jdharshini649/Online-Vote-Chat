import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import { getMessages } from '../../api/messageApi';
import { getTeamColor } from '../../utils/colorScheme';
import VoteButton from './VoteButton';
import Button from '../UI/Button';
import Input from '../UI/Input';

const DebateRoom = ({ debate, userTeam }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { socket, sendMessage, voteMessage } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    loadMessages();
  }, [debate._id]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('vote_update', ({ messageId, value }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, votes: value } : msg))
      );
    });

    return () => {
      socket.off('new_message');
      socket.off('vote_update');
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages(debate._id);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userTeam) return;

    sendMessage(debate._id, user._id, userTeam, newMessage.trim());
    setNewMessage('');
  };

  const handleVote = (messageId, teamName) => {
    voteMessage(messageId, user._id, teamName, 1, debate._id);
  };

  if (loading) return <div className="text-center py-8">Loading messages...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-4">Debate Chat</h3>

      <div className="h-72 md:h-96 overflow-y-auto mb-4 border border-gray-100 rounded-lg p-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const teamColor = getTeamColor(msg.teamName);
            return (
              <div key={msg._id} className={`mb-3 p-3 rounded-lg ${teamColor.bg} border ${teamColor.border}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-semibold ${teamColor.text}`}>{msg.teamName}</span>
                  <VoteButton
                    votes={msg.votes}
                    onVote={() => handleVote(msg._id, msg.teamName)}
                    disabled={debate.status !== 'live'}
                  />
                </div>
                <p className="text-gray-700 text-sm">{msg.content}</p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {debate.status === 'live' && userTeam ? (
        <form onSubmit={handleSendMessage} className="flex flex-col md:flex-row md:space-x-2 gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Send message as ${userTeam}...`}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button type="submit" disabled={!newMessage.trim()} className="w-full md:w-auto">
            Send
          </Button>
        </form>
      ) : (
        <div className="text-center text-gray-500 py-4">{!userTeam ? 'Join a team to participate' : 'Debate is not live'}</div>
      )}
    </div>
  );
};

export default DebateRoom;
