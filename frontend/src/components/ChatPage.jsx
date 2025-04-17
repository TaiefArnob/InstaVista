import { setSelectedUser } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MessageCircleCode } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const [textMessage, setTextMessage] = useState('');
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const chatBodyRef = useRef(null); // UseRef for auto-scrolling

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `${API_URL}/message/send/${receiverId}`,
        { message: textMessage },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Scroll to the bottom of the chat body when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]); // This effect will run every time messages change

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className='flex h-screen bg-gray-900 text-white'>
      {/* Sidebar */}
      <section className='w-full md:w-1/4 border-r border-gray-700 bg-gray-900 overflow-y-auto'>
        <h1 className='font-bold text-xl px-5 py-6 text-center border-b border-gray-700'>Chats</h1>
        {suggestedUsers.map((suggestedUser) => {
          const isOnline = onlineUsers.includes(suggestedUser?._id);
          return (
            <div
              key={suggestedUser._id}
              className='flex items-center gap-4 px-4 py-3 hover:bg-gray-800 cursor-pointer transition rounded-md'
              onClick={() => dispatch(setSelectedUser(suggestedUser))}
            >
              <Avatar className='w-12 h-12 ring-2 ring-gray-700'>
                <AvatarImage src={suggestedUser.profilePicture} />
                <AvatarFallback className='bg-gray-700 text-white'>U</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-medium text-sm'>{suggestedUser.username}</span>
                <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Chat Panel */}
      {selectedUser ? (
        <section className='flex-1 flex flex-col h-screen bg-gray-900'>
          {/* Chat Header */}
          <div className='flex items-center gap-4 px-6 py-4 border-b border-gray-700 bg-gray-900 sticky top-0 z-10'>
            <Avatar className='w-10 h-10 ring-2 ring-gray-700'>
              <AvatarImage src={selectedUser.profilePicture} />
              <AvatarFallback className='bg-gray-700 text-white'>U</AvatarFallback>
            </Avatar>
            <div>
              <p className='font-semibold text-sm'>{selectedUser.username}</p>
              <p className='text-xs text-gray-400'>
                {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          {/* Chat Body */}
          <div className='flex-1 overflow-y-auto' ref={chatBodyRef}>
            <Messages selectedUser={selectedUser} />
          </div>

          {/* Chat Input */}
          <div className='flex items-center px-6 py-4 border-t border-gray-700 bg-gray-900'>
            <input
              type='text'
              placeholder='Type a message...'
              className='flex-1 bg-gray-800 text-white p-3 rounded-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
            />
            <button
              onClick={() => sendMessageHandler(selectedUser._id)}
              className='ml-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition'
            >
              Send
            </button>
          </div>
        </section>
      ) : (
        <div className='flex-1 flex flex-col items-center justify-center bg-gray-900 text-white'>
          <MessageCircleCode className='w-20 h-20 text-gray-500 mb-4' />
          <h1 className='font-semibold text-xl'>Your Messages</h1>
          <p className='text-sm text-gray-400'>Select a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
