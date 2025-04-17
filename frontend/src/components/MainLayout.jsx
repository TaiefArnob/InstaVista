import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

const MainLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar with Fixed Width - Hidden on Small Screens */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <LeftSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>

      {/* Bottom Menu Bar for Small Screens */}
      <div className="md:hidden fixed bottom-0 left-0 w-full">
        <LeftSidebar toggleRightSidebar={null} /> {/* Reuse the existing bottom menu bar */}
      </div>
    </div>
  );
};

export default MainLayout;