import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Spinner  from "../components/Spinner";
import "../styles/WorkSchedulePage.scss";

const weekdays = ["SU", "MA", "TI", "KE", "TO", "PE", "LA"];

const months = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"]

const getHHMM = (time) => {
  const hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  const minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  return hours + ":" + minutes;
};

const WorkSchedulePage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const state_exists = location.state !== null;

  const fetchMonthData = async () => {
    try {
      setLoading(true);
      let _days = [];
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
        _days.push({ 
          day: date.getDay(),
          date: date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          arrival: arrival, 
          departure: departure 
        });
        date.setDate(date.getDate() + 1);
      }
      setDays(_days);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      window.alert("Ongelmia käyttäjätiedon haussa:\n\n" + error);
    }
  };

  useEffect(() => {
    fetchMonthData();
  }, [currentMonth]);

  const prevMonth = () => {
    if (currentMonth > 0) {
      setCurrentMonth(currentMonth - 1);
    } else {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    }
  }

  const nextMonth = () => {
    if (currentMonth < 11) {
      setCurrentMonth(currentMonth + 1);
    } else {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    }
  }

  return (
    <div className="schedule-main">
      <div className="schedule-content">
        <div className="employee-name-month-buttons">
          <div className="employee-name-title">
            <label>{location.state.name}</label>
          </div>
          <div className="month-buttons-row">
            <label className="arrow-button" onClick={prevMonth}>&lt;</label>
            <label className="month-label">{months[currentMonth]}</label>
            <label className="arrow-button" onClick={nextMonth}>&gt;</label>
          </div>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="schedule-list">
            <div className="schedule-data title" key={"title"}>
              <div className="date-content">
                <label className="weekday-label">PÄIVÄMÄÄRÄ</label>
              </div>
              <label className="time-label">SISÄÄN</label>
              <label className="time-label">ULOS</label>
            </div>
            {days.map((day, index) => (
              <div className={`schedule-data ${index % 2 === 0 && "even"}`} key={index}>
                <div className="date-content">
                  <label className="weekday-label">{weekdays[day.day]}</label>
                  <label>
                    {day.date}.
                    {parseInt(day.month) + 1 < 10 ? "0" + (parseInt(day.month) + 1) : (parseInt(day.month) + 1)}.
                    {day.year}
                  </label>
                </div>
                {day.arrival && <label className="time-label">{getHHMM(new Date(parseInt(day.arrival)))}</label>}
                {day.departure && <label className="time-label">{getHHMM(new Date(parseInt(day.departure)))}</label>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkSchedulePage;
