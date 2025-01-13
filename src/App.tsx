import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SignInPage from "./pages/auth/components/SignInPage";
import Layout from "./pages/home/components/Homepage";

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
          element={<Layout children={<div></div>} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
