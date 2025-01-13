import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/auth/components/SignInPage";
import Layout from "./pages/home/components/Homepage";
import UsersPage from "./pages/users/components/usersPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInPage />}></Route>
        <Route
          path="/inicio"
          element={<Layout children={<div></div>} />}
        ></Route>
        <Route path="/usuario" element={<UsersPage />}></Route>

      </Routes>
    </BrowserRouter>
  );
}
