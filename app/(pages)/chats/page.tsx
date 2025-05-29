"use client";
import TopBar from "@/app/components/Chat/TopBar";
import Sidebar from "@/app/components/Chat/Sidebar";
import RightSidebar from "@/app/components/Chat/RightSidebar";
import PeopleList from "@/app/components/Chat/PeopleList";
import ChatWindow from "@/app/components/Chat/ChatWindow";
import { useState } from "react";
import type { User } from "@/app/components/Chat/PeopleList";

export default function ChatsPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // TODO: Replace with actual current user from auth/session
  const currentUser = null;

  return (
    <div className="bg-gray-100 min-h-screen  flex relative overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex flex-1 min-h-0">
          {/* People list sidebar */}
          <div className="w-80 border-r bg-white h-full w-max flex flex-col overflow-x-hidden">
            <div className="flex-1 overflow-y-auto">
            <PeopleList
  onSelectUser={(user) => setSelectedUser(user)}
  selectedUserId={selectedUser?.id}
/>

            </div>
          </div>
          {/* Main chat area */}
          <div className="flex-1 h-full">
            <ChatWindow selectedUser={selectedUser} currentUser={currentUser} />
          </div>
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}
