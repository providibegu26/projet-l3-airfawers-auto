import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header'; 
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fond dégradé */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 opacity-80"/>
      </div>
      
      {/* Sidebar */}
      <Sidebar/>
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10"> 
        <Header/>
        
        <main className="flex-1 overflow-auto p-4">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};
export default Layout;