"use client";
import {
  FaHome,
  FaRegCommentDots,
  FaTicketAlt,
  FaChartLine,
  FaListUl,
  FaBullhorn,
  FaProjectDiagram,
  FaAddressBook,
  FaImage,
  FaSlidersH,
  FaCog,
  FaStar,
  FaRegFileAlt,
} from "react-icons/fa";
import { GiStarsStack } from "react-icons/gi";
import Link from "next/link";
import { CgChevronRightR } from "react-icons/cg";


export default function Sidebar() {
  return (
    <aside className="flex flex-col items-center bg-white min-h-screen  w-18 py-4 border-r border-gray-200 gap-2 relative">
      
      {/* Logo */}
      <Link href="/">
      <div className="mb-4 flex flex-col items-center">
        <div className="">
          <img
            src="/favicon.ico"
            alt="Periskope Logo"
            className="w-8 h-8 object-contain"
            />
        </div>
      </div>
      </Link>

      {/* Main Icons */}
      <nav className="flex flex-col items-center gap-2 flex-1">
        <SidebarIcon icon={<FaHome />} />
        <SidebarIcon icon={<FaRegCommentDots />} active badgeColor="bg-green-500" />
        <SidebarIcon icon={<FaTicketAlt />} />
        <SidebarIcon icon={<FaChartLine />} />
        <SidebarIcon icon={<FaListUl />} />
        <SidebarIcon icon={<FaBullhorn />} />
        <SidebarIcon
          icon={<FaProjectDiagram />}
          badge={<span className="text-yellow-400 ml-1">★</span>}
        />
        <SidebarIcon icon={<FaAddressBook />} />
        <SidebarIcon icon={<FaImage />} />
        <SidebarIcon icon={<FaSlidersH />} />
        <SidebarIcon icon={<FaCog />} />
      </nav>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <SidebarIcon icon={<GiStarsStack />} />
        <SidebarIcon icon={<CgChevronRightR />} />
      </div>
    </aside>
  );
}

function SidebarIcon({
  icon,
  active,
  badge,
  badgeColor,
}: {
  icon: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
  badgeColor?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center w-10 h-10 rounded-lg mb-1 transition ${
        active ? "text-green-600" : "hover:bg-gray-100 text-gray-500"
      }`}
    >
      <span className="text-xl">{icon}</span>
      {badge && (
        <span className="absolute -top-1 -right-1 text-xs">{badge}</span>
      )}
    </div>
  );
}
