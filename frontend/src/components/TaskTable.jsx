import React from "react";

const rows = [
  { assignment: "Designs", assignedTo: "Abhinav", deadline: "Dec 20", status: "complete" },
  { assignment: "Winter Project", assignedTo: "FE", deadline: "Dec 25", status: "pending" },
  { assignment: "...........", assignedTo: "Club", deadline: "May 23", status: "ongoing" }
];
export default function TaskTable() {
  return (
    <div className="w-full h-full">
      {/* Mobile stacked list */}
      <div className="md:hidden w-full py-4">
        <div className="w-full flex flex-col gap-3 px-4">
          {rows.map((r, i) => (
            <div key={i} className="w-full bg-[var(--panel)] border border-[var(--border)] rounded-lg px-4 py-3 shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold leading-tight">{r.assignment}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.assignedTo}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">{r.deadline}</div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                    r.status === 'complete' ? 'bg-green-100 text-green-800' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop/tablet view */}
      <div className="hidden md:block">
        <table className="w-full table-auto text-sm text-left">
          <thead>
            <tr>
              <th className="px-3 py-2 font-medium">Assignments</th>
              <th className="px-3 py-2 font-medium">Assigned To</th>
              <th className="px-3 py-2 font-medium">Deadline</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-2 align-top break-words whitespace-normal">{r.assignment}</td>
                <td className="px-3 py-2 align-top">{r.assignedTo}</td>
                <td className="px-3 py-2 align-top">{r.deadline}</td>
                <td className="px-3 py-2 align-top">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    r.status === 'complete' ? 'bg-green-100 text-green-800' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
