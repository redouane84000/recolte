import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import Home from "./pages/Home";
import FakeLoginPage from "./pages/FakeLoginPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function RedirectToLogin() {
  const { id } = useParams();
  return <Navigate to={`/${id}/connexion`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/:id/connexion" element={<FakeLoginPage />} />
        <Route path="/:id" element={<RedirectToLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
