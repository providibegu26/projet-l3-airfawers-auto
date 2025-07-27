
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar responsive */}
      <Sidebar closeSidebar={() => setSidebarOpen(false)} sidebarOpen={sidebarOpen} />
      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet fallback={<div>Chargement...</div>} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
