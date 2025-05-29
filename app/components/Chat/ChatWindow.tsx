import React from "react";
import { IoMdSend } from "react-icons/io";


interface User {
  id: string;
  name: string;
  avatar_url?: string;
  user_metadata: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
  email: string;
}

interface ChatWindowProps {
  selectedUser: User | null;
  currentUser: User | null;
}

export default function ChatWindow({ selectedUser, currentUser }: ChatWindowProps) {
  if (!selectedUser) {
    return (
      <div className="flex-1 mt-40 flex items-center w-full justify-center text-gray-500 text-lg">
        Select a user to start chatting
      </div>
    );
  }
  const name = selectedUser.user_metadata?.full_name || selectedUser.user_metadata?.name || selectedUser.email || "Unknown";
  const avatar = selectedUser.user_metadata?.avatar_url;
  return (
    <div className="flex flex-col h-full bg-[#f7f9fa] rounded-lg shadow relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b bg-white sticky top-0 z-10">
        {avatar ? (
          <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-lg font-bold text-green-700 border border-gray-200">
            {name[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="text-xs text-gray-500">Online</span>
        </div>
      </div>
      {/* Messages area (empty for now) */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
        {/* Messages will go here */}
      </div>
      {/* Input */}
      <div className="px-6 py-3 border-t bg-white sticky bottom-5 z-10 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded text-gray-500 border border-gray-100 px-4 py-2 focus:outline-none bg-gray-50"
          placeholder="Type a message..."
        />
        <button className="text-green-600 hover:text-green-700  rounded-full text-2xl flex items-center justify-center cursor-pointer">
        <IoMdSend />
        </button>
      </div>
    </div>
  );
} 