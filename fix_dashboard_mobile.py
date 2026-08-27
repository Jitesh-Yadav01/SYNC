import re

with open('frontend/src/pages/Profile/Shared/DashboardLayout.jsx', 'r') as f:
    content = f.read()

# We need to change the bottom nav to include a "More" button
old_bottom_nav = """            {/* Mobile Bottom Navigation Bar (PWA-friendly) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <nav className="flex items-center justify-around px-2 h-16">
                    {getVisibleTabs().slice(0, 4).map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    if (isStandalonePage) navigate(`/profile/${role}`, { state: { activeTab: tab.id } });
                                    else setActiveTab(tab.id);
                                }}
                                className={cn(
                                    "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors relative",
                                    isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-blue-600 rounded-b-md" />}
                                <tab.icon className={cn("h-5 w-5 transition-transform", isActive && "transform scale-110")} />
                                <span className={cn("text-[10px] font-medium tracking-tight", isActive ? "font-bold" : "")}>{tab.label.split(' ')[0]}</span>
                            </button>
                        );
                    })}
                    <button
                        onClick={() => {
                            if (isStandalonePage) navigate(`/profile/${role}`, { state: { activeTab: 'profile' } });
                            else setActiveTab('profile');
                        }}
                        className={cn(
                            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors relative",
                            activeTab === 'profile' ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        {activeTab === 'profile' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-blue-600 rounded-b-md" />}
                        <Users className={cn("h-5 w-5 transition-transform", activeTab === 'profile' && "transform scale-110")} />
                        <span className={cn("text-[10px] font-medium tracking-tight", activeTab === 'profile' ? "font-bold" : "")}>Profile</span>
                    </button>
                </nav>
            </div>"""

new_bottom_nav = """            {/* Mobile Bottom Navigation Bar (PWA-friendly) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-[60] shadow-[0_-4px_24px_rgba(0,0,0,0.04)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <nav className="flex items-center justify-around px-2 h-16">
                    {getVisibleTabs().slice(0, 3).map((tab) => {
                        const isActive = activeTab === tab.id && !isSidebarOpen;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    if (isStandalonePage) navigate(`/profile/${role}`, { state: { activeTab: tab.id } });
                                    else setActiveTab(tab.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={cn(
                                    "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors relative",
                                    isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-blue-600 rounded-b-md" />}
                                <tab.icon className={cn("h-5 w-5 transition-transform", isActive && "transform scale-110")} />
                                <span className={cn("text-[10px] font-medium tracking-tight", isActive ? "font-bold" : "")}>{tab.label.split(' ')[0]}</span>
                            </button>
                        );
                    })}
                    <button
                        onClick={() => {
                            if (isStandalonePage) navigate(`/profile/${role}`, { state: { activeTab: 'profile' } });
                            else setActiveTab('profile');
                            setIsSidebarOpen(false);
                        }}
                        className={cn(
                            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors relative",
                            (activeTab === 'profile' && !isSidebarOpen) ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        {(activeTab === 'profile' && !isSidebarOpen) && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-blue-600 rounded-b-md" />}
                        <Users className={cn("h-5 w-5 transition-transform", (activeTab === 'profile' && !isSidebarOpen) && "transform scale-110")} />
                        <span className={cn("text-[10px] font-medium tracking-tight", (activeTab === 'profile' && !isSidebarOpen) ? "font-bold" : "")}>Profile</span>
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={cn(
                            "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors relative",
                            isSidebarOpen ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        {isSidebarOpen && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-blue-600 rounded-b-md" />}
                        <Menu className={cn("h-5 w-5 transition-transform", isSidebarOpen && "transform scale-110")} />
                        <span className={cn("text-[10px] font-medium tracking-tight", isSidebarOpen ? "font-bold" : "")}>More</span>
                    </button>
                </nav>
            </div>

            {/* Mobile "More" Menu Overlay */}
            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)} />
                    <div className="relative bg-white rounded-t-3xl pb-24 pt-6 px-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full" />
                        <h3 className="text-sm font-bold text-slate-900 mb-4 px-2">Additional Options</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {role === 'Admin' && [
                                { id: 'manage-forms', label: 'Forms', icon: FileText },
                                { id: 'responses', label: 'Responses', icon: ClipboardList },
                                { id: 'iqac-events', label: 'Reports', icon: FileBarChart }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (isStandalonePage) navigate(`/profile/${role}`, { state: { activeTab: tab.id } });
                                        else setActiveTab(tab.id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className="flex flex-col items-center gap-2 p-2 rounded-xl active:bg-slate-50 transition-colors"
                                >
                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600")}>
                                        <tab.icon className="h-5 w-5" />
                                    </div>
                                    <span className={cn("text-[10px] font-medium text-center", activeTab === tab.id ? "text-blue-700 font-bold" : "text-slate-600")}>{tab.label}</span>
                                </button>
                            ))}
                            {role === 'Member' && profile?.year !== 'FE' && [
                                { id: 'manage-forms', label: 'Forms', icon: FileText },
                                { id: 'responses', label: 'Responses', icon: ClipboardList }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (isStandalonePage) navigate(`/profile/${role}`, { state: { activeTab: tab.id } });
                                        else setActiveTab(tab.id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className="flex flex-col items-center gap-2 p-2 rounded-xl active:bg-slate-50 transition-colors"
                                >
                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600")}>
                                        <tab.icon className="h-5 w-5" />
                                    </div>
                                    <span className={cn("text-[10px] font-medium text-center", activeTab === tab.id ? "text-blue-700 font-bold" : "text-slate-600")}>{tab.label}</span>
                                </button>
                            ))}
                            {role === 'Applicant' && [
                                { id: 'forms', label: 'Forms', icon: FileText }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (isStandalonePage) navigate(`/profile/${role}`, { state: { activeTab: tab.id } });
                                        else setActiveTab(tab.id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className="flex flex-col items-center gap-2 p-2 rounded-xl active:bg-slate-50 transition-colors"
                                >
                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600")}>
                                        <tab.icon className="h-5 w-5" />
                                    </div>
                                    <span className={cn("text-[10px] font-medium text-center", activeTab === tab.id ? "text-blue-700 font-bold" : "text-slate-600")}>{tab.label}</span>
                                </button>
                            ))}
                            
                            {/* Sign Out Button in More Menu */}
                            <button
                                onClick={() => { setIsSidebarOpen(false); handleLogout(); }}
                                className="flex flex-col items-center gap-2 p-2 rounded-xl active:bg-red-50 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                                    <LogOut className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-medium text-red-600 text-center">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}"""

content = content.replace(old_bottom_nav, new_bottom_nav)

with open('frontend/src/pages/Profile/Shared/DashboardLayout.jsx', 'w') as f:
    f.write(content)
