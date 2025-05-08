import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessageField = ({userId}) => {
  console.log(userId);
  
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get CSRF token
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  
  // Set axios defaults
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Fetch messages from web route
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/messages', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Check if response.data exists and handle the data structure properly
      if (response.data && response.data.data) {
        setMessages(response.data.data);
      } else if (response.data) {
        // If response.data exists but not response.data.data
        setMessages(Array.isArray(response.data) ? response.data : []);
      } else {
        setMessages([]);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch messages. Please try again later.');
      console.error('Error fetching messages:', err);
      setMessages([]); // Ensure messages is an array even on error
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!messageContent.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`/messages`, {
        user_id:userId,
        content: messageContent,
      }, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Add new message to the list - handle different API response structures
      const newMessage = response.data.data || response.data;
      
      // Check if newMessage is valid before adding
      if (newMessage) {
        setMessages(prevMessages => [newMessage, ...prevMessages]);
      }
      
      // Clear the input field
      setMessageContent('');
      setError(null);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mark message as read
  const markAsRead = async (messageId) => {
    try {
      await axios.patch(`/messages/${messageId}/read`, {}, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Update the message in the state
      setMessages(prevMessages => 
        prevMessages.map(message => 
          message.id === messageId ? { ...message, is_read: true } : message
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  // Delete a message
  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`/messages/${messageId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Remove the message from the state
      setMessages(prevMessages => 
        prevMessages.filter(message => message.id !== messageId)
      );
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  return (
    <div className="message-field-container">
      <h2 className="text-xl font-bold mb-4">Messages</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <textarea
            className="flex-grow border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Type your message here..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r"
            disabled={loading || !messageContent.trim()}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
      
      {/* Messages List */}
      <div className="messages-list">
        {loading && messages.length === 0 ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`message-item border rounded p-4 mb-3 ${!message.is_read ? 'bg-blue-50' : 'bg-white'}`}
            >
              <div className="flex justify-between items-start">
                <div className="message-content">
                  <p>{message.content}</p>
                  <small className="text-gray-500">
                    {new Date(message.created_at).toLocaleString()}
                  </small>
                </div>
                <div className="message-actions flex">
                  {!message.is_read && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete message"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageField;