import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar/sidebar';
import Dashboard from '../../components/SideBar/DashboardTE';

const TePanel = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (!location.state?.fromLogin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-40 bg-[var(--accent)] text-white p-3 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-var(--navbar-height))] gap-[var(--gap)] p-4 md:p-6">
        {/* Sidebar - Hidden on mobile, visible on md and up */}
        <div
          className={`
            w-72 h-full
            rounded-r-[var(--radius)] md:rounded-[var(--radius)] overflow-hidden
            fixed md:static inset-y-0 left-0 md:inset-auto z-30
            transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          `}
        >
          <Sidebar />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:hidden z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 bg-[var(--panel)] rounded-[var(--radius)] shadow-[var(--shadow)] border border-[var(--border)] p-4 md:p-6 overflow-y-auto">
          <Dashboard />
        </div>
      </div>
    </>
  );
};

export default TePanel;
