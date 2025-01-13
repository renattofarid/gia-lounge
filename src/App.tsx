import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/home/components/Homepage";
import UserPage from "./pages/users/components/UserPage";
import RolPage from "./pages/roles/components/rolPage";
import SignInPage from "./pages/auth/components/SignInPage";

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
          path="/usuarios/permisos"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
