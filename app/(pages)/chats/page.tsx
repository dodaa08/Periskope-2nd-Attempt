"use client";

import TopBar from "@/app/components/Chat/TopBar";
import Sidebar from "@/app/components/Chat/Sidebar";
import RightSidebar from "@/app/components/Chat/RightSidebar";
import PeopleList from "@/app/components/Chat/PeopleList";
import ChatWindow from "@/app/components/Chat/ChatWindow";
import { useState, useEffect } from "react";
import type { User } from "@/app/components/Chat/PeopleList";
import { supabase } from "@/lib/supabaseClient";


export default function ChatsPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          id: user.id,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Unknown",
          avatar_url: user.user_metadata?.avatar_url,
          user_metadata: user.user_metadata || {},
          email: user.email || "",
        });
      }
      setUserLoading(false);
    }
    fetchCurrentUser();
  }, []);

  if (userLoading) {
    return <div className="flex items-center justify-center h-screen text-gray-500 text-lg">Loading...</div>;
  }

  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen text-gray-500 text-lg">Please log in to view your chats.</div>;
  }

  return (
    <div className="">
      {/* TopBar sticky */}
      <div className="sticky top-0 z-20">
        <TopBar />
      </div>
      <div className="flex flex-1 min-h-0">
        {/* Sidebar sticky */}
        <div className="sticky top-0 h-screen z-30">
          <Sidebar />
        </div>
        {/* People list sidebar sticky */}
        <div className="w-80 border-r bg-white h-full flex w-max flex-col overflow-y-hidden sticky top-0 z-10">
          <div className="flex-1 overflow-y-auto">
            <PeopleList
              onSelectUser={(user) => { setSelectedUser(user); setSelectedGroup(null); }}
              onSelectGroup={(group) => { setSelectedGroup(group); setSelectedUser(null); }}
              selectedUserId={selectedUser?.id}
              currentUserId={currentUser.id}
            />
          </div>
        </div>
        {/* Main chat area (scrollable) */}
        <div className="flex-1 h-full flex flex-col min-h-0 overflow-y-auto">
          <ChatWindow selectedUser={selectedUser} selectedGroup={selectedGroup} currentUser={currentUser} />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}
