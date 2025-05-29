import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { supabase } from "@/lib/supabaseClient";
import { CiSearch } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { IoSend } from "react-icons/io5";


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
  receiver_id: string;
  content: string;
  created_at: string;
}

interface ChatWindowProps {
  selectedUser: User | null;
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

export default function ChatWindow({ selectedUser, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch messages when selectedUser or currentUser changes
  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    setLoading(true);
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`)
        .order("created_at", { ascending: true });
      if (data) {
        setMessages(data);
        console.log("Fetched messages:", data);
      }
      setLoading(false);
    };
    fetchMessages();
  }, [selectedUser, currentUser]);

  // Subscribe to new messages in real time
  useEffect(() => {
    if (!selectedUser || !currentUser) return;
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
  }, [selectedUser, currentUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser || !selectedUser) return;
    const { data, error } = await supabase.from("messages").insert([
      {
        sender_id: currentUser.id,
        receiver_id: selectedUser.id,
        content: input.trim(),
      },
    ]).select().single();
    if (!error && data) {
      setMessages((prev) => [...prev, data]); // Optimistically add
      setInput("");
    }
  };

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
    <div className="flex flex-col h-full bg-whatsapp-pattern rounded-lg shadow relative mr-10">
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
          <span className="font-semibold text-gray-900">{name}</span>
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
             <div className="text-green-700">
            ✨
            </div>
          <button
            className="ml-auto text-gray-400 hover:text-green-600 cursor-pointer"
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
      {/* Messages area */}
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
                          <div className="flex items-center justify-between mb-1">
                            {/* <span className="font-bold text-green-700">{sender.name}</span> */}
                          </div>
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
      <form onSubmit={sendMessage} className="px-6 py-3 border-t bg-white sticky bottom-0 z-10 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded-full border text-gray-800 border-gray-200 px-4 py-2 focus:outline-none bg-gray-50"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!currentUser || !selectedUser}
        />
        <button
          type="submit"
          className=" text-green-700 rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
          disabled={!input.trim() || !currentUser || !selectedUser}
        >
          <IoSend />
        </button>
      </form>
    </div>
  );
} 