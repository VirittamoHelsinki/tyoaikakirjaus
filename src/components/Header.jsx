import React from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import "../styles/Header.scss";

const Header = () => {
  const { user } = UserAuth();

  return (
    <div className="header-main">
      <Link to="/" className="header-label">
        Virittämö
      </Link>
      {user ? <label className="header-label">{user.email}</label> : <label className="header-label">Ei käyttäjää</label>}
    </div>
  );
};

export default Header;
