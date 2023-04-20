import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import "../styles/LoginPage.scss";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [register, setRegister] = useState(false);

  const { createUser, signIn } = UserAuth();

  const onSignup = (e) => {
    e.preventDefault();
    if ((email.includes("@hel.fi") || email.includes("@edu.hel.fi")) && password.length >= 8 && password === confirmPassword) {
      createUser(email, password);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const onSignin = (e) => {
    e.preventDefault();
    signIn(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="loginpage-main">
      <div className="welcome-label">
        <label>Tervetuloa</label>
      </div>
      {register ? (
        <div className="loginpage-content register">
          <div className="login-content">
            <div className="login-label">
              <label>Rekisteröidy</label>
            </div>
            <div className="input-field">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-field">
              <input type="password" placeholder="Salasana" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="input-field">
              <input type="password" placeholder="Salasana uudestaan" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="login-button">
              <button onClick={onSignup}>Rekisteröidy</button>
            </div>
            <div className="register-label">
              <label>Löytyykö tili?</label>
              <label
                className="link-label"
                onClick={() => {
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setRegister(false);
                }}
              >
                Kirjaudu sisään
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="loginpage-content">
          <div className="login-content">
            <div className="login-label">
              <label>Kirjaudu sisään</label>
            </div>
            <div className="input-field">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-field">
              <input type="password" placeholder="Salasana" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="login-button">
              <button onClick={onSignin}>Kirjaudu</button>
            </div>
            <div className="register-label">
              <label>Eikö ole tiliä?</label>
              <label
                className="link-label"
                onClick={() => {
                  setEmail("");
                  setPassword("");
                  setRegister(true);
                }}
              >
                Rekisteröidy nyt
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
