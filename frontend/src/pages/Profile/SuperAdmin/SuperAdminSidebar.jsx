import React from 'react';
import { LayoutDashboard, Building2, FileBarChart, LogOut, Menu, X, ChevronRight, ShieldCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_LABEL = { director: 'Director', principal: 'Principal', jd: 'Joint Director', maintainer: 'Maintainer' };

const SUPERADMIN_TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'clubs', label: 'Manage Clubs', icon: Building2 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'reports', label: 'Generate Report', icon: FileBarChart },
];

export default function SuperAdminSidebar({
    admin,
    activeTab,
    onTabSelect,
    isSidebarOpen,
    setIsSidebarOpen,
    isDesktopCollapsed,
    setIsDesktopCollapsed,
    onLogout,
}) {
    const roleLabel = ROLE_LABEL[admin?.role] || 'SuperAdmin';
    const visibleTabs = admin?.role === 'maintainer' ? SUPERADMIN_TABS.filter(t => t.id === 'clubs') : SUPERADMIN_TABS;

    return (
        <>
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            <aside className={cn(
                'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)]',
                (isSidebarOpen || !isDesktopCollapsed) ? 'translate-x-0' : '-translate-x-full'
            )}>
                <div className="flex flex-col h-full p-3">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-md bg-slate-900 flex items-center justify-center shadow-sm">
                                <ShieldCheck className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg tracking-tight text-gray-900">SuperAdmin</h1>
                                <p className="text-[11px] text-gray-500 uppercase tracking-wider">{roleLabel}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setIsDesktopCollapsed(true); setIsSidebarOpen(false); }}
                            className="flex p-1.5 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors"
                            title="Close Sidebar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {visibleTabs.map((tab) => (
                            <React.Fragment key={tab.id}>
                                {tab.id === 'overview' && <div className="px-3 mt-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workspace</div>}
                                {tab.id === 'clubs' && <div className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization</div>}
                                {tab.id === 'reports' && <div className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reporting</div>}
                                <button
                                    onClick={() => { onTabSelect(tab.id); setIsSidebarOpen(false); }}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors group relative',
                                        activeTab === tab.id
                                            ? 'bg-blue-50/80 text-blue-700'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                                    )}
                                >
                                    {activeTab === tab.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] bg-blue-600 rounded-r-md" />}
                                    <tab.icon className={cn('h-5 w-5 transition-colors', activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600')} />
                                    {tab.label}
                                </button>
                            </React.Fragment>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-gray-200 mt-auto space-y-4">
                        <div className="flex items-center gap-2 px-1 p-2">
                            <div className="h-9 w-9 rounded-full border border-gray-200 bg-slate-900 flex items-center justify-center shrink-0">
                                <span className="text-white text-sm font-bold">{roleLabel[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-slate-900">{roleLabel}</p>
                                <p className="text-xs text-slate-500 break-all">{admin?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                        <div className="pt-2 text-center text-[10px] text-slate-400/70 font-medium uppercase tracking-wider">
                            Built by GDG AIT Pune
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export function SuperAdminContextHeader({ isDesktopCollapsed, setIsDesktopCollapsed, setIsSidebarOpen, activeTabLabel }) {
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
                {isDesktopCollapsed && (
                    <button
                        onClick={() => setIsDesktopCollapsed(false)}
                        className="hidden md:flex p-1.5 -ml-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
                        title="Expand Sidebar"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
                <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1.5 -ml-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors">
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 text-[13px]">
                    <span className="font-semibold text-slate-900 tracking-tight">NEXUS</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-600 font-medium hidden sm:inline">SuperAdmin</span>
                    <span className="text-slate-400 hidden sm:inline">/</span>
                    <span className="text-slate-900 font-medium">{activeTabLabel || 'Overview'}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 opacity-50" title="Built by GDG AIT Pune">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                </div>
            </div>
        </header>
    );
}
