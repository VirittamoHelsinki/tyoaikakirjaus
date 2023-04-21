import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import "../styles/WorkingTimePage.scss";

const getTime = (time = new Date()) => {
  const hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  const minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  const seconds = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
  return hours + ":" + minutes + ":" + seconds;
};

const TimeTrackingPage = () => {
  const [time, setTime] = useState(getTime());
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [status, setStatus] = useState("lähityö");

  const { user } = UserAuth();

  /* get date format "yyyy-mm-dd" and use it as document name in db */
  const date = new Date().getFullYear().toString() + "-" + new Date().getMonth().toString() + "-" + new Date().getDate().toString();

  useEffect(() => {
    const interval = setInterval(() => setTime(getTime()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const setWorkTime = async () => {
    try {
      await setDoc(doc(db, "users", user.uid, "working-time", date), {
        status: status,
        arrival: arrival,
        departure: departure,
      });
    } catch (error) {
      window.alert("Ongelmia tallennuksessa:\n\n" + error);
    }
  };

  const fetchWorkTime = async () => {
    try {
      if (!user.uid) return;
      const docSnap = await getDoc(doc(db, "users", user.uid, "working-time", date));
      if (docSnap.exists()) {
        setStatus(docSnap.data().status);
        setArrival(docSnap.data().arrival);
        setDeparture(docSnap.data().departure);
      }
    } catch (error) {
      window.alert("Ongelmia datan haussa:\n\n" + error);
    }
  };

  useEffect(() => {
    if (!arrival && !departure) {
      return;
    }
    setWorkTime();
  }, [status, arrival, departure]);

  useEffect(() => {
    fetchWorkTime();
  }, []);

  return (
    <div className="timetracking-main">
      <div className="timetracking-content">
        <div className="date-buttons-content">
          <div className="date-column">
            <div className="date-label">
              <label>{new Date().toLocaleDateString("fi-FI", { weekday: "long", year: "numeric", month: "numeric", day: "numeric" })}</label>
            </div>
            <div className="time-label">
              <label>{time}</label>
            </div>
          </div>
          <div className="button-column">
            {arrival ? (
              <div className="time-button disabled">Sisään</div>
            ) : (
              <div className="time-button" onClick={() => setArrival(new Date().valueOf().toString())}>
                Sisään
              </div>
            )}
            {departure ? (
              <div className="time-button disabled">Ulos</div>
            ) : (
              <div className="time-button" onClick={() => setDeparture(new Date().valueOf().toString())}>
                Ulos
              </div>
            )}
          </div>
        </div>
        <div className="right-side-main">
          <div className="status-times-content">
            <div className="switch-status-content">
              <div className="switch-status-label">
                <p>Status</p>
              </div>
              <div className="switch-status-buttons">
                <button className={`switch-button ${status === "lähityö" && "selected"}`} onClick={() => setStatus("lähityö")}>
                  Lähityö
                </button>
                <button className={`switch-button ${status === "etätyö" && "selected"}`} onClick={() => setStatus("etätyö")}>
                  Etätyö
                </button>
              </div>
            </div>
            <div className="working-time-content">
              <div className="label-stamp-box-content">
                <label className="title-label">Sisään:</label>
                <label className="stamp-box-label">{arrival && getTime(new Date(parseInt(arrival)))}</label>
              </div>
              <div className="label-stamp-box-content">
                <label className="title-label">Ulos:</label>
                <label className="stamp-box-label">{departure && getTime(new Date(parseInt(departure)))}</label>
              </div>
            </div>
          </div>
          <div className="homepage-button-content">
            <Link to="/" className="homepage-button">
              Palaa etusivulle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingPage;
