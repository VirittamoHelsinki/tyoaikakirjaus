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
        {!admin && (
          <Link to="work-hour" className="frontpage-button">
            Työaikaleimaus
          </Link>
        )}
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
