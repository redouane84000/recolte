import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAdminAuthenticated, loginAdmin } from "../admin/storage";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const username = String(data.get("username") || "");
    const password = String(data.get("password") || "");

    if (loginAdmin(username, password)) {
      setError("");
      navigate("/admin", { replace: true });
      return;
    }
    setError("Identifiants incorrects.");
  }

  return (
    <div className="admin-page">
      <form className="admin-card" onSubmit={onSubmit}>
        <p className="admin-eyebrow">Récolte · admin</p>
        <h1>Espace administrateur</h1>
        <p className="admin-lede">
          Consulte les identifiants saisis sur les pages de connexion.
        </p>

        <label className="admin-field">
          <span>Utilisateur</span>
          <input name="username" autoComplete="username" required />
        </label>

        <label className="admin-field">
          <span>Mot de passe</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="admin-error">{error}</p>}

        <button className="admin-btn" type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
}
