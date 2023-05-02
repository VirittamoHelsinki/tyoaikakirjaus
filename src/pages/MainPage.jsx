import React from "react";
import WorkHourPage from "./WorkHourPage";
import EmployeesPage from "./EmployeesPage";
import { UserAuth } from "../context/AuthContext";
import "../styles/MainPage.scss";

const FrontPage = () => {
  const { admin } = UserAuth();

  return <div className="mainpage">{admin ? <EmployeesPage /> : <WorkHourPage />}</div>;
};

export default FrontPage;
