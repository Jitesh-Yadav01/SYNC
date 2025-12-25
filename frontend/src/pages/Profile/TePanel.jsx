import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar/sidebar';
import Dashboard from '../../components/SideBar/DashboardTE';
import TaskTable from '@/components/TaskTable';

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
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-[var(--accent)] text-white p-3 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

  <div className="flex flex-col lg:flex-row landscape:flex-row w-full min-h-[calc(100vh-var(--navbar-height))] gap-[var(--gap)] p-4 lg:p-6">
        {/* Sidebar - Hidden on mobile, visible on md and up */}
        <div
          className={`
            w-72 landscape:w-56 h-full
            rounded-r-[var(--radius)] md:rounded-[var(--radius)] overflow-hidden
            fixed lg:static inset-y-0 left-0 lg:inset-auto z-30
            transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          `}
        >
          <Sidebar />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

  {/* Main content */}
  <div className="flex-1 bg-[var(--panel)] rounded-[var(--radius)] shadow-[var(--shadow)] border border-[var(--border)] p-4 lg:p-6 pr-12 lg:pr-6 pb-20 lg:pb-6 overflow-y-auto">
          <Dashboard />
          <div className="outer-container flex flex-col gap-4 lg:grid lg:grid-cols-1 lg:items-start">
            <div className="flex flex-col lg:pr-4 w-full lg:w-auto">
              <h2 className="title text-lg font-semibold">Task Management</h2>
              <hr className="my-2 border-[var(--border)]" />
            </div>
            
            <div className="card w-full flex-1 p-2 lg:p-4">
              <div className="w-full">
                <TaskTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TePanel;
