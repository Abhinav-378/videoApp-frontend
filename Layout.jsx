import React, { useState } from "react";
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from "./src/components/Navbar.jsx";
import SideFullNavBar from "./src/components/SideFullNavBar.jsx";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  const noSidebarRoutes = ['/login', '/signup', '/forgot-password'];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {showSidebar && (
        <div className={`transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}>
          <SideFullNavBar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        </div>
      )}
      <div className={`flex-1 transition-all duration-300`}>
        <Navbar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
