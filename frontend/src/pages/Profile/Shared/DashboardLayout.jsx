import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useProfile } from './ProfileContext';
import SharedOverview from './SharedOverview';
import SharedMembers from './SharedMembers';
import SharedProfile from './SharedProfile';
import SharedMyClubs from './SharedMyClubs';
import AvailableForms from './AvailableForms';
import MyForms from '@/pages/Forms/MyForms';
import Dashboard from '@/pages/response/Dashboard';
import ManageIqacEvents from './ManageIqacEvents';
import AdminCalendar from '../SuperAdmin/AdminCalendar';
import { LayoutDashboard, Users, LogOut, Menu, FileText, X, ChevronRight, Building, ClipboardList, FileBarChart, CalendarDays, SquareChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SharedDashboardLayout({ children }) {
    const { activeTab, setActiveTab, profile, role, activeClub } = useProfile();
    const { logout, user, authLoading } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile
    const isStandalonePage = Boolean(children);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);


    React.useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('no-custom-cursor');
        return () => {
            document.documentElement.classList.add('dark');
            document.body.classList.remove('no-custom-cursor');
        };
    }, []);

    const handleLogout = async () => {
        setIsSidebarOpen(false);
        const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        try {
            if (role === 'Admin') {
                await axios.post(`${API}/api/admin/logout`, {}, { withCredentials: true });
            }
        } catch (_) {
        } finally {
            await logout();
            toast.success('Signed out successfully! 👋');
            navigate('/', { replace: true });
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'members', label: 'Team Members', icon: Users },
        { id: 'my-clubs', label: 'My Clubs', icon: Building },
        { id: 'profile', label: 'Profile', icon: Users },
        { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    ];

    const getVisibleTabs = () => {
        if (role === 'Applicant') {
            return tabs.filter(t => t.id === 'my-clubs' || t.id === 'calendar');
        }
        if (role === 'Admin') {
            return tabs.filter(t => t.id !== 'profile' && t.id !== 'my-clubs');
        }
        if (role === 'Member') {
            return tabs.filter(t => ['overview', 'my-clubs', 'calendar'].includes(t.id));
        }
        return tabs.filter(t => t.id !== 'profile');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <SharedOverview />;
            case 'members': return <SharedMembers />;
            case 'profile': return <SharedProfile />;
            case 'forms': return <AvailableForms />;
            case 'my-clubs': return <SharedMyClubs />;
            case 'calendar': return <AdminCalendar />;
            case 'manage-forms': return <MyForms />;
            case 'responses': return <Dashboard viewerRole={role === 'Admin' ? 'admin' : 'member'} isEmbedded={true} />;
            case 'iqac-events': return <ManageIqacEvents />;
            default: return role === 'Admin' ? <SharedOverview /> : <SharedMyClubs />;
        }
    };

    // Guard: while auth is being verified on reload, show a spinner
    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="text-sm text-gray-500">Loading dashboard…</p>
                </div>
            </div>
        );
    }

    if (!user && role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-screen bg-[#f9fafb] text-slate-900 font-sans antialiased selection:bg-blue-600/20" style={{ backgroundImage: "url('/background.svg')", backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            {/* OLD UI IMPLEMENTATION PRESERVED:
            className="flex min-h-screen bg-gray-50 text-gray-900 font-mono..."
            style={{ backgroundImage: "url('/back.svg')", ... fontFamily: "'JetBrains Mono'..." }}
            */}
            {/* 
            ========================================================================
            OLD IMPLEMENTATION PRESERVED (COMMENTED OUT)
            ========================================================================
            */}
            {/*
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
                (isSidebarOpen || !isDesktopCollapsed) ? "translate-x-0" : "-translate-x-full"
            )}>
               ... [old code hidden] ...
            </aside>
            */}

            {/* Desktop Sidebar (Expanded & Collapsed) */}
            <aside className={cn(
                'hidden md:flex flex-col fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out',
                isDesktopCollapsed ? 'w-20' : 'w-64'
            )}>
                <div className="flex flex-col h-full p-3">
                    <div className={cn("flex items-center mb-8", isDesktopCollapsed ? "justify-center" : "justify-between px-1")}>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0">
                                <SquareChevronRight className="h-7 w-7 text-blue-600" />
                                <span className="font-bold text-slate-900 text-sm hidden">{role?.[0]}</span>
                            </div>
                            {!isDesktopCollapsed && (
                                <div>
                                    <h1 className="font-extrabold text-lg tracking-tight text-slate-900 leading-tight">NEXUS</h1>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{role} Panel</p>
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

                    {!isDesktopCollapsed && profile?.clubs?.length > 1 && (
                        <div className="mb-6 px-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Active Club</label>
                            <select 
                                value={activeClub?.id || activeClub?._id || ''}
                                onChange={(e) => switchClub(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-[13px] font-medium rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 block p-2 transition-all hover:border-slate-300 outline-none"
                            >
                                {profile.clubs.map(c => (
                                    <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {!isDesktopCollapsed && profile?.clubs?.length === 1 && (
                        <div className="mb-6 px-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Active Club</label>
                            <div className="text-sm font-medium text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-sm">
                                {profile.clubs[0].name}
                            </div>
                        </div>
                    )}

                    <nav className="flex-1 space-y-1">
                        {!isDesktopCollapsed && <div className="px-3 mt-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workspace</div>}
                        {isDesktopCollapsed && <div className="h-[1px] w-8 mx-auto bg-slate-100 my-4" />}
                        {getVisibleTabs().map(tab => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    title={isDesktopCollapsed ? tab.label : undefined}
                                    onClick={() => {
                                        if (isStandalonePage) {
                                            navigate(`/profile/${role}`, { state: { activeTab: tab.id } });
                                        } else {
                                            setActiveTab(tab.id);
                                        }
                                    }}
                                    className={cn(
                                        'w-full flex items-center rounded-lg font-medium transition-all duration-200 group relative',
                                        isDesktopCollapsed ? 'justify-center p-3 my-1' : 'gap-3 px-3 py-2.5',
                                        (!isStandalonePage && isActive)
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    )}
                                >
                                    {!isStandalonePage && isActive && <div className={cn("absolute bg-blue-600 rounded-r-md transition-all duration-300", isDesktopCollapsed ? "left-0 top-2 bottom-2 w-[3px]" : "left-0 top-1.5 bottom-1.5 w-[3px]")} />}
                                    <tab.icon className={cn('shrink-0 transition-colors', isDesktopCollapsed ? 'h-5 w-5' : 'h-[18px] w-[18px]', !isStandalonePage && isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600')} />
                                    {!isDesktopCollapsed && <span className="text-[13px]">{tab.label}</span>}
                                    {isDesktopCollapsed && (
                                        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                            {tab.label}
                                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}

                        {/* Admin Exclusive Links */}
                        {role === 'Admin' && (
                            <>
                                {!isDesktopCollapsed && <div className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operations</div>}
                                {isDesktopCollapsed && <div className="h-[1px] w-8 mx-auto bg-slate-100 my-4" />}
                                {[
                                    { id: 'manage-forms', label: 'Manage Forms', icon: FileText },
                                    { id: 'responses', label: 'Responses', icon: ClipboardList }
                                ].map(tab => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            title={isDesktopCollapsed ? tab.label : undefined}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                'w-full flex items-center rounded-lg font-medium transition-all duration-200 group relative',
                                                isDesktopCollapsed ? 'justify-center p-3 my-1' : 'gap-3 px-3 py-2.5',
                                                isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
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
                                    );
                                })}

                                {!isDesktopCollapsed && <div className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reporting</div>}
                                {isDesktopCollapsed && <div className="h-[1px] w-8 mx-auto bg-slate-100 my-4" />}
                                <button
                                    title={isDesktopCollapsed ? 'IQAC Reports' : undefined}
                                    onClick={() => setActiveTab('iqac-events')}
                                    className={cn(
                                        'w-full flex items-center rounded-lg font-medium transition-all duration-200 group relative',
                                        isDesktopCollapsed ? 'justify-center p-3 my-1' : 'gap-3 px-3 py-2.5',
                                        activeTab === 'iqac-events' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    )}
                                >
                                    {activeTab === 'iqac-events' && <div className={cn("absolute bg-blue-600 rounded-r-md transition-all duration-300", isDesktopCollapsed ? "left-0 top-2 bottom-2 w-[3px]" : "left-0 top-1.5 bottom-1.5 w-[3px]")} />}
                                    <FileBarChart className={cn('shrink-0 transition-colors', isDesktopCollapsed ? 'h-5 w-5' : 'h-[18px] w-[18px]', activeTab === 'iqac-events' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600')} />
                                    {!isDesktopCollapsed && <span className="text-[13px]">IQAC Reports</span>}
                                    {isDesktopCollapsed && (
                                        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                            IQAC Reports
                                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                                        </div>
                                    )}
                                </button>
                            </>
                        )}

                        {role === 'Member' && profile?.year !== 'FE' && (
                            <>
                                {!isDesktopCollapsed && <div className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operations</div>}
                                {isDesktopCollapsed && <div className="h-[1px] w-8 mx-auto bg-slate-100 my-4" />}
                                {[
                                    { id: 'manage-forms', label: 'Manage Forms', icon: FileText },
                                    { id: 'responses', label: 'Responses', icon: ClipboardList }
                                ].map(tab => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            title={isDesktopCollapsed ? tab.label : undefined}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                'w-full flex items-center rounded-lg font-medium transition-all duration-200 group relative',
                                                isDesktopCollapsed ? 'justify-center p-3 my-1' : 'gap-3 px-3 py-2.5',
                                                isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
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
                                    );
                                })}
                            </>
                        )}

                        {role === 'Applicant' && (
                            <>
                                {!isDesktopCollapsed && <div className="px-3 mt-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applications</div>}
                                {isDesktopCollapsed && <div className="h-[1px] w-8 mx-auto bg-slate-100 my-4" />}
                                <button
                                    title={isDesktopCollapsed ? 'Forms' : undefined}
                                    onClick={() => {
                                        if (isStandalonePage) navigate(`/profile/${role}`, { state: { activeTab: 'forms' } });
                                        else setActiveTab('forms');
                                    }}
                                    className={cn(
                                        'w-full flex items-center rounded-lg font-medium transition-all duration-200 group relative',
                                        isDesktopCollapsed ? 'justify-center p-3 my-1' : 'gap-3 px-3 py-2.5',
                                        activeTab === 'forms' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    )}
                                >
                                    {activeTab === 'forms' && <div className={cn("absolute bg-blue-600 rounded-r-md transition-all duration-300", isDesktopCollapsed ? "left-0 top-2 bottom-2 w-[3px]" : "left-0 top-1.5 bottom-1.5 w-[3px]")} />}
                                    <FileText className={cn('shrink-0 transition-colors', isDesktopCollapsed ? 'h-5 w-5' : 'h-[18px] w-[18px]', activeTab === 'forms' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600')} />
                                    {!isDesktopCollapsed && <span className="text-[13px]">Forms</span>}
                                    {isDesktopCollapsed && (
                                        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                            Forms
                                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                                        </div>
                                    )}
                                </button>
                            </>
                        )}
                    </nav>

                    <div className="pt-4 border-t border-slate-100 mt-auto space-y-2">
                        {!isDesktopCollapsed ? (
                            <>
                                <div
                                    className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
                                    onClick={() => {
                                        if (isStandalonePage) navigate(`/profile/${role}`, { state: { activeTab: 'profile' } });
                                        else setActiveTab('profile');
                                    }}
                                >
                                    <img src={profile?.avatar || "/clubprofiles/ns.png"} alt="Profile" className="h-8 w-8 rounded-full border border-slate-200 bg-white object-cover shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold truncate text-slate-900">{user?.name}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
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
                                <div
                                    className="h-8 w-8 rounded-full border border-slate-200 bg-white flex items-center justify-center shrink-0 cursor-pointer overflow-hidden relative group"
                                    onClick={() => {
                                        if (isStandalonePage) navigate(`/profile/${role}`, { state: { activeTab: 'profile' } });
                                        else setActiveTab('profile');
                                    }}
                                >
                                    <img src={profile?.avatar || "/clubprofiles/ns.png"} alt="Profile" className="h-full w-full object-cover" />
                                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                        Profile
                                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
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
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 z-[60] shadow-[0_-4px_24px_rgba(0,0,0,0.04)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <nav className="flex items-center justify-around px-2 h-16">
                    {(() => {
                        let bottomTabs = [];
                        if (role === 'Admin') bottomTabs = [{id:'overview',label:'Overview',icon:LayoutDashboard},{id:'members',label:'Members',icon:Users},{id:'manage-forms',label:'Forms',icon:FileText},{id:'responses',label:'Responses',icon:ClipboardList}];
                        else if (role === 'Member' && profile?.year !== 'FE') bottomTabs = [{id:'overview',label:'Overview',icon:LayoutDashboard},{id:'manage-forms',label:'Forms',icon:FileText},{id:'responses',label:'Responses',icon:ClipboardList},{id:'calendar',label:'Calendar',icon:CalendarDays}];
                        else if (role === 'Member') bottomTabs = [{id:'overview',label:'Overview',icon:LayoutDashboard},{id:'calendar',label:'Calendar',icon:CalendarDays}];
                        else if (role === 'Applicant') bottomTabs = [{id:'forms',label:'Forms',icon:FileText},{id:'calendar',label:'Calendar',icon:CalendarDays}];
                        
                        return bottomTabs.map(tab => {
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
                                    <span className={cn("text-[10px] font-medium tracking-tight", isActive ? "font-bold" : "")}>{tab.label}</span>
                                </button>
                            );
                        });
                    })()}
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
                            {(() => {
                                let moreTabs = [];
                                if (role === 'Admin') moreTabs = [{id:'calendar',label:'Calendar',icon:CalendarDays},{id:'iqac-events',label:'Reports',icon:FileBarChart},{id:'profile',label:'Profile',icon:Users}];
                                else if (role === 'Member') moreTabs = [{id:'my-clubs',label:'My Clubs',icon:Building},{id:'profile',label:'Profile',icon:Users}];
                                else if (role === 'Applicant') moreTabs = [{id:'my-clubs',label:'My Clubs',icon:Building},{id:'profile',label:'Profile',icon:Users}];

                                return moreTabs.map(tab => (
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
                                ));
                            })()}
                            
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
            )}

            <main className={cn(
                "flex-1 flex flex-col min-w-0 bg-transparent relative transition-all duration-300 pb-20 md:pb-0",
                !isDesktopCollapsed ? "md:ml-64" : "md:ml-20"
            )}>
                {/* NEW ENTERPRISE CONTEXT BAR */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
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
                            <div className="flex items-center gap-2 text-[14px]">
                                <span className="font-extrabold text-slate-900 tracking-tight hidden sm:inline">NEXUS</span>
                                <span className="text-slate-300 hidden sm:inline">/</span>
                                <span className="text-blue-600 font-bold hidden sm:inline">AIT Pune</span>
                                <span className="text-slate-300 hidden sm:inline">/</span>
                                <span className="text-slate-900 font-bold">
                                    {tabs.find(t => t.id === activeTab)?.label || 
                                     (activeTab === 'manage-forms' ? 'Manage Forms' : 
                                     activeTab === 'responses' ? 'Responses' : 
                                     activeTab === 'iqac-events' ? 'IQAC Reports' : 
                                     activeTab === 'forms' ? 'Forms' : 'Dashboard')}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-1.5 opacity-50" title="Built by GDG AIT Pune">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-sm"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm"></div>
                        </div>
                    </div>
                </header>

                <div className={`flex-1 overflow-y-auto ${!isStandalonePage && activeTab !== 'responses' ? (activeTab === 'overview' ? 'p-4 md:px-8' : 'p-4 md:p-8') : ''}`}>
                    <div className={`${!isStandalonePage && activeTab !== 'responses' ? (`max-w-6xl mx-auto w-full ${activeTab === 'overview' ? 'space-y-4 pb-2' : 'space-y-8 pb-12'}`) : activeTab === 'responses' ? 'flex flex-col h-full' : 'flex flex-col h-full'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                        {children ?? renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}
