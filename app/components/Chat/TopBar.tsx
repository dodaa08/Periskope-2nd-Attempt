"use client";
import { FaRegCommentDots, FaSyncAlt, FaQuestionCircle, FaChevronDown, FaVolumeMute, FaCompressAlt } from "react-icons/fa";

export default function TopBar() {
  return (
    <header className="w-full flex items-center justify-between bg-white border-b px-4 h-12 z-10">
      {/* Left: Chats label */}
      <div className="flex items-center gap-2">
        <FaRegCommentDots className="text-gray-400 text-lg" />
        <span className="text-gray-500 text-base font-medium lowercase">chats</span>
      </div>
      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-gray-600 text-sm font-medium border border-gray-200">
          <FaSyncAlt className="text-base" />
          Refresh
        </button>
        <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 text-gray-600 text-sm font-medium border border-gray-200">
          <FaQuestionCircle className="text-base" />
          Help
        </button>
        <div className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-white text-xs font-medium text-gray-700">
          <span className="text-yellow-400 text-lg mr-1" style={{lineHeight:0}}>●</span>
          5 / 6 phones
          <FaChevronDown className="ml-1 text-xs text-gray-400" />
        </div>
        <button className="p-2 hover:bg-gray-100 rounded" title="Collapse">
          <FaCompressAlt className="text-gray-500 text-base" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded" title="Mute">
          <FaVolumeMute className="text-gray-500 text-base" />
        </button>
        {/* Add more icons as needed */}
      </div>
    </header>
  );
} 