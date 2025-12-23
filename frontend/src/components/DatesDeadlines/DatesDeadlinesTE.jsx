import React from "react";
import "../SideBar/DashboardTE.css";
import "./DatesDeadlinesTE.css";

const deadlines = [
  { 
    id: 1, 
    title: "Winter Project Code Review", 
    club: "GDSC Club", 
    date: "Dec 27" 
  },
  { 
    id: 2, 
    title: "Design Review", 
    club: "OSS Club", 
    date: "Dec 31" 
  },
];

const DatesDeadlinesTE = () => {
  return (
    <section className="dashboard-section dates-section-bg">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dates & Deadlines</h2>
        <div className="dashboard-divider" />
      </div>

      <div className="dates-card">
        {deadlines.map((item) => (
          <div className="dates-item" key={item.id}>
            <h3 className="dates-title">{item.title}</h3>

            <div className="dates-meta">
              <span className="dates-chip">{item.club}</span>
              <span className="dates-due">Due: {item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DatesDeadlinesTE;