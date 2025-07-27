// ✅ 1. ChauffeurLayout.jsx : centralise les modals et gère le Sidebar
import React, { useState } from "react";
import ChauffeurSidebar from "./ChauffeurSidebar";
import HeaderChauffeur from "./HeaderChauffeur";
import VehicleModal from "./modals/VehicleModal";
import FuelModal from "./modals/FuelModal";
import MaintenanceModal from "./modals/MaintenanceModal";
import BreakdownModal from "./modals/BreakdownModal";
import { Outlet } from "react-router-dom";

const ChauffeurLayout = () => {
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openModal = (type) => setModal(type);
  const closeModal = () => setModal(null);

  return (
    <div className="h-screen bg-gray-200 relative overflow-hidden">
      {/* Header toujours tout en haut */}
      <HeaderChauffeur onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex h-full">
        {/* Sidebar responsive */}
        <ChauffeurSidebar openModal={openModal} closeSidebar={() => setSidebarOpen(false)} sidebarOpen={sidebarOpen} />
        {/* Overlay pour mobile avec effet flou */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}
        {/* Contenu principal */}
        <div className="flex-1 flex flex-col ml-0 md:ml-56 h-screen overflow-hidden relative">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 h-full relative z-10">
            <Outlet context={{ openModal, closeModal }} />
          </main>
          {/* Modals visibles globalement */}
          {modal === "vehicule" && <VehicleModal onClose={closeModal} />}
          {modal === "carburant" && <FuelModal onClose={closeModal} />}
          {modal === "entretien" && <MaintenanceModal onClose={closeModal} />}
          {modal === "panne" && <BreakdownModal onClose={closeModal} />}
        </div>
      </div>
    </div>
  );
};

export default ChauffeurLayout;
