import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { supabase } from "@/lib/supabaseClient";
import { CiSearch } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { IoMdAttach } from "react-icons/io";
import { CiFaceSmile } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { CiTimer } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { BiSolidFoodMenu } from "react-icons/bi";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";


interface User {
  id: string;
  name: string;
  avatar_url?: string;
  user_metadata: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    phone?: string;
  };
  email: string;    
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id?: string;
  group_id?: string;
  content: string;
  created_at: string;
}

interface ChatWindowProps {
  selectedUser: User | null;
  selectedGroup?: { id: string; name: string } | null;
  currentUser: User | null;
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "ig");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-yellow-200 font-bold rounded px-1">{part}</span>
    ) : (
      part
    )
  );
}

export default function ChatWindow({ selectedUser, selectedGroup, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [groupMemberIds, setGroupMemberIds] = useState<string[]>([]);

  // Fetch users when a group is selected
  useEffect(() => {
    if (!selectedGroup) return;
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, [selectedGroup]);

  // Fetch group member IDs when a group is selected
  useEffect(() => {
    if (!selectedGroup) return;
    const fetchGroupMembers = async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", selectedGroup.id);
      if (data) setGroupMemberIds(data.map((row: any) => row.user_id));
    };
    fetchGroupMembers();
  }, [selectedGroup]);

  // User-to-user chat logic
  useEffect(() => {
    if (!selectedUser || !currentUser || selectedGroup) return;
    setLoading(true);
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`)
        .order("created_at", { ascending: true });
      if (data) {
        setMessages(data);
        // console.log("Fetched messages:", data);
      }
      setLoading(false);
    };
    fetchMessages();
  }, [selectedUser, currentUser, selectedGroup]);

  // Real-time subscription for user-to-user chat
  useEffect(() => {
    if (!selectedUser || !currentUser || selectedGroup) return;
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as Message;
          const isRelevant =
            (msg.sender_id === currentUser.id && msg.receiver_id === selectedUser.id) ||
            (msg.sender_id === selectedUser.id && msg.receiver_id === currentUser.id);
          if (isRelevant) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser, currentUser, selectedGroup]);

  // Group chat logic (fetch and display messages for the selected group)
  useEffect(() => {
    if (!selectedGroup || !currentUser) {
      setMessages([]); // Clear messages when no group is selected
      return;
    }
    setLoading(true);
    setMessages([]); // Clear previous messages instantly on group switch
    const fetchGroupMessages = async () => {
      const { data, error } = await supabase
        .from("group_messages")
        .select("*")
        .eq("group_id", selectedGroup.id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
      setLoading(false);
    };
    fetchGroupMessages();
  }, [selectedGroup, currentUser]);

  // Real-time subscription for group chat
  useEffect(() => {
    if (!selectedGroup || !currentUser) return;
    const channel = supabase
      .channel("group_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
        },
        (payload) => {
          const msg = payload.new as Message;
          if (msg.group_id === selectedGroup.id) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedGroup, currentUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send user-to-user message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser || !selectedUser || selectedGroup) return;
    const { data, error } = await supabase.from("messages").insert([
      {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        content: input.trim(),
      },
    ]).select().single();
    if (!error && data) {
      setMessages((prev) => [...prev, data]);
      setInput("");
    }
  };

  // Send group message (update to use group_messages table)
  const sendGroupMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser || !selectedGroup) return;
    const { data, error } = await supabase.from("group_messages").insert([
      {
        sender_id: currentUser.id,
        group_id: selectedGroup.id,
        content: input.trim(),
      },
    ]).select().single();
    if (!error && data) {
      setInput("");
    }
  };

  if (selectedGroup) {
    const name = selectedGroup.name;
    // Helper to get sender email for group messages
    const getGroupSenderEmail = (sender_id: string) => {
      if (currentUser && sender_id === currentUser.id) return "You";
      const user = users.find(u => u.id === sender_id);
      return user ? user.email : sender_id;
    };
    // Get group participant users (members)
    const groupMembers = users.filter(u => groupMemberIds.includes(u.id));
    // Filter messages by search
    const filteredMessages = search
      ? messages.filter(
          (msg) =>
            msg.content.toLowerCase().includes(search.toLowerCase()) ||
            getGroupSenderEmail(msg.sender_id).toLowerCase().includes(search.toLowerCase())
        )
      : messages;
    return (
      <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow relative mr-10">
        {/* Group Header */}
        <div className="flex items-center gap-3 px-6 py-3 border-b bg-white sticky top-0 z-10 relative">
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-700 border border-gray-200">
            {name[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-semibold text-gray-900 flex items-center gap-2">
              {name}
              <span className="text-xs text-blue-700 ml-2">Group</span>
            </span>
            <span className="text-xs text-gray-500">Group chat</span>
          </div>
          {/* Participants Avatars */}
          <div className="flex items-center gap-1 ml-auto">
            {groupMembers.slice(0, 4).map((user) => (
              user.user_metadata?.avatar_url ? (
                <img
                  key={user.id}
                  src={user.user_metadata.avatar_url}
                  alt={user.email}
                  className="w-7 h-7 rounded-full object-cover border border-gray-200"
                  title={user.email}
                />
              ) : (
                <div
                  key={user.id}
                  className="w-7 h-7 rounded-full bg-green-200 flex items-center justify-center text-xs font-bold text-green-700 border border-gray-200"
                  title={user.email}
                >
                  {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.user_metadata?.name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase() || "?"}
                </div>
              )
            ))}
            {groupMembers.length > 4 && (
              <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 border border-gray-200">+{groupMembers.length - 4}</span>
            )}
            <button
              className="ml-2 text-xs  cursor-pointer text-blue-600 underline hover:text-blue-800 font-semibold"
              onClick={() => setShowParticipants(true)}
            >
              View Participants
            </button>
          </div>
          {/* Search bar for group chat */}
          {showSearch ? (
            <input
              className="bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm text-gray-800 focus:outline-none ml-4"
              placeholder="Search messages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              style={{ minWidth: 120 }}
            />
          ) : (
            <button
              className="ml-4 text-gray-800 hover:text-green-600 cursor-pointer"
              onClick={() => setShowSearch(true)}
              title="Search messages"
            >
              <FaSearch />
            </button>
          )}
          {showSearch && (
            <button
              className="text-gray-400 text-lg hover:text-red-500 ml-1 cursor-pointer"
              onClick={() => { setShowSearch(false); setSearch(""); }}
              title="Close search"
            >
              ×
            </button>
          )}
        </div>
        {/* Participants Modal */}
        {showParticipants && (
          <div className="fixed inset-0 bg-transparent text-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative">
              <button
                className="absolute top-2 right-2 cursor-pointer text-gray-400 hover:text-red-500 text-xl"
                onClick={() => setShowParticipants(false)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-1">Group Participants</h2>
              <div className="text-xs text-gray-500 mb-4">Participants ({groupMembers.length})</div>
              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                {groupMembers.map(user => (
                  <div key={user.id} className="flex items-center gap-3">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt={user.email}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-sm font-bold text-green-700 border border-gray-200">
                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.user_metadata?.name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm">{user.user_metadata?.full_name || user.user_metadata?.name || user.email}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Messages area with scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
          {loading ? (
            <div className="text-gray-400 text-center">Loading...</div>
          ) : (
            filteredMessages.length === 0 ? (
              <div className="text-gray-400 text-center text-sm mr-20">No messages yet</div>
            ) : (
              filteredMessages.map((msg, idx) => {
                const isMe = msg.sender_id === currentUser?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`flex flex-col max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow text-sm ${isMe ? "bg-green-100 text-green-900" : "bg-white text-gray-900"}`} style={{ wordBreak: "break-word" }}>
                      {/* Sender email on top, small */}
                      <div className="text-[11px] text-gray-400 mb-1 font-medium">{getGroupSenderEmail(msg.sender_id)}</div>
                      {/* Message content with highlight */}
                      <div>{highlightMatch(msg.content, search)}</div>
                      {/* Time and ticks directly under message, right-aligned, tight */}
                      <div className="flex items-center justify-end gap-0.5 text-xs text-gray-400 mt-0.5">
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className={isMe ? "text-green-600 ml-[-2px]" : "text-gray-400 ml-[-2px]"}>✓✓</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <form onSubmit={sendGroupMessage} className="px-6 py-3 border-t bg-white sticky bottom-0 z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 rounded border text-gray-800 border-gray-100 px-4 py-2 focus:outline-none bg-gray-50"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!currentUser}
            />
            <button
              type="submit"
              className="text-green-700 text-xl cursor-pointer hover:text-green-600 rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
              disabled={!input.trim() || !currentUser}
            >
              <IoSend />
            </button>
          </div>
          {/* Action icons row */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 text-gray-700 ml-2">
              <button type="button" className="hover:text-green-600"><IoMdAttach size={20} /></button>
              <button type="button" className="hover:text-green-600"><CiFaceSmile size={20} /></button>
              <button type="button" className="hover:text-green-600"><IoTimeOutline size={20} /></button>
              <button type="button" className="hover:text-green-600"><CiTimer size={20} /></button>
              <button type="button" className="hover:text-green-600"><HiOutlineSparkles size={20} /></button>
              <button type="button" className="hover:text-green-600"><BiSolidFoodMenu size={20} /></button>
              <button type="button" className="hover:text-green-600"><FaMicrophone size={18} /></button>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded  px-3 py-1">
              <img src="/favicon.ico" alt="Periskope" className="w-5 h-5 rounded-full" />
              <span className="font-semibold text-gray-700 text-sm">Periskope</span>
              <div className="flex flex-col ml-10">
                <MdOutlineKeyboardArrowUp className="text-gray-400 mb-[-8px]" />
                <MdOutlineKeyboardArrowDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
        Select a user to start chatting
      </div>
    );
  }
  const getSenderInfo = (sender_id: string): { name: string; contact: string } => {
    if (currentUser && sender_id === currentUser.id) {
      return {
        name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email || "Unknown",
        contact: currentUser.user_metadata?.phone || currentUser.email,
      };
    } else if (selectedUser && sender_id === selectedUser.id) {
      return {
        name: selectedUser.user_metadata?.full_name || selectedUser.user_metadata?.name || selectedUser.email || "Unknown",
        contact: selectedUser.user_metadata?.phone || selectedUser.email,
      };
    }
    return { name: "Unknown", contact: "" };
  };

  const name = selectedUser.user_metadata?.full_name || selectedUser.user_metadata?.name || selectedUser.email || "Unknown";
  const avatar = selectedUser.user_metadata?.avatar_url;

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  }

  // Filter messages by search
  const filteredMessages = search
    ? messages.filter(
        (msg) =>
          msg.content.toLowerCase().includes(search.toLowerCase()) ||
          getSenderInfo(msg.sender_id).name.toLowerCase().includes(search.toLowerCase())
      )
    : messages;

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow relative mr-10">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b bg-white sticky top-0 z-10">
        {avatar ? (
          <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-lg font-bold text-green-700 border border-gray-200">
            {name[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div className="flex flex-col flex-1">
          <span className="font-semibold text-gray-900 flex items-center gap-2">
            {name}
            <span className="text-xs text-gray-500">&middot; {(currentUser && selectedUser.id === currentUser.id) ? 'You' : getSenderInfo(selectedUser.id).contact}</span>
          </span>
          <span className="text-xs text-gray-500">Online</span>
        </div>
        {showSearch ? (
          <input
            className="bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm text-gray-800 focus:outline-none"
            placeholder="Search messages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-3 mr-5 ">
             <div className="">
               <HiSparkles size={20} className="text-black" />
            </div>
          <button
            className="ml-auto text-gray-800 hover:text-green-600 cursor-pointer"
            onClick={() => setShowSearch(true)}
            title="Search messages"
            >
            <FaSearch />
          </button>

          
            </div>
        )}
        {showSearch && (
          <button
            className="text-gray-400 text-lg hover:text-red-500 ml-1 cursor-pointer"
            onClick={() => { setShowSearch(false); setSearch(""); }}
            title="Close search"
          >
            ×
          </button>
        )}
      </div>
      {/* Messages area with scroll */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
        {loading ? (
          <div className="text-gray-400 text-center">Loading...</div>
        ) : (
          filteredMessages.length === 0 ? (
            <div className="text-gray-400 text-center text-sm mr-20">No messages found</div>
          ) : (
            (() => {
              let lastDate = "";
              return filteredMessages.map((msg, idx) => {
                const isMe = msg.sender_id === currentUser?.id;
                const sender = getSenderInfo(msg.sender_id);
                const msgDate = new Date(msg.created_at).toDateString();
                const showDate = msgDate !== lastDate;
                lastDate = msgDate;
                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-2">
                        <span className="bg-white/80 text-gray-500 text-xs px-3 py-1 rounded-full shadow">{formatDate(msg.created_at)}</span>
                      </div>
                    )}
                    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex flex-col gap-2 max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow text-sm ${isMe ? "bg-green-100 text-green-900" : "bg-white text-gray-900"}`} style={{ wordBreak: "break-word" }}>
                        <span className="text-xs text-gray-400 ml-2">{sender.contact}</span>
                        <div className="flex gap-10">
                          <div className="flex items-center justify-between mb-1"></div>
                          <div>{highlightMatch(msg.content, search)}</div>
                          <div className="text-[10px] text-gray-400 mt-1 text-right">{new Date(msg.created_at).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              });
            })()
          )
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <form onSubmit={sendMessage} className="px-6 py-3 border-t bg-white sticky bottom-0 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 rounded border text-gray-800 border-gray-100 px-4 py-2 focus:outline-none bg-gray-50"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!currentUser || !selectedUser}
          />
          <button
            type="submit"
            className="text-green-700 text-xl cursor-pointer hover:text-green-600 rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
            disabled={!input.trim() || !currentUser || !selectedUser}
          >
            <IoSend />
          </button>
        </div>
        {/* Action icons row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4 text-gray-700 ml-2">
            <button type="button" className="hover:text-green-600"><IoMdAttach size={20} /></button>
            <button type="button" className="hover:text-green-600"><CiFaceSmile size={20} /></button>
            <button type="button" className="hover:text-green-600"><IoTimeOutline size={20} /></button>
            <button type="button" className="hover:text-green-600"><CiTimer size={20} /></button>
            <button type="button" className="hover:text-green-600"><HiOutlineSparkles size={20} /></button>
            <button type="button" className="hover:text-green-600"><BiSolidFoodMenu size={20} /></button>
            <button type="button" className="hover:text-green-600"><FaMicrophone size={18} /></button>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded  px-3 py-1">
            <img src="/favicon.ico" alt="Periskope" className="w-5 h-5 rounded-full" />
            <span className="font-semibold text-gray-700 text-sm">Periskope</span>
            <div className="flex flex-col ml-10">
            <MdOutlineKeyboardArrowUp className="text-gray-400 mb-[-8px]" />
            <MdOutlineKeyboardArrowDown className="text-gray-400" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 