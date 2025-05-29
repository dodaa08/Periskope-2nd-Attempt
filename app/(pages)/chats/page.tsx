import TopBar from "@/app/components/Chat/TopBar";
import Sidebar from "@/app/components/Chat/Sidebar";

export default function() {
  return (
    <div className="bg-gray-100 min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        {/* Main chat content goes here */}
      </div>
    </div>
  )
}
