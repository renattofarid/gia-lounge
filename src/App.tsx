import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/auth/components/SignInPage";
import Layout from "./pages/home/components/Homepage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInPage />}></Route>
        <Route
          path="/inicio"
          element={<Layout children={<div></div>} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
