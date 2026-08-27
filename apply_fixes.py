import re
import os

# --- SuperAdminSidebar.jsx ---
path_sa = 'frontend/src/pages/Profile/SuperAdmin/SuperAdminSidebar.jsx'
with open(path_sa, 'r') as f:
    content_sa = f.read()

# Add SquareChevronRight to imports
content_sa = content_sa.replace(
    "import { LayoutDashboard, Building2, FileBarChart, LogOut, Menu, X, ChevronRight, ShieldCheck, Users, MoreHorizontal } from 'lucide-react';",
    "import { LayoutDashboard, Building2, FileBarChart, LogOut, Menu, X, ChevronRight, ShieldCheck, Users, MoreHorizontal, SquareChevronRight } from 'lucide-react';"
)

# Replace logo
old_logo_expanded = """<img src="/nexus.svg" alt="NEXUS" className="h-7 w-7 object-contain" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />"""
new_logo_expanded = """<SquareChevronRight className="h-7 w-7 text-blue-600" />"""
content_sa = content_sa.replace(old_logo_expanded, new_logo_expanded)

old_logo_small = """<img src="/nexus.svg" alt="NEXUS" className="h-4 w-4 object-contain" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />"""
new_logo_small = """<SquareChevronRight className="h-5 w-5 text-blue-600" />"""
content_sa = content_sa.replace(old_logo_small, new_logo_small)

old_logo_header = """<img src="/nexus.svg" alt="NEXUS" className="h-5 w-5 object-contain md:hidden" onError={(e) => { e.target.style.display = 'none'; }} />"""
new_logo_header = """<SquareChevronRight className="h-5 w-5 text-blue-600 md:hidden" />"""
content_sa = content_sa.replace(old_logo_header, new_logo_header)

# Replace SuperAdmin mobile bottom nav to match DashboardLayout (with More menu)
old_sa_bottom_nav = """            {/* Mobile Bottom Navigation Bar (PWA-friendly) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <nav className="flex items-center justify-around px-2 h-16">
                    {visibleTabs.slice(0, 4).map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabSelect(tab.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors relative",
                                    isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-blue-600 rounded-b-md" />}
                                <tab.icon className={cn("h-5 w-5 transition-transform", isActive && "transform scale-110")} />
                                <span className={cn("text-[10px] font-medium tracking-tight", isActive ? "font-bold" : "")}>{tab.label}</span>
                            </button>
                        );
                    })}
                    <button
                        onClick={onLogout}
                        className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-500 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-[10px] font-medium tracking-tight">Sign Out</span>
                    </button>
                </nav>
            </div>"""

new_sa_bottom_nav = """            {/* Mobile Bottom Navigation Bar (PWA-friendly) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-[60] shadow-[0_-4px_24px_rgba(0,0,0,0.04)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <nav className="flex items-center justify-around px-2 h-16">
                    {visibleTabs.slice(0, 3).map((tab) => {
                        const isActive = activeTab === tab.id && !isSidebarOpen;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => { onTabSelect(tab.id); setIsSidebarOpen(false); }}
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
                            {visibleTabs.slice(3).map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { onTabSelect(tab.id); setIsSidebarOpen(false); }}
                                    className="flex flex-col items-center gap-2 p-2 rounded-xl active:bg-slate-50 transition-colors"
                                >
                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600")}>
                                        <tab.icon className="h-5 w-5" />
                                    </div>
                                    <span className={cn("text-[10px] font-medium text-center", activeTab === tab.id ? "text-blue-700 font-bold" : "text-slate-600")}>{tab.label}</span>
                                </button>
                            ))}
                            
                            <button
                                onClick={() => { setIsSidebarOpen(false); onLogout(); }}
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
content_sa = content_sa.replace(old_sa_bottom_nav, new_sa_bottom_nav)

with open(path_sa, 'w') as f:
    f.write(content_sa)

# --- DashboardLayout.jsx ---
path_dl = 'frontend/src/pages/Profile/Shared/DashboardLayout.jsx'
with open(path_dl, 'r') as f:
    content_dl = f.read()

# Add SquareChevronRight to imports
content_dl = content_dl.replace(
    "import { LayoutDashboard, Users, LogOut, Menu, FileText, X, ChevronRight, Building, ClipboardList, FileBarChart, CalendarDays } from 'lucide-react';",
    "import { LayoutDashboard, Users, LogOut, Menu, FileText, X, ChevronRight, Building, ClipboardList, FileBarChart, CalendarDays, SquareChevronRight } from 'lucide-react';"
)

content_dl = content_dl.replace(old_logo_expanded, new_logo_expanded)
content_dl = content_dl.replace(old_logo_header, new_logo_header)

with open(path_dl, 'w') as f:
    f.write(content_dl)
