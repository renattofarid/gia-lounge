import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserPage from "./pages/users/components/UserPage";
import RolPage from "./pages/roles/components/rolPage";
import SignInPage from "./pages/auth/components/SignInPage";
import CompanyPage from "./pages/company/components/companyPage";
import EnvironmentPage from "./pages/environment/components/environmentPage";
import StationPage from "./pages/station/components/stationPage";
import { ThemeProvider } from "next-themes";
import { useAuthStore } from "./pages/auth/lib/auth.store";
import ReservationsPage from "./pages/reservations/components/reservationsPage";
import EventPage from "./pages/events/components/eventPage";
import HomePage from "./pages/home/components/HomePage";

// const isAuthenticated = () => {
//   return localStorage.getItem("token") !== null;
// };

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuthStore();
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
            element={token ? <Navigate to="/inicio" /> : <SignInPage />}
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
          <Route
            path="/empresas/salones"
            element={
              <ProtectedRoute>
                <EnvironmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empresas/mesas"
            element={
              <ProtectedRoute>
                <StationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empresas/eventos"
            element={
              <ProtectedRoute>
                <EventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empresas/eventos/:companyId"
            element={
              <ProtectedRoute>
                <EventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eventos/reservas/:eventId"
            element={
              <ProtectedRoute>
                <ReservationsPage />
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
