import React from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import "../styles/FrontPage.scss";

const FrontPage = () => {
  const { logout } = UserAuth();

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
        <Link to="time-tracking" className="frontpage-button">
          Työaikaleimaus
        </Link>
        <Link to="manage-booking" className="frontpage-button">
          Työvuorosuunnitelma
        </Link>
        <button className="frontpage-button" onClick={onLogout}>
          Kirjaudu ulos
        </button>
      </div>
    </div>
  );
};

export default FrontPage;
