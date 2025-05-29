"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { IoMdFunnel } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaFolderPlus } from "react-icons/fa";


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


export default function PeopleList()  {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true); 
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, []);
  

  if (loading) return <div className="p-4 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow w-full">
      {/* Search/Filter Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center  text-green-600">  
         <FaFolderPlus size={16} />
        <button className="  px-3 py-1 rounded font-semibold text-sm">Custom filter</button>
         </div>
         
            <button className="flex items-center  border border-gray-200 rounded-md px-2 py-1">
               <span className="text-sm text-gray-500">Save</span>
          </button>
        
        <div className="flex items-center ml-auto border border-gray-200 rounded-md px-2 py-1">

        <CiSearch size={16} className="text-gray-500 mr-2" />
          <div className="">
            <span className="text-sm text-gray-500">Search</span>
          </div>
          </div>
          <button className="flex items-center gap-1 text-green-600 border-2 border-gray-100 rounded-md px-2 py-1 ">
        <IoMdFunnel size={16} />
          <span className="text-sm font-semibold">Filtered</span>
          </button>
      </div>
      {/* People List */}
      {users.map((user, idx) => {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Unknown";
        const avatar = user.user_metadata?.avatar_url;
        // Placeholder data for last message, badge, and timestamp
        const lastMessage = "This is a last message preview.";
        const badge = idx % 3 === 0 ? "Demo" : idx % 3 === 1 ? "Signup" : "Content";
        const timestamp = "Yesterday";
        return (
          <div
            key={user.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition group"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center text-xl font-bold text-green-700 border border-gray-200">
                {name[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 truncate">{name}</span>
                <span className={`text-xs px-2 py-0.5 rounded bg-gray-100 font-medium ${badge === "Demo" ? "text-orange-600 bg-orange-100" : badge === "Signup" ? "text-green-700 bg-green-100" : "text-blue-700 bg-blue-100"}`}>{badge}</span>
              </div>
              <div className="text-gray-500 text-sm truncate">{lastMessage}</div>
            </div>
            <div className="flex flex-col items-end ml-2 min-w-[60px]">
              <span className="text-xs text-gray-400">{timestamp}</span>
              {/* Example unread dot */}
              {idx === 0 && <span className="w-2 h-2 bg-green-400 rounded-full mt-1"></span>}
            </div>
          </div>
        );
      })}
    </div>
  );
} 