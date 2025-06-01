"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { IoMdFunnel } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaFolderPlus, FaSearch, FaUsers } from "react-icons/fa";
import { FaWifi } from "react-icons/fa";
import { RiChatSmileAiLine } from "react-icons/ri";
import GroupCreateModal from "@/app/components/Chat/GroupCreateModal";

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

export type { User };
interface PeopleListProps {
  onSelectUser: (user: User) => void;
  onSelectGroup: (group: { id: string; name: string }) => void;
  selectedUserId?: string;
  currentUserId: string;
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

// Define a discriminated union type for combinedList
type CombinedListItem =
  | { type: 'group'; id: string; name: string }
  | { type: 'user'; id: string; name: string; avatar?: string; user: User };

export default function PeopleList({ onSelectUser, onSelectGroup, selectedUserId, currentUserId }: PeopleListProps & { currentUserId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [refreshGroups, setRefreshGroups] = useState(0);

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
  

  // Fetch groups for the current user
  useEffect(() => {
    async function fetchGroups() {
      if (!currentUserId) return;
      // Step 1: Get group IDs for the user
      const { data: memberRows, error: memberError } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", currentUserId);
      if (memberError) {
        setGroups([]);
        return;
      }
      const groupIds = memberRows?.map(row => row.group_id) || [];
      if (groupIds.length > 0) {
        // Step 2: Get group details
        const { data: groupsData, error: groupsError } = await supabase
          .from("groups")
          .select("id, name")
          .in("id", groupIds);
        setGroups(groupsData || []);
        console.log('Fetched groups:', groupsData);
      } else {
        setGroups([]);
        console.log('No groups found');
      }
    }
    fetchGroups();
  }, [currentUserId, showGroupModal, refreshGroups]);

  const filteredUsers = users.filter((user) => {
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Unknown";
    return name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
  });

  // Combine groups and users into a single list
  const combinedList: CombinedListItem[] = [
    ...groups.map((group: any) => ({
      type: 'group' as const,
      id: group.id,
      name: group.name,
    })),
    ...filteredUsers.map((user: User) => ({
      type: 'user' as const,
      id: user.id,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Unknown",
      avatar: user.user_metadata?.avatar_url,
      user,
    })),
  ];

  if (loading) return <div className="p-4 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow relative">
      {/* Search/Filter Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center  text-green-700 px-3 py-1 rounded">
          <FaFolderPlus size={16} className="text-green-500 mr-2" />
        <button className=" font-semibold text-sm">Custom filter</button>
        </div>
        <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded font-semibold text-sm">Save</button>
        {showSearch ? (
          <input
            className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm text-gray-800 focus:outline-none"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        ) : (
          <>
          
            <button
              className="ml-auto text-gray-400 hover:text-green-600 cursor-pointer"
              onClick={() => setShowSearch(true)}
              title="Search"
            >
              <div className="flex items-center gap-2 border border-gray-200 rounded-md px-2 py-1">
              <CiSearch size={16} className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-500 font-semibold ">Search</span>
              </div>
            </button>

             <div className="flex items-center  text-green-700 px-3 py-1 rounded border border-green-100 " >
                <FaWifi size={16} className="text-green-500 mr-2" />
                <button className="font-semibold text-sm">filters</button>
              </div>  
          </>

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
      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto">
        {combinedList.map((item, idx) => {
          if (item.type === 'group') {
            // Render group like a user, but with a different avatar color and a group label
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition group`}
                onClick={() => onSelectGroup({ id: item.id, name: item.name })}
              >
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold text-blue-700 border border-gray-200">
                  {item.name[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 truncate">{item.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">Group</span>
                  </div>
                  <div className="text-gray-500 text-sm truncate">Group chat</div>
                </div>
              </div>
            );
          } else if (item.type === 'user') {
            const { user, avatar, name } = item;
            const lastMessage = "This is a last message preview.";
            const badge = idx % 3 === 0 ? "Demo" : idx % 3 === 1 ? "Signup" : "Content";
            const timestamp = "Yesterday";
            const isSelected = user.id === selectedUserId;
            return (
              <div
                key={user.id}
                onClick={() => onSelectUser(user)}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition group ${isSelected ? 'bg-green-50' : ''}`}
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
                    <span className="font-semibold text-gray-900 truncate">{highlightMatch(name, search)}</span>
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
          } else {
            return null;
          }
        })}
      </div>
      {/* Create Group Button at the end of the list */}
      <div className="flex justify-end p-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg z-20"
          title="Create Group"
          onClick={() => setShowGroupModal(true)}
        >
          <RiChatSmileAiLine size={28} />
        </button>
      </div>
      {/* Group Creation Modal */}
      {showGroupModal && (
        <GroupCreateModal
          users={users}
          currentUserId={currentUserId}
          onClose={() => setShowGroupModal(false)}
          onGroupCreated={() => setRefreshGroups(r => r + 1)}
        />
      )}
    </div>
  );
} 