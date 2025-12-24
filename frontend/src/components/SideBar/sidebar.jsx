import React, { useState } from "react";

const Sidebar = ({ showExtraButtons = true }) => {
  const user = {
    name: "Profile(name)",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  };

  // Tabs (Notifications + Review optional)
  const tabs = [
    "Clubs",
    "Domains in Club",
    ...(showExtraButtons ? ["Notifications", "Review"] : []),
  ];

  const recentClubs = ["gdg", "oss", "cp", "ddq"];

  const workingDomains = [
    "Technical",
    "Design",
    "Management",
    "Content / PR",
  ];

  const [activeTab, setActiveTab] = useState("Clubs");

  return (
    <aside className="w-full h-full flex flex-col items-center py-8 px-4 bg-[var(--panel)] border-r border-[var(--border)] shadow-[var(--shadow)] overflow-y-auto">

      {/* Profile */}
      <div className="flex flex-col items-center mb-8 w-full">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 border-4 border-white shadow-sm">
          <img
            src={user.image}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold text-[var(--text)]">
          {user.name}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-col w-full gap-3 mb-8 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full py-2 px-4 rounded-[var(--radius)] font-medium transition-colors shadow-sm
              ${
                activeTab === tab
                  ? "bg-sky-400 text-white"
                  : "bg-sky-200 hover:bg-sky-300 text-slate-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="w-full border-t border-[var(--border)] my-2 mb-6"></div>

      {/* Content Section */}
      <div className="flex flex-col w-full px-4">

        {/* Clubs */}
        {activeTab === "Clubs" && (
          <>
            <h5 className="text-md font-semibold mb-4 text-center">
              MEMBER OF CLUBS
            </h5>
            <div className="flex flex-col gap-3">
              {recentClubs.map((club) => (
                <button
                  key={club}
                  className="w-full py-2 px-4 rounded bg-white border text-gray-700 uppercase text-center"
                >
                  {club}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Domains */}
        {activeTab === "Domains in Club" && (
          <>
            <h5 className="text-md font-semibold mb-4 text-center">
              WORKING DOMAINS
            </h5>
            <div className="grid gap-3">
              {workingDomains.map((domain) => (
                <div
                  key={domain}
                  className="w-full py-2 px-4 rounded bg-white border text-gray-700 text-center"
                >
                  {domain}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Notifications */}
        {showExtraButtons && activeTab === "Notifications" && (
          <>
            <h5 className="text-md font-semibold mb-4 text-center">
              NOTIFICATIONS
            </h5>
            <div className="p-4 bg-white border rounded text-center">
              No notifications yet.
            </div>
          </>
        )}

        {/* Review */}
        {showExtraButtons && activeTab === "Review" && (
          <>
            <h5 className="text-md font-semibold mb-4 text-center">
              REVIEW
            </h5>
            <div className="p-4 bg-white border rounded text-center">
              No reviews yet.
            </div>
          </>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;
