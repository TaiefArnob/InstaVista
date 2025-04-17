import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
    useGetRTM()
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-900">
    {/* Header */}
    <div className="border-b border-gray-700 p-4 flex flex-col items-center bg-gray-900">
      <Avatar className="w-16 h-16 ring-2 ring-gray-700">
        <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
        <AvatarFallback className="bg-gray-700 text-white">
          {selectedUser?.username?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <span className="mt-2 font-semibold text-lg">{selectedUser?.username}</span>
      <Link
        to={`/profile/${selectedUser?._id}`}
        className="text-sm text-blue-500 hover:underline mt-1"
      >
        View Profile
      </Link>
    </div>
  
    {/* Chat Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages && messages.length > 0 ? (
        messages.map((msg) => {
          const isSentByCurrentUser =
            msg.senderId === user?._id || msg.senderId?._id === user?._id;
  
          return (
            <div
              key={msg._id}
              className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isSentByCurrentUser
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-white rounded-bl-none'
                }`}
              >
                <p>{msg.message}</p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-500 mt-10">No messages yet</div>
      )}
    </div>
  </div>
  
  );
};

export default Messages;
