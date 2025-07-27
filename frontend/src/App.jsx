// src/App.jsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Layouts
import Layout from "./components/Layout";
import ChauffeurLayout from "./chauffeurs/components/ChauffeurLayout";

// Admin Pages
import Dashboard from "./Pages/Dashboard";
import VehiclesPage from "./Pages/VehiclesPage";
import ChauffeursPage from "./Pages/ChauffeursPage";
import Entretiens from "./Pages/Entretiens";
import EntretiensVidange from "./Pages/EntretiensVidange";
import EntretiensBougies from "./Pages/EntretiensBougies";
import EntretiensFreins from "./Pages/EntretiensFreins";
import EntretiensUrgents from "./Pages/EntretiensUrgents";
import HistoriqueEntretiens from "./Pages/HistoriqueEntretiens";
import Carburants from "./Pages/Carburants";
import Pannes from "./Pages/Pannes";
import Statistiques from "./Pages/Statistiques";
import Notifications from "./Pages/Notifications";
import ProfileAdmin from "./Pages/ProfileAdmin";
import MaintenanceCalendar from "./Pages/MaintenanceCalendar";
import FleetMap from "./Pages/FleetMap";

// Chauffeur Pages
import DashboardChauffeur from "./chauffeurs/Pages/DashboardChauffeur";
import ProfileChauffeur from "./chauffeurs/Pages/ProfileChauffeur";
import NotificationsChauffeur from "./chauffeurs/Pages/NotificationsChauffeur";

// Auth Pages
import LoginAdmin from "./Pages/auth/LoginAdmin";
import LoginChauffeur from "./Pages/auth/LoginChauffeur";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "vehicles", element: <VehiclesPage /> },
      { path: "chauffeurs", element: <ChauffeursPage /> },
      { path: "entretiens", element: <Entretiens /> },
      { path: "entretiens/vidange", element: <EntretiensVidange /> },
      { path: "entretiens/bougies", element: <EntretiensBougies /> },
      { path: "entretiens/freins", element: <EntretiensFreins /> },
      { path: "entretiens/urgents", element: <EntretiensUrgents /> },
      { path: "historique-entretiens", element: <HistoriqueEntretiens /> },
      { path: "carburants", element: <Carburants /> },
      { path: "pannes", element: <Pannes /> },
      { path: "statistiques", element: <Statistiques /> },
      { path: "notifications", element: <Notifications /> },
      { path: "profile-admin", element: <ProfileAdmin /> },
      { path: "maintenance-calendar", element: <MaintenanceCalendar /> },
      { path: "fleet-map", element: <FleetMap /> },
    ],
  },

  {
    path: "/chauffeur",
    element: <ChauffeurLayout />,
    children: [
      { index: true, element: <DashboardChauffeur /> },
      { path: "profile", element: <ProfileChauffeur /> },
      { path: "notifications", element: <NotificationsChauffeur /> },
    ],
  },

  // Auth (toujours accessibles directement)
  {
    path: "/admin/login",
    element: <LoginAdmin />,
  },
  {
    path: "/auth/chauffeur/login",
    element: <LoginChauffeur />,
  },

  // Page inconnue → Dashboard admin
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
