import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { fullName } from "../features/functions";
import "../styles/EmployeesPage.scss";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const list = [];
      const employeeSnap = await getDocs(collection(db, "employees"));
      employeeSnap.forEach((doc) => {
        list.push({
          uid: doc.id,
          email: doc.data().email,
        });
      });
      setEmployees(list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="employees-content">
      <div className="employees-title">
        <label>Työntekijät</label>
      </div>
      <div className="employees-list">
        {employees.map((data, index) => (
          <div className={`employee-data ${index % 2 === 0 && "even"}`} key={index}>
            <label>{fullName(data.email)}</label>
            <Link to="/work-schedule" className="schedule-button" state={{ uid: data.uid, name: fullName(data.email) }}>
              Työajat
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesPage;
