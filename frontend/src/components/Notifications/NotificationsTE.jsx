import React from "react";
import "../SideBar/DashboardTE.css";
import "./NotificationsTE.css";

const notifications = [
  { id: 1, title: "GDSC", body: "notification by gdsc jo bhi ho" },
  { id: 2, title: "GDSC", body: "notification by gdsc jo bhi ho" },
];

/* ---------- Notification Card ---------- */
const NotificationCard = ({ title, body }) => (
  <article className="notif-pill">
    <div className="notif-logo-wrap">
      <img src="/image.png" alt="GDSC Logo" className="notif-logo-img" />
    </div>

    <div className="notif-text">
      <div className="notif-title">{title}</div>
      <div className="notif-body">{body}</div>
    </div>
  </article>
);

/* ---------- Notifications ---------- */
const NotificationsTE = () => {
  return (
    <section className="dashboard-section notif-section-bg">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Notifications</h2>
        <div className="dashboard-divider" />
      </div>

      <div className="notif-list">
        {notifications.map((n) => (
          <NotificationCard
            key={n.id}
            title={n.title}
            body={n.body}
          />
        ))}
      </div>
    </section>
  );
};

export default NotificationsTE;
