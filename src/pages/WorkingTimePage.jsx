import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { UserAuth } from "../context/AuthContext";
import "../styles/WorkingTimePage.scss";

const getHHMMSS = (time = new Date()) => {
  const hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  const minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  const seconds = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
  return hours + ":" + minutes + ":" + seconds;
};

const getHHMM = (time) => {
  const hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  const minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  return hours + ":" + minutes;
};

const weekdays = ["SU", "MA", "TI", "KE", "TO", "PE", "LA"];

const TimeTrackingPage = () => {
  const [time, setTime] = useState(getHHMMSS());
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [workTimes, setWorkTimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  const { user } = UserAuth();

  /* get date format "yyyy-mm-dd" and use it as document name in db */
  const date = new Date().getFullYear().toString() + "-" + new Date().getMonth().toString() + "-" + new Date().getDate().toString();

  useEffect(() => {
    const interval = setInterval(() => setTime(getHHMMSS()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const setWorkTime = async () => {
    try {
      await setDoc(doc(db, "users", user.uid, "working-time", date), {
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
        setArrival(docSnap.data().arrival);
        setDeparture(docSnap.data().departure);
      }
      const times = [];
      const collectionSnap = await getDocs(collection(db, "users", user.uid, "working-time"));
      collectionSnap.forEach((doc) => {
        times.push({
          arrival: doc.data().arrival,
          departure: doc.data().departure,
        });
      });
      setWorkTimes(times);
    } catch (error) {
      window.alert("Ongelmia datan haussa:\n\n" + error);
    }
  };

  useEffect(() => {
    if (!arrival && !departure) {
      return;
    }
    setWorkTime();
  }, [arrival, departure]);

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
              <div
                className="time-button"
                onClick={() => {
                  setModalText("Olet kirjautunut sisään!");
                  setArrival(new Date().valueOf().toString());
                  setShowModal(true);
                }}
              >
                Sisään
              </div>
            )}
            {departure ? (
              <div className="time-button disabled">Ulos</div>
            ) : (
              <div
                className="time-button"
                onClick={() => {
                  setModalText("Olet kirjautunut ulos!");
                  setDeparture(new Date().valueOf().toString());
                  setShowModal(true);
                }}
              >
                Ulos
              </div>
            )}
          </div>
        </div>
        <div className="right-side-main">
          <div className="times-content">
            <div className="previous-content">
              <div className="previous-label">
                <p>Aiemmat työaikakirjaukset</p>
              </div>
              <div className="previous-data">
                {workTimes.slice(-5).map((data, index) => (
                  <div className={`data-row ${index % 2 === 0 && "even"}`} key={index}>
                    <div className="day-date-label">
                      <label>{weekdays[new Date(parseInt(data.arrival)).getDay()]}</label>
                      <label>
                        {new Date(parseInt(data.arrival)).getDate()}.{new Date(parseInt(data.arrival)).getMonth() + 1}
                      </label>
                    </div>
                    <label>{getHHMM(new Date(parseInt(data.arrival)))}</label>
                    {data.departure ? <label>{getHHMM(new Date(parseInt(data.departure)))}</label> : <label className="empty-label" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="working-time-content">
              <div className="label-stamp-box-content">
                <label className="title-label">Sisään:</label>
                <label className="stamp-box-label">{arrival && getHHMMSS(new Date(parseInt(arrival)))}</label>
              </div>
              <div className="label-stamp-box-content">
                <label className="title-label">Ulos:</label>
                <label className="stamp-box-label">{departure && getHHMMSS(new Date(parseInt(departure)))}</label>
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
      {showModal && (
        <div className="modal transparent-background">
          <div className="modal">
            <div className="modal-container">
              <div className="modal-text-content">
                <div className="text-label">
                  <label>{modalText}</label>
                </div>
                <div className="description-label">
                  <label>Kirjautumisen aika {getHHMMSS(new Date(parseInt(arrival)))}</label>
                </div>
              </div>
              <button
                className="modal-button"
                onClick={() => {
                  setModalText("");
                  setShowModal(false);
                }}
              >
                Sulje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTrackingPage;
