import React from 'react';

const Sidebar = () => {
    // Mock data for demonstration
    const user = {
        name: "Profile(name)",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" // Placeholder avatar
    };

    const tabs = [
        "Clubs",
        "Activities",
        "Notifications"
    ];

    const recentClubs = [
        "gdg",
        "oss",
        "cp",
        "ddq"
    ];

    return (
        <aside className="w-full h-full flex flex-col items-center py-8 px-4 bg-[var(--panel)] border-r border-[var(--border)] shadow-[var(--shadow)] overflow-y-auto">
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-8 w-full">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 border-4 border-white shadow-sm">
                   {/* Using an img tag with a placeholder, or a div if image fails */}
                   <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text)]">{user.name}</h2>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-col w-full gap-3 mb-8 px-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className="w-full py-2 px-4 rounded-[var(--radius)] bg-sky-200 hover:bg-sky-300 text-slate-700 font-medium transition-colors shadow-sm text-center"
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="w-full border-t border-[var(--border)] my-2 mb-6"></div>

            {/* Recent Clubs Section */}
            <div className="flex flex-col w-full px-4">
                <h3 className="text-md font-semibold text-[var(--text)] mb-4 text-center">Clubs</h3>
                <div className="flex flex-col gap-3">
                    {recentClubs.map((club) => (
                        <button
                            key={club}
                            className="w-full py-2 px-4 rounded-[var(--radius)] bg-white border border-gray-200 hover:border-[var(--accent)] text-gray-700 font-medium transition-all shadow-sm uppercase text-center"
                        >
                            {club}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
