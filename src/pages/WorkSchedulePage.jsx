import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Spinner } from "../components/Spinner";
import "../styles/WorkSchedulePage.scss";

const weekdays = ["SU", "MA", "TI", "KE", "TO", "PE", "LA"];

const getHHMM = (time) => {
  const hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  const minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  return hours + ":" + minutes;
};

const WorkSchedulePage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);
  const [stamps, setStamps] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const state_exists = location.state !== null;

  const fetchMonthData = async () => {
    setLoading(true);
    try {
      let _stamps = [];
      let date = new Date(currentYear, currentMonth, 1);
      while (date.getMonth() === currentMonth) {
        let arrival = null;
        let departure = null;
        const _date = date.getFullYear().toString() + "-" + date.getMonth().toString() + "-" + date.getDate().toString();
        const docSnap = await getDoc(doc(db, "users", location.state.uid, "working-time", _date));
        if (docSnap.exists()) {
          arrival = docSnap.data().arrival;
          departure = docSnap.data().departure;
        }
        _stamps.push({ arrival: arrival, departure: departure });
        date.setDate(date.getDate() + 1);
      }
      console.log(_stamps);
      setStamps(_stamps);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      window.alert("Ongelmia käyttäjätiedon haussa:\n\n" + error);
    }
  };

  useEffect(() => {
    fetchMonthData();
  }, [currentMonth]);

  useEffect(() => {
    if (stamps.length > 0) {
      let _days = [];
      let date = new Date(currentYear, currentMonth, 1);
      while (date.getMonth() === currentMonth) {
        _days.push({
          day: date.getDay(),
          date: date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
          month: date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth(),
          year: date.getFullYear(),
          arrival: stamps[date.getDate() - 1].arrival,
          departure: stamps[date.getDate() - 1].departure,
        });
        date.setDate(date.getDate() + 1);
      }
      console.log(_days);
      setDays(_days);
    }
  }, [stamps]);

  return (
    <div className="schedule-main">
      <div className="schedule-content">
        <div className="employee-name-title">
          <label>Etunimi Sukunimi</label>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="schedule-list">
            {days.map((day, index) => (
              <div className={`schedule-data ${index % 2 === 0 && "even"}`} key={index}>
                <label className="weekday-label">{weekdays[day.day]}</label>
                <label>
                  {day.date}.{parseInt(day.month) + 1}.{day.year}
                </label>
                {day.arrival && <label>{getHHMM(new Date(parseInt(day.arrival)))}</label>}
                {day.departure && <label>{getHHMM(new Date(parseInt(day.departure)))}</label>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkSchedulePage;
