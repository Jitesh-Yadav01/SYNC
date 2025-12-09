import React from 'react'
import { useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar/sidebar';

const FePanel = () => {
  const location = useLocation();

  if (!location.state?.fromLogin) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex w-full h-[85vh] gap-[var(--gap)]">
      <div className="w-72 flex-shrink-0 h-full rounded-[var(--radius)] overflow-hidden">
        <Sidebar />
      </div>
      <div className="flex-1 bg-[var(--panel)] rounded-[var(--radius)] shadow-[var(--shadow)] border border-[var(--border)] p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Select a tab from the sidebar to view content.</p>
        
        {/* Placeholder for future content content */}
      </div>
    </div>
  )
}

export default FePanel