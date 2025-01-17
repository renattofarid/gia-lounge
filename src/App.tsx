import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserPage from "./pages/users/components/UserPage";
import RolPage from "./pages/roles/components/rolPage";
import SignInPage from "./pages/auth/components/SignInPage";
import CompanyPage from "./pages/company/components/companyPage";
import EnvironmentPage from "./pages/environment/components/environmentPage";
import StationPage from "./pages/station/components/stationPage";
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "./pages/auth/lib/auth.store";
import HomePage from "./pages/home/components/Homepage";

// const isAuthenticated = () => {
//   return localStorage.getItem("token") !== null; 
// };

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const {token} = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {

  const { token } = useAuthStore();


  return (
    <ThemeProvider attribute="class" defaultTheme="light">
    <BrowserRouter>

      <Routes>
        {/* Ruta pública */}
        <Route
          path="/login"
          element={
           token? <Navigate to="/inicio" /> : <SignInPage />
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
        <Route path="/empresas/salones" element={<EnvironmentPage />} />
        <Route path="/empresas/mesas" element={<StationPage />} />
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
