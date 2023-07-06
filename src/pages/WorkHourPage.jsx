import { useState, useEffect } from "react";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { UserAuth } from "../context/AuthContext";
import { getHHMMSS, getHHMM, getDate } from "../features/functions";
import { weekdays } from "../features/arrays";
import "../styles/WorkHourPage.scss";

const WorkHourPage = () => {
  const [time, setTime] = useState(getHHMMSS());
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [workTimes, setWorkTimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalTime, setModalTime] = useState(new Date());

  const { user } = UserAuth();

  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const date = new Date().getDate();

  /* Update the clock time every second */
  useEffect(() => {
    const interval = setInterval(() => setTime(getHHMMSS()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  /* Save the arrival/departure unix stamp to db by using "yyyy-mm-dd" doc name, save log info to db */
  const setWorkTime = async () => {
    try {
      await setDoc(doc(db, "users", user.uid, "working-time", getDate(new Date())), {
        arrival: arrival,
        departure: departure,
      });
      await setDoc(
        doc(db, "logs", new Date().toJSON().slice(0, 10)),
        {
          [new Date().toLocaleTimeString("en-GB")]: user.uid + " clicked set work time button ",
        },
        { merge: true }
      );
    } catch (error) {
      window.alert("Ongelmia tallennuksessa:\n\n" + error);
    }
  };

  /* Fetch today stamps and set them in arrival/departure states if exists, fetch all docs from the working-time collection */
  const fetchWorkTime = async () => {
    try {
      const docSnap = await getDoc(doc(db, "users", user.uid, "working-time", getDate(new Date())));
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

  /* When arrival/departure changes call the setworkTime function */
  useEffect(() => {
    if (!arrival && !departure) {
      return;
    }
    setWorkTime();
  }, [arrival, departure]);

  /* Do the db fetching when user data is ready */
  useEffect(() => {
    if (!user.uid) {
      return;
    }
    fetchWorkTime();
  }, [user]);

  /* Arrival allowed between 7:20-9:10 */
  const arrivalAllowed = () => {
    return (
      new Date().valueOf() > new Date(year, month, date, "7", "20").valueOf() &&
      new Date().valueOf() < new Date(year, month, date, "9", "10").valueOf() &&
      !arrival
    );
  };

  /* Departure allowed after 8h04min = 29040000, 8h14min = 296400000 */
  const departureAllowed = () => {
    return new Date().valueOf() > parseInt(arrival) + 29040000 && new Date().valueOf() < parseInt(arrival) + 29640000 && !departure;
  };

  return (
    <div className="workhour-content">
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
          {arrivalAllowed() ? (
            <div
              className="time-button"
              onClick={() => {
                if (user) {
                  setModalText("Olet kirjautunut sisään!");
                  setModalTime(new Date());
                  setArrival(new Date().valueOf().toString());
                  setShowModal(true);
                }
              }}
            >
              Sisään
            </div>
          ) : (
            <div className="time-button disabled">Sisään</div>
          )}
          {departureAllowed() ? (
            <div
              className="time-button"
              onClick={() => {
                if (user) {
                  setModalText("Olet kirjautunut ulos!");
                  setModalTime(new Date());
                  setDeparture(new Date().valueOf().toString());
                  setShowModal(true);
                }
              }}
            >
              Ulos
            </div>
          ) : (
            <div className="time-button disabled">Ulos</div>
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
              <div className="data-row title" key="title">
                <div className="day-date-label">
                  <label>PÄIVÄMÄÄRÄ</label>
                </div>
                <label>SISÄÄN</label>
                <label>ULOS</label>
              </div>
              {workTimes.slice(-6).map((data, index) => (
                <div className={`data-row ${index % 2 === 1 && "odd"}`} key={index}>
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
                  <label>Kirjautumisen aika {getHHMMSS(modalTime)}</label>
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

export default WorkHourPage;
