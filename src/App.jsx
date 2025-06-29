import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./Pages/Dashboard";
import VehiclesPage from './Pages/VehiclesPage';
import ChauffeursPage from './Pages/ChauffeursPage';
import Entretiens from './Pages/Entretiens';
import Carburants from './Pages/Carburants';
import Pannes from './Pages/Pannes';
import Statistiques from './Pages/Statistiques';
import Notifications from './Pages/Notifications';
import ProfileAdmin from './Pages/ProfileAdmin';
import MaintenanceCalendar from "./Pages/MaintenanceCalendar";
import FleetMap from './Pages/FleetMap';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/vehicles", element: <VehiclesPage /> },
      { path: "/chauffeurs", element: <ChauffeursPage /> },
      { path: "/entretiens", element: <Entretiens /> },
      { path: "/carburants", element: <Carburants /> },
      { path: "/pannes", element: <Pannes /> },
      { path: "/statistiques", element: <Statistiques /> },
      { path:"/notifications" ,element:<Notifications  />},
      { path:"/profile-admin", element:<ProfileAdmin />},
      { path: "/maintenance-calendar", element: <MaintenanceCalendar /> },
      { path: "/fleet-map", element: <FleetMap /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
