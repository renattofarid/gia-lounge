import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserPage from "./pages/users/components/UserPage";
import RolPage from "./pages/roles/components/rolPage";
import SignInPage from "./pages/auth/components/SignInPage";
import CompanyPage from "./pages/company/components/companyPage";
import EnvironmentPage from "./pages/environment/components/environmentPage";
import StationPage from "./pages/station/components/stationPage";
import HomePage from "./pages/home/components/Homepage";
import { ThemeProvider } from "next-themes";

// Simular autenticación (deberías usar contexto o un servicio real)
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null; // O cualquier lógica que determines
};

// Componente de ruta protegida
function ProtectedRoute({ children }: { children: JSX.Element }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route
          path="/login"
          element={
            isAuthenticated() ? <Navigate to="/inicio" /> : <SignInPage />
          }
        />

        {/* Ruta protegida */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/roles"
          element={
            <ProtectedRoute>
              <RolPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empresas"
          element={
            <ProtectedRoute>
              <CompanyPage />
            </ProtectedRoute>
          }
        />
        <Route path="/empresas/salones" element={<Navigate to="/empresas" />} />
        <Route path="/empresas/mesas" element={<Navigate to="/empresas" />} />
        <Route
          path="/empresas/salones/:companyId"
          element={
            <ProtectedRoute>
              <EnvironmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empresas/mesas/:environmentId"
          element={
            <ProtectedRoute>
              <StationPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/inicio" />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}
