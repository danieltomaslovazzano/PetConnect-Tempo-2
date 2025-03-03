import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import LostPetsPage from "./components/pets/LostPetsPage";
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import UsersManagement from "./components/admin/users/UsersManagement";
import PetsManagement from "./components/admin/pets/PetsManagement";
import { AdminProvider } from "./components/admin/context";
import MainLayout from "./components/layout/MainLayout";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          {/* Public Routes - Wrapped with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/lost-pets" element={<LostPetsPage />} />
            {/* Add more public routes as needed */}
          </Route>

          {/* Admin Routes - Wrapped with AdminProvider */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProvider>
                <AdminLayout />
              </AdminProvider>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="pets" element={<PetsManagement />} />
            {/* Add more admin routes as needed */}
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
