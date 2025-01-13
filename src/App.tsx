import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SignInPage from "./pages/auth/components/SignInPage";
import HomePage from "./pages/home/components/Homepage";
import UserPage from "./pages/users/components/UserPage";

// Simular autenticación (deberías usar contexto o un servicio real)
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null; // O cualquier lógica que determines
};

// Componente de ruta protegida
function ProtectedRoute({ children }: { children: JSX.Element }) {
  return isAuthenticated() ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida */}
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
      </Routes>
    </BrowserRouter>
  );
}
