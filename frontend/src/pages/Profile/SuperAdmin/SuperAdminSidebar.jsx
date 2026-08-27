import React from 'react';
import { LayoutDashboard, Building2, FileBarChart, LogOut, Menu, X, ChevronRight, ShieldCheck, Users, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_LABEL = { director: 'Director', principal: 'Principal', jd: 'Joint Director', maintainer: 'Maintainer' };

const SUPERADMIN_TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'clubs', label: 'Manage Clubs', icon: Building2 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'reports', label: 'Generate Report', icon: FileBarChart },
];

/* 
========================================================================
OLD IMPLEMENTATION PRESERVED (COMMENTED OUT)
========================================================================

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
*/

// ========================================================================
// NEW PREMIUM IMPLEMENTATION
// ========================================================================

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
            {/* Desktop Sidebar (Expanded & Collapsed) */}
            <aside className={cn(
                'hidden md:flex flex-col fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out',
                isDesktopCollapsed ? 'w-20' : 'w-64'
            )}>
                <div className="flex flex-col h-full p-3">
                    <div className={cn("flex items-center mb-8", isDesktopCollapsed ? "justify-center" : "justify-between px-1")}>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                                <img src="/nexus.svg" alt="NEXUS" className="h-7 w-7 object-contain" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                <ShieldCheck className="h-5 w-5 text-blue-600 hidden" />
                            </div>
                            {!isDesktopCollapsed && (
                                <div>
                                    <h1 className="font-extrabold text-lg tracking-tight text-slate-900 leading-tight">NEXUS</h1>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{roleLabel}</p>
                                </div>
                            )}
                        </div>
                        {!isDesktopCollapsed && (
                            <button
                                onClick={() => setIsDesktopCollapsed(true)}
                                className="flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                                title="Collapse Sidebar"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" />
                            </button>
                        )}
                    </div>

                    <nav className="flex-1 space-y-1">
                        {visibleTabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <React.Fragment key={tab.id}>
                                    {!isDesktopCollapsed && (
                                        <>
                                            {tab.id === 'overview' && <div className="px-3 mt-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workspace</div>}
                                            {tab.id === 'clubs' && <div className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization</div>}
                                            {tab.id === 'reports' && <div className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reporting</div>}
                                        </>
                                    )}
                                    {isDesktopCollapsed && (tab.id === 'overview' || tab.id === 'clubs' || tab.id === 'reports') && (
                                        <div className="h-[1px] w-8 mx-auto bg-slate-100 my-4" />
                                    )}
                                    <button
                                        onClick={() => onTabSelect(tab.id)}
                                        title={isDesktopCollapsed ? tab.label : undefined}
                                        className={cn(
                                            'w-full flex items-center rounded-lg font-medium transition-all duration-200 group relative',
                                            isDesktopCollapsed ? 'justify-center p-3 my-1' : 'gap-3 px-3 py-2.5',
                                            isActive
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                        )}
                                    >
                                        {isActive && <div className={cn("absolute bg-blue-600 rounded-r-md transition-all duration-300", isDesktopCollapsed ? "left-0 top-2 bottom-2 w-[3px]" : "left-0 top-1.5 bottom-1.5 w-[3px]")} />}
                                        <tab.icon className={cn('shrink-0 transition-colors', isDesktopCollapsed ? 'h-5 w-5' : 'h-[18px] w-[18px]', isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600')} />
                                        {!isDesktopCollapsed && <span className="text-[13px]">{tab.label}</span>}
                                        {isDesktopCollapsed && (
                                            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                                {tab.label}
                                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                                            </div>
                                        )}
                                    </button>
                                </React.Fragment>
                            );
                        })}
                    </nav>

                    <div className="pt-4 border-t border-slate-100 mt-auto space-y-2">
                        {!isDesktopCollapsed ? (
                            <>
                                <div className="flex items-center gap-3 px-2 py-2">
                                    <div className="h-8 w-8 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center shrink-0">
                                        <img src="/nexus.svg" alt="NEXUS" className="h-4 w-4 object-contain" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                        <span className="text-slate-900 text-xs font-bold hidden">{roleLabel[0]}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold truncate text-slate-900">{roleLabel}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{admin?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                                >
                                    <LogOut className="h-4 w-4 shrink-0" /> Sign Out
                                </button>
                                <div className="pt-2 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                    Built by GDG AIT Pune
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-8 w-8 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center shrink-0 cursor-help" title={admin?.email}>
                                    <img src="/nexus.svg" alt="NEXUS" className="h-4 w-4 object-contain" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                                    <span className="text-slate-900 text-xs font-bold hidden">{roleLabel[0]}</span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    title="Sign Out"
                                    className="p-3 w-full flex justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                        Sign Out
                                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation Bar (PWA-friendly) */}
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
            </div>
        </>
    );
}

export function SuperAdminContextHeader({ isDesktopCollapsed, setIsDesktopCollapsed, activeTabLabel }) {
    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-16 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                {isDesktopCollapsed && (
                    <button
                        onClick={() => setIsDesktopCollapsed(false)}
                        className="hidden md:flex p-1.5 -ml-2 text-slate-400 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
                        title="Expand Sidebar"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}

                <div className="flex items-center gap-3">
                    <img src="/nexus.svg" alt="NEXUS" className="h-5 w-5 object-contain md:hidden" onError={(e) => { e.target.style.display = 'none'; }} />
                    <div className="flex items-center gap-2 text-[14px]">
                        <span className="font-extrabold text-slate-900 tracking-tight hidden sm:inline">NEXUS</span>
                        <span className="text-slate-300 hidden sm:inline">/</span>
                        <span className="text-blue-600 font-bold hidden sm:inline">SuperAdmin</span>
                        <span className="text-slate-300 hidden sm:inline">/</span>
                        <span className="text-slate-900 font-bold">{activeTabLabel || 'Overview'}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5" title="Built by GDG AIT Pune">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-90 shadow-sm"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-90 shadow-sm hidden sm:block"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-90 shadow-sm hidden sm:block"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-90 shadow-sm hidden sm:block"></div>
                </div>
            </div>
        </header>
    );
}
