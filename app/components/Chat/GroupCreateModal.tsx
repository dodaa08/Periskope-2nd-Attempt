import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";


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


export default function GroupCreateModal({ users, currentUserId, onClose, onGroupCreated }: { users: User[]; currentUserId: string; onClose: () => void; onGroupCreated?: () => void }) {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Unknown";
    return name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
  });

  const toggleUser = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  const handleCreateGroup = async () => {
    setLoading(true);
    setError(null);
    // 1. Insert group with creator's user ID
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert([{ name: groupName, created_by: currentUserId }])
      .select()
      .single();
    if (groupError || !group) {
      setError("Failed to create group: " + (groupError?.message || "Unknown error"));
      setLoading(false);
      return;
    }
    // 2. Insert group members (selected + creator if not already selected)
    const memberIds = selected.includes(currentUserId) ? selected : [currentUserId, ...selected];
    console.log("Creating group with members:", memberIds);
    const members = memberIds
      .filter((id) => id) // Removes falsy values like "", null, undefined
      .map(user_id => ({ user_id, group_id: group.id }));
    const { error: membersError } = await supabase.from("group_members").insert(members);
    if (membersError) {
      setError("Failed to add group members: " + membersError.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.success("Group created successfully!");
    if (onGroupCreated) onGroupCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent text-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl cursor-pointer"
          onClick={onClose}
          title="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4">Create Group</h2>
        <input
          className="w-full border border-gray-200 rounded px-3 py-2 mb-3 text-sm focus:outline-none"
          placeholder="Group name"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
        />
        <input
          className="w-full border border-gray-200 rounded px-3 py-2 mb-3 text-sm focus:outline-none"
          placeholder="Search people..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="max-h-56 overflow-y-auto  rounded mb-3 divide-y">
          {filteredUsers.map(user => {
            const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Unknown";
            return (
              <label key={user.id} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selected.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                  className="accent-green-600"
                />
                <span className="truncate font-medium text-gray-900">{name}</span>
                <span className="text-xs text-gray-400">{user.id === currentUserId ? "You" : user.email}</span>
              </label>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map(uid => {
            const user = users.find(u => u.id === uid);
            if (!user) return null;
            const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Unknown";
            return (
              <span key={uid} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                {user.id === currentUserId ? "You" : user.email}
                <button className="ml-1 text-green-700 hover:text-red-500" onClick={() => toggleUser(uid)} title="Remove">×</button>
              </span>
            );
          })}
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          className="w-full bg-green-600 hover:bg-green-700 cursor-pointer text-white font-semibold py-2 rounded disabled:opacity-50"
          disabled={!groupName.trim() || selected.length === 0 || loading}
          onClick={handleCreateGroup}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>
    </div>
  );
} 