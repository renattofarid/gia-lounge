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
import { EntryPage } from "./pages/entry/components/entryPage";
// import HomePage from "./pages/home/components/HomePage";
import { useHasPermission } from "./hooks/useHasPermission";
import { errorToast } from "./lib/core.function";
import HomePage from "./pages/home/components/Homepage";
// import LotteryPage from "./pages/lottery/components/lotteryPage";

// const isAuthenticated = () => {
//   return localStorage.getItem("token") !== null;
// };

function ProtectedRoute({
  children,
  requiredPermission,
  requiredType,
}: {
  children: JSX.Element;
  requiredPermission?: string;
  requiredType?: string;
}) {
  const { token } = useAuthStore();

  // Llamamos siempre a useHasPermission
  // const hasPermission = useHasPermission(
  //   requiredPermission ?? "",
  //   requiredType ?? ""
  // );

  if (!token) return <Navigate to="/login" replace />;
  // if (requiredPermission && requiredType && !hasPermission) {
  //   errorToast("No tienes permisos para acceder a este recurso");
  //   return <Navigate to="/inicio" replace />;
  // }
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
              <ProtectedRoute requiredPermission="Leer" requiredType="Usuarios">
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/roles"
            element={
              <ProtectedRoute
                requiredPermission="Leer Roles"
                requiredType="Roles"
              >
                <RolPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/empresas"
            element={
              // <ProtectedRoute requiredPermission="Leer" requiredType="Empresas">
                <CompanyPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/empresas/salones"
            element={
              // <ProtectedRoute requiredPermission="Leer" requiredType="Salones">
                <EnvironmentPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/empresas/mesas"
            element={
              // <ProtectedRoute requiredPermission="Leer" requiredType="Mesas">
                <StationPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/empresas/eventos"
            element={
              // <ProtectedRoute requiredPermission="Leer" requiredType="Eventos">
                <EventPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/empresas/entradas"
            element={
              <ProtectedRoute requiredPermission="Leer" requiredType="Entradas">
                <EntryPage />
              </ProtectedRoute>
            }
          />
           {/* <Route
            path="/empresas/sorteos"
            element={
              <ProtectedRoute requiredPermission="Leer" requiredType="Sorteos">
                <LotteryPage />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/empresas/eventos/:companyId"
            element={
              <ProtectedRoute requiredPermission="Leer" requiredType="Eventos">
                <EventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eventos/reservas/:eventId"
            element={
              <ProtectedRoute requiredPermission="Leer" requiredType="Reservas">
                <ReservationsPage />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/eventos/reservas/:eventId"
            element={
              <ProtectedRoute>
                <ReservationsPage />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/eventos/entradas/:eventId"
            element={
              <ProtectedRoute requiredPermission="Leer" requiredType="Entradas">
                <EntryPage />
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
