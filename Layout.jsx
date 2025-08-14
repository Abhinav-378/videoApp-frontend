import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from "./src/components/Navbar.jsx";
import SideFullNavBar from "./src/components/SideFullNavBar.jsx";
import { ModalProvider } from "./src/ModalContext";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <ModalProvider>
      <div className="flex h-screen">
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-56' : 'sm:w-20 w-0'}`}>
          <SideFullNavBar
            isOpen={isSidebarOpen}
            onToggle={toggleSidebar}
          />
        </div>
        <div className={`flex-1 transition-all duration-300`}>
          <Navbar onToggle={toggleSidebar} />
          <main className="p-4 pt-16">
            <Outlet />
          </main>
        </div>
      </div>
    </ModalProvider>
  );
}

export default Layout;
