"use client";
import {
  FaInfoCircle,
  FaSyncAlt,
  FaPen,
  FaBars,
  FaTable,
  FaProjectDiagram,
  FaUsers,
  FaAt,
  FaImage,
  FaSlidersH,
} from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BsGrid1X2 } from "react-icons/bs";
import { MdFormatListBulleted } from "react-icons/md";
import { MdChecklistRtl } from "react-icons/md";


export default function RightSidebar() {
  return (
    <aside className="flex flex-col items-center bg-white h-screen w-12 py-4 border-l gap-4 fixed right-0 top-0 ">
      <div className="flex flex-col items-center gap-10 mt-20">
        <MdOutlineSpaceDashboard className="text-gray-600 text-xl hover:text-blue-500 cursor-pointer" />
        <FaSyncAlt className="text-gray-400 text-xl hover:text-blue-500 cursor-pointer" />
        <FaPen className="text-gray-400 text-xl hover:text-blue-500 cursor-pointer" />
        <FaBars className="text-gray-400 text-xl hover:text-blue-500 cursor-pointer" />
        <MdChecklistRtl className="text-gray-400 text-xl hover:text-blue-500 cursor-pointer" />
        <FaProjectDiagram className="text-gray-400 text-xl hover:text-blue-500 cursor-pointer" />
        <FaUsers className="text-gray-400 text-xl hover:text-blue-500 cursor-pointer" />
        <FaAt className="text-gray-400 text-xl hover:text-blue-500 cursor-pointer" />
        <FaImage className="text-gray-400 text-xl hover:text-blue-500 cursor-pointer" />
        <FaSlidersH className="text-gray-400 text-xl hover:text-blue-500 cursor-pointer" />
      </div>
    </aside>
  );
}
