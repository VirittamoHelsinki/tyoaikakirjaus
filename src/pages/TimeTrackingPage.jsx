import { useState, useEffect } from "react";
import "../styles/TimeTrackingPage.scss";

const getTime = () => {
  const hours = new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours();
  const minutes = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
  const seconds = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
  return hours + ":" + minutes + ":" + seconds;
};

const TimeTrackingPage = () => {
  const [time, setTime] = useState(getTime());
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState("lähityö");

  useEffect(() => {
    const interval = setInterval(() => setTime(getTime()), 1000);
    return () => {
      clearInterval(interval);
    };
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
            <button>Sisään</button>
            <button>Ulos</button>
          </div>
        </div>
        <div className="status-detail-content">
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
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingPage;
