import TopBar from "@/app/components/Chat/TopBar";
import Sidebar from "@/app/components/Chat/Sidebar";
import RightSidebar from "@/app/components/Chat/RightSidebar";
import PeopleList from "@/app/components/Chat/PeopleList";

export default function() {
  return (
    <div className="bg-gray-100 min-h-screen flex relative">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="p-2">
          <PeopleList />
        </div>
      </div>
      <RightSidebar />
    </div>
  )
}
