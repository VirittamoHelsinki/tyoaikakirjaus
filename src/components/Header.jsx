import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { fullName } from "../features/functions";
import drop from "../assets/drop.png";
import "../styles/Header.scss";

const Header = () => {
  const [logoutOpen, setLogoutOpen] = useState(false);

  const { user, logout } = UserAuth();

  const logoutRef = useRef();

  useEffect(() => {
    const closeDropdown = (e) => {
      if (e.target !== logoutRef.current) {
        setLogoutOpen(false);
      }
    };
    document.body.addEventListener("click", closeDropdown);
    return () => document.body.removeEventListener("click", closeDropdown);
  }, []);

  const onLogout = async () => {
    try {
      await logout();
    } catch (e) {
      window.alert("Ongelmia uloskirjautumisessa:\n\n" + error);
    }
  };

  return (
    <div className="header-main">
      <Link to="/" className="header-label">
        Virittämö
      </Link>
      {user ? (
        <label className="header-label" ref={logoutRef} onClick={() => setLogoutOpen(!logoutOpen)}>
          {fullName(user.email)}
          <img src={drop} alt="" />
          <div className="dropdown">
            {logoutOpen && (
              <div className="dropdown-content" onClick={onLogout}>
                Kirjaudu ulos
              </div>
            )}
          </div>
        </label>
      ) : (
        <label className="header-label">Ei käyttäjää</label>
      )}
    </div>
  );
};

export default Header;
