"use client";
import { FaSyncAlt, FaQuestionCircle, FaChevronDown, FaRegCommentDots, FaChevronUp } from "react-icons/fa";
import { GoDesktopDownload } from "react-icons/go";
import { IoIosNotificationsOff } from "react-icons/io";
import { TfiMenuAlt } from "react-icons/tfi";
import { FaRegQuestionCircle } from "react-icons/fa";


export default function TopBar() {
  return (
    <header className="w-full flex items-center justify-between bg-white border-b border-gray-200 px-4 h-12 z-10 sticky top-0">
      {/* Left: Chats label */}
      <div className="flex items-center gap-2">
        <FaRegCommentDots className="text-gray-400 text-lg" />
        <span className="text-gray-500 text-base font-medium lowercase">chats</span>
      </div>
      {/* Right: Actions */}
      <div className="flex items-center gap-5 ml-auto">
        <button className="flex items-center gap-1 font-bold px-3 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 text-sm font-medium">
          <FaSyncAlt className="text-base mr-2" />
          <span className="text-sm font-bold">Refresh</span>
        </button>
        <button className="flex items-center gap-1 font-bold px-3 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 text-sm font-medium">
          <FaRegQuestionCircle className="text-base mr-2" />
          <span className="text-sm font-bold">Help</span>
        </button>
        <div className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 bg-white text-xs font-medium text-gray-700">
          <span className="text-yellow-400 text-lg mr-1" style={{lineHeight:0}}>●</span>
             <span className="font-bold text-gray-700 text-l">
              5 / 6 phones
              </span> 
          <div className="flex flex-col ">
          <FaChevronUp className="ml-1 text-xs  text-gray-400" />
          <FaChevronDown className="ml-1 text-xs  text-gray-400" />
          </div>
        </div>
        <button className="flex items-center justify-center px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-600">
          <GoDesktopDownload className="text-lg" />
        </button>
        <button className="flex items-center justify-center px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-600">
          <IoIosNotificationsOff className="text-lg" />
        </button>
        <button className="flex items-center justify-center px-2 py-1 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 gap-1">
          ✨ 
          <TfiMenuAlt className="text-lg" />
        </button>
      </div>
    </header>
  );
} 