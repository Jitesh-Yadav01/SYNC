import React from "react";
import "./DashboardTE.css";
import Notifications from "../Notifications/NotificationsTE";
import DatesAndDeadlines from "../DatesDeadlines/DatesDeadlinesTE";
import TodoList from "../Todo/ToDoListTE";

const DashboardTE = () => {
  return (
    <div className="dashboard-root">
      <Notifications />

      <section className="dash-bottom-row">
        <DatesAndDeadlines />
        <TodoList />
      </section>
    </div>
  );
};

export default DashboardTE;
