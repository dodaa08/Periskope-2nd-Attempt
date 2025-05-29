"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex flex-col divide-y bg-white rounded-lg shadow overflow-y-auto">
      {users.map((user) => {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Unknown";
        const avatar = user.user_metadata?.avatar_url;
        return (
          <div
            key={user.id}
            className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-lg font-bold text-green-700">
                {name[0]?.toUpperCase() || "?"}
              </div>
            )}
            <span className="font-medium text-gray-900">{name}</span>
          </div>
        );
      })}
    </div>
  );
} 