import React from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import "../styles/FrontPage.scss";

const FrontPage = () => {
  const { logout, admin } = UserAuth();

  const onLogout = async () => {
    try {
      await logout();
    } catch (e) {
      window.alert("Ongelmia uloskirjautumisessa:\n\n" + error);
    }
  };

  return (
    <div className="frontpage-main">
      <div className="frontpage-content">
        <Link to="working-time" className="frontpage-button">
          Työaikaleimaus
        </Link>
        <Link to="work-schedule" className="frontpage-button">
          Työvuorosuunnitelma
        </Link>
        {admin && (
          <Link to="employees" className="frontpage-button">
            Työntekijät
          </Link>
        )}
        <button className="frontpage-button" onClick={onLogout}>
          Kirjaudu ulos
        </button>
      </div>
    </div>
  );
};

export default FrontPage;
