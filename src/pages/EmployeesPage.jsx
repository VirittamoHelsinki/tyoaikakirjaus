import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/EmployeesPage.scss";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);

  const name = (email) => {
    const _name = email.split('@')[0];
    const name = _name.replace(/[0-9]/g, '');
    const names = name.split('.')
    const firstname = names[0].charAt(0).toUpperCase() + names[0].slice(1);
    const lastname = names[names.length - 1].charAt(0).toUpperCase() + names[names.length - 1].slice(1);
    return firstname + " " + lastname;
  }

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
    <div className="employees-main">
      <div className="employees-content">
        <div className="employees-title">
          <label>Työntekijät</label>
        </div>
        <div className="employees-list">
          {employees.map((data, index) => (
            <div className={`employee-data ${index % 2 === 0 && "even"}`} key={index}>
              <label>{name(data.email)}</label>
              <Link to="/work-schedule" className="schedule-button" state={{ uid: data.uid, name: name(data.email) }}>
                Työajat
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
