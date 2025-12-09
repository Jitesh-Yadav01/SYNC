import React from "react";
import "./Dashboard.css";

/* ---------- demo data (replace with real API data later) ---------- */
const notifications = [
  { id: 1, title: "GDSC", body: "notification by gdsc\n" },
  { id: 2, title: "GDSC", body: "notification by gdsc\n" },
  { id: 3, title: "GDSC", body: "notification by gdsc\n" },
  { id: 4, title: "GDSC", body: "notification by gdsc\n" },
];

const taskList = [
  "tasks written here",
  "tasks written here",
  "tasks written here",
  "tasks written here",
];

/* ---------- small presentational components ---------- */

const LogoCircle = () => <div className="dash-logo-circle" />;

const NotificationCard = ({ title, body }) => (
  <article className="notif-card">
    <div className="notif-card-logo">
       <img
    src="/image.png"   // <-- your logo path
    alt="GDSC Logo"
    className="notif-logo-img"
  />
    </div>
    <div className="notif-card-text">
      <h3>{title}</h3>
      {body.split("\n").map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  </article>
);

/* ---------- main dashboard component ---------- */

const Dashboard = () => {
  return (
    <div className="dashboard-root">
      {/* NOTIFICATIONS */}
      <section className="dash-section dash-section--grey">
        <h2 className="dash-title">Notifications</h2>

        <div className="notif-grid">
          {notifications.map((n) => (
            <NotificationCard key={n.id} title={n.title} body={n.body} />
          ))}
        </div>
      </section>

      {/* TASKS AREA */}
      <section className="dash-section dash-section--grey">
        {/* header row: logo + GDSC + TASKS */}
        <div className="tasks-header-row">
          <div className="tasks-header-logo">
           
  <img
    src="/image.png"   // <-- your logo path
    alt="GDSC Logo"
    className="notif-logo-img"
  />

          </div>
          <div className="tasks-header-pill">GDSC</div>
          <div className="tasks-header-pill">TASKS</div>
        </div>

        {/* main two-column block */}
        <div className="tasks-main">
          <div className="tasks-left">
            <div className="tasks-left-box">
              <h3>dates and Deadline</h3>
            </div>
          </div>

          <div className="tasks-right">
            {taskList.map((task, index) => (
              <div key={index} className="task-chip">
                {task}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABLE + CREATE BUTTON */}
      <section className="dash-section dash-section--grey">
        <div className="table-header-row">
          <span className="table-pill">Name</span>
          <span className="table-pill">Assignees</span>
          <span className="table-pill">Deadline</span>
          <span className="table-pill">Project</span>
        </div>

        <div className="create-box">
          <button className="create-btn">Create a task</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
