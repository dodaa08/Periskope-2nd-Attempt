import TopBar from "@/app/components/Chat/TopBar";
import Sidebar from "@/app/components/Chat/Sidebar";
import RightSidebar from "@/app/components/Chat/RightSidebar";
import PeopleList from "@/app/components/Chat/PeopleList";

export default function() {
  return (
    <div className="bg-gray-100 min-h-screen flex relative overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex flex-1 min-h-0">
          {/* People list sidebar */}
          <div className="w-80 border-r bg-white h-full w-max flex flex-col overflow-x-hidden">
            <div className="flex-1 overflow-y-auto">
              <PeopleList />
            </div>
          </div>
          {/* Main chat area */}
          <div className="flex-1 h-full">
            {/* Chat content goes here */}
          </div>
        </div>
      </div>
      <RightSidebar />
    </div>
  )
}
