import { Link, Navigate, useParams } from "react-router-dom";
import { getNetwork } from "../data/networks";

export default function FakeLoginPage() {
  const { id } = useParams();
  const network = getNetwork(id);

  if (!network?.loginFile) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="fake-login">
      <div className="fake-login__banner">
        <Link to="/" className="fake-login__back">
          ← Retour
        </Link>
      </div>
      <iframe
        className="fake-login__frame"
        src={network.loginFile}
        title={`Connexion ${network.label}`}
      />
    </div>
  );
}
