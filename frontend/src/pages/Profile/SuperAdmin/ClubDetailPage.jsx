import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Building2, Users, GraduationCap, UserCog, Search, Loader2, FileBarChart, Download } from 'lucide-react';
import { generateIqacPdf } from './generateIqacPdf';
import useSuperAdminAccess from '@/hooks/useSuperAdminAccess';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { useAuth } from '@/context/AuthContext';
import SuperAdminSidebar, { SuperAdminContextHeader } from './SuperAdminSidebar';
import UserDetailsModal from './UserDetailsModal';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const MEMBERS_PAGE_SIZE = 20;

export default function ClubDetailPage() {
    const { status, admin } = useSuperAdminAccess();
    const { slug } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [club, setClub] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(MEMBERS_PAGE_SIZE);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const [iqacData, setIqacData] = useState(null);
    const [iqacLoading, setIqacLoading] = useState(false);
    const [pdfGenerating, setPdfGenerating] = useState(false);

    const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
    const [isAddSecretaryOpen, setIsAddSecretaryOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [isSubmittingRole, setIsSubmittingRole] = useState(false);

    const scrollSentinelRef = useRef(null);

    // Match the light theme + no custom cursor of the shared dashboard
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('no-custom-cursor');
        return () => {
            document.documentElement.classList.add('dark');
            document.body.classList.remove('no-custom-cursor');
        };
    }, []);

    const handleLogout = async () => {
        setIsSidebarOpen(false);
        try {
            await axios.post(`${API}/api/admin/logout`, {}, { withCredentials: true });
        } catch {
            /* ignore */
        } finally {
            await logout();
            toast.success('Signed out successfully! 👋');
            navigate('/', { replace: true });
        }
    };

    const handleTabSelect = (tabId) => {
        navigate('/profile/SuperAdmin', { state: { activeTab: tabId } });
    };

    useEffect(() => {
        if (status !== 'ok') return;

        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API}/api/superadmin/club-detail`, {
                    params: { slug },
                    withCredentials: true,
                });
                if (res.data?.success) {
                    setClub(res.data.club);
                    setMembers(res.data.members || []);
                } else {
                    setError(res.data?.message || 'Failed to load club');
                }
            } catch (err) {
                const message = err.response?.data?.message || err.message || 'Failed to load club';
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [slug, status]);

    // Fetch IQAC data when club loads
    useEffect(() => {
        if (status !== 'ok' || !slug) return;
        const fetchIqac = async () => {
            setIqacLoading(true);
            try {
                const res = await axios.get(`${API}/api/superadmin/club-iqac-data`, {
                    params: { slug },
                    withCredentials: true,
                });
                if (res.data?.success) {
                    setIqacData(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch IQAC data', err);
            } finally {
                setIqacLoading(false);
            }
        };
        fetchIqac();
    }, [slug, status]);

    const handleAddFaculty = async (e) => {
        e.preventDefault();
        if (!newName.trim() || !newEmail.trim()) return toast.error('Name and Email are required');
        
        setIsSubmittingRole(true);
        try {
            const res = await axios.post(`${API}/api/superadmin/add-faculty`, {
                name: newName.trim(),
                facultyEmail: newEmail.trim(),
                club: club.name
            }, { withCredentials: true });
            
            if (res.data?.success) {
                toast.success('Faculty added successfully! 🎉');
                setIsAddFacultyOpen(false);
                setNewName('');
                setNewEmail('');
                // refresh club details (simple way: fetch again, or append to club.faculty)
                setClub({ ...club, faculty: [...(club.faculty || []), { name: newName.trim(), email: newEmail.trim() }] });
            } else {
                toast.error(res.data?.message || 'Failed to add faculty');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Failed to add faculty');
        } finally {
            setIsSubmittingRole(false);
        }
    };

    const handleAddSecretary = async (e) => {
        e.preventDefault();
        if (!newName.trim() || !newEmail.trim()) return toast.error('Name and Email are required');
        
        setIsSubmittingRole(true);
        try {
            const res = await axios.post(`${API}/api/admin/add-secretary`, {
                secretaryName: newName.trim(),
                secretaryEmail: newEmail.trim(),
                club: club.name
            }, { withCredentials: true });
            
            if (res.data?.success) {
                toast.success('Secretary added successfully! 🎉');
                setIsAddSecretaryOpen(false);
                setNewName('');
                setNewEmail('');
                // refresh club details
                setClub({ ...club, secretaries: [...(club.secretaries || []), { name: newName.trim(), email: newEmail.trim() }] });
            } else {
                toast.error(res.data?.message || 'Failed to add secretary');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Failed to add secretary');
        } finally {
            setIsSubmittingRole(false);
        }
    };

    const handleRemoveFaculty = async (facultyEmail) => {
        if (!confirm('Are you sure you want to remove this faculty?')) return;
        try {
            const res = await axios.delete(`${API}/api/superadmin/remove-faculty`, {
                data: { facultyEmail, club: club.name },
                withCredentials: true
            });
            if (res.data?.success) {
                toast.success('Faculty removed');
                setClub({ ...club, faculty: (club.faculty || []).filter(f => f.email !== facultyEmail) });
            } else {
                toast.error(res.data?.message || 'Failed to remove faculty');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Error removing faculty');
        }
    };

    const handleRemoveSecretary = async (secretaryEmail) => {
        if (!confirm('Are you sure you want to remove this secretary?')) return;
        try {
            const res = await axios.delete(`${API}/api/admin/remove-secretary`, {
                data: { secretaryEmail, club: club.name },
                withCredentials: true
            });
            if (res.data?.success) {
                toast.success('Secretary removed');
                setClub({ ...club, secretaries: (club.secretaries || []).filter(s => s.email !== secretaryEmail) });
            } else {
                toast.error(res.data?.message || 'Failed to remove secretary');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Error removing secretary');
        }
    };

    const handleDownloadIqacPdf = async () => {
        if (!iqacData) return;
        setPdfGenerating(true);
        try {
            await generateIqacPdf({
                clubName: iqacData.clubName,
                clubBudget: iqacData.clubBudget,
                vision: iqacData.vision,
                mission: iqacData.mission,
                faculty: iqacData.faculty,
                secretaries: iqacData.secretaries,
                events: iqacData.events,
            });
            toast.success('IQAC Report PDF downloaded!');
        } catch (err) {
            toast.error('Failed to generate IQAC PDF');
            console.error(err);
        } finally {
            setPdfGenerating(false);
        }
    };

    const debouncedSearch = useDebouncedValue(search, 1000);

    const years = useMemo(() => {
        const set = new Set(members.map((m) => m.year).filter(Boolean));
        return Array.from(set).sort();
    }, [members]);

    const filteredMembers = useMemo(() => {
        const q = debouncedSearch.trim().toLowerCase();
        return members.filter((m) => {
            const matchesYear = yearFilter === 'all' || m.year === yearFilter;
            if (!matchesYear) return false;
            if (!q) return true;
            const name = (m.name || '').toLowerCase();
            const regnNo = String(m.regnNo ?? '').toLowerCase();
            return name.includes(q) || regnNo.includes(q);
        });
    }, [members, debouncedSearch, yearFilter]);

    // Reset the infinite-scroll window whenever the search/filter narrows the result set,
    // otherwise the page could be stuck showing a stale slice or scrolled past the new (shorter) list.
    useEffect(() => {
        setVisibleCount(MEMBERS_PAGE_SIZE);
    }, [debouncedSearch, yearFilter]);

    const visibleMembers = useMemo(
        () => filteredMembers.slice(0, visibleCount),
        [filteredMembers, visibleCount]
    );
    const hasMore = visibleCount < filteredMembers.length;

    useEffect(() => {
        const sentinel = scrollSentinelRef.current;
        if (!sentinel || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisibleCount((c) => Math.min(c + MEMBERS_PAGE_SIZE, filteredMembers.length));
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, filteredMembers.length]);

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            </div>
        );
    }

    if (status === 'denied') {
        return <Navigate to="/get-started" replace />;
    }

    return (
        <div
            className="flex min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-gdg-blue/100/30"
            style={{
                backgroundImage: "url('/background.svg')",
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
            }}
        >
            <SuperAdminSidebar
                admin={admin}
                activeTab="clubs"
                onTabSelect={handleTabSelect}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isDesktopCollapsed={isDesktopCollapsed}
                setIsDesktopCollapsed={setIsDesktopCollapsed}
                onLogout={handleLogout}
            />

            <main className={`flex-1 flex flex-col min-w-0 bg-transparent relative transition-all duration-300 ${!isDesktopCollapsed ? 'md:ml-64' : 'md:ml-20'} pb-20 md:pb-0`}>
                <SuperAdminContextHeader 
                    isDesktopCollapsed={isDesktopCollapsed} 
                    setIsDesktopCollapsed={setIsDesktopCollapsed} 
                    setIsSidebarOpen={setIsSidebarOpen}
                    activeTabLabel={club?.name || 'Club Details'}
                />

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                    onClick={() => navigate('/profile/SuperAdmin', { state: { activeTab: 'clubs' } })}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Manage Clubs
                </button>

                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-3" />
                        <p className="text-sm">Loading club...</p>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
                ) : (
                    <>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-6">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                    {club.clubLogo ? (
                                        <img src={club.clubLogo} alt={club.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <Building2 className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-2xl font-extrabold text-gray-900 truncate">{club.name}</h1>
                                    <p className="text-xs text-gray-500 mt-1">{club.strength} member{club.strength === 1 ? '' : 's'}</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                                        <Users className="h-4 w-4" />
                                        <span className="text-[11px] font-semibold uppercase tracking-widest">Strength</span>
                                    </div>
                                    <p className="text-lg font-extrabold text-gray-900">{club.strength}</p>
                                </div>
                                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <GraduationCap className="h-4 w-4" />
                                            <span className="text-[11px] font-semibold uppercase tracking-widest">Faculty</span>
                                        </div>
                                        {admin?.role === 'maintainer' && (
                                            <button 
                                                onClick={() => setIsAddFacultyOpen(true)}
                                                className="text-[10px] bg-blue-100 text-gdg-blue hover:bg-blue-200 px-2 py-0.5 rounded transition-colors font-medium"
                                            >
                                                + ADD
                                            </button>
                                        )}
                                    </div>
                                    {club.faculty?.length ? (
                                        <ul className="space-y-1">
                                            {club.faculty.map((f) => (
                                                <li key={f.email} className="flex items-center justify-between group">
                                                    <span className="text-sm text-gray-800 truncate pr-2">{f.name}</span>
                                                    {admin?.role === 'maintainer' && (
                                                        <button 
                                                            onClick={() => handleRemoveFaculty(f.email)}
                                                            className="text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-sm text-gray-400">None assigned</p>}
                                </div>
                                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <UserCog className="h-4 w-4" />
                                            <span className="text-[11px] font-semibold uppercase tracking-widest">Secretaries</span>
                                        </div>
                                        {admin?.role === 'maintainer' && (
                                            <button 
                                                onClick={() => setIsAddSecretaryOpen(true)}
                                                className="text-[10px] bg-blue-100 text-gdg-blue hover:bg-blue-200 px-2 py-0.5 rounded transition-colors font-medium"
                                            >
                                                + ADD
                                            </button>
                                        )}
                                    </div>
                                    {club.secretaries?.length ? (
                                        <ul className="space-y-1">
                                            {club.secretaries.map((s) => (
                                                <li key={s.email} className="flex items-center justify-between group">
                                                    <span className="text-sm text-gray-800 truncate pr-2">{s.name}</span>
                                                    {admin?.role === 'maintainer' && (
                                                        <button 
                                                            onClick={() => handleRemoveSecretary(s.email)}
                                                            className="text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-sm text-gray-400">None assigned</p>}
                                </div>
                            </div>
                        </div>

                        {/* ── Club's IQAC Reports ───────────────────── */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-6">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gdg-blue/10 flex items-center justify-center">
                                        <FileBarChart className="h-5 w-5 text-gdg-blue" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">Club's IQAC Reports</h2>
                                        <p className="text-xs text-gray-500">Events recorded by this club for IQAC reporting</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDownloadIqacPdf}
                                    disabled={pdfGenerating || iqacLoading || !iqacData?.events?.length}
                                    className="inline-flex items-center gap-2 rounded-lg bg-gdg-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-[#3367d6] disabled:opacity-50 transition-colors"
                                >
                                    {pdfGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                    Download IQAC PDF
                                </button>
                            </div>

                            {iqacLoading ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                                    <p className="text-sm">Loading IQAC events...</p>
                                </div>
                            ) : iqacData?.events?.length ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                                <th className="py-2 pr-4 w-10">#</th>
                                                <th className="py-2 pr-4">Title</th>
                                                <th className="py-2 pr-4">Academic Year</th>
                                                <th className="py-2 pr-4">Type</th>
                                                <th className="py-2 pr-4">Date Range</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {iqacData.events.map((evt, i) => (
                                                <tr key={evt._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                                    <td className="py-2.5 pr-4 text-gray-500 font-medium">{i + 1}</td>
                                                    <td className="py-2.5 pr-4 font-medium text-gray-900">{evt.title}</td>
                                                    <td className="py-2.5 pr-4 text-gray-600">{evt.academicYear || '—'}</td>
                                                    <td className="py-2.5 pr-4 text-gray-600">{evt.eventType || '—'}</td>
                                                    <td className="py-2.5 pr-4 text-gray-600">
                                                        {evt.startDate !== 'Nil' ? evt.startDate : '—'}
                                                        {evt.endDate !== 'Nil' ? ` → ${evt.endDate}` : ''}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="text-right text-xs text-gray-400 mt-3">
                                        {iqacData.events.length} event{iqacData.events.length === 1 ? '' : 's'} · Budget: ₹{Number(iqacData.clubBudget || 0).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-300 rounded-xl bg-gray-50">
                                    No IQAC events recorded for this club yet.
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                <h2 className="text-lg font-bold text-gray-900">Members</h2>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search name or regn. no."
                                            style={{ colorScheme: "light" }}
                                            className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 caret-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gdg-blue focus:border-gdg-blue w-56"
                                        />
                                    </div>
                                    <select
                                        value={yearFilter}
                                        onChange={(e) => setYearFilter(e.target.value)}
                                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gdg-blue focus:border-gdg-blue"
                                    >
                                        <option value="all">All years</option>
                                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            {filteredMembers.length ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                                    <th className="py-2 pr-4">Name</th>
                                                    <th className="py-2 pr-4">Regn. No.</th>
                                                    <th className="py-2 pr-4">Year</th>
                                                    <th className="py-2 pr-4">Branch</th>
                                                    <th className="py-2 pr-4">Role</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visibleMembers.map((m) => (
                                                    <tr
                                                        key={m._id}
                                                        onClick={() => setSelectedMember(m)}
                                                        className="border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="py-2.5 pr-4 font-medium text-gray-900">{m.name}</td>
                                                        <td className="py-2.5 pr-4 text-gray-600">{m.regnNo ?? '—'}</td>
                                                        <td className="py-2.5 pr-4 text-gray-600">{m.year || '—'}</td>
                                                        <td className="py-2.5 pr-4 text-gray-600">{m.branch || '—'}</td>
                                                        <td className="py-2.5 pr-4 text-gray-600">{m.role || '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {hasMore && (
                                        <div ref={scrollSentinelRef} className="flex items-center justify-center py-4 text-gray-400 text-xs gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" /> Loading more members...
                                        </div>
                                    )}
                                    <p className="text-center text-[11px] text-gray-400 mt-2">
                                        Showing {visibleMembers.length} of {filteredMembers.length} member{filteredMembers.length === 1 ? '' : 's'}
                                    </p>
                                </>
                            ) : (
                                <div className="text-center py-12 text-gray-400 text-sm">No members match your search.</div>
                            )}
                        </div>
                    </>
                )}
                </div>
                </div>
            </main>

            {selectedMember && (
                <UserDetailsModal
                    isOpen={!!selectedMember}
                    onClose={() => setSelectedMember(null)}
                    user={selectedMember}
                />
            )}

            {/* Modals for adding Faculty / Secretary */}
            {(isAddFacultyOpen || isAddSecretaryOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {isAddFacultyOpen ? 'Add Faculty' : 'Add Secretary'}
                        </h3>
                        <form onSubmit={isAddFacultyOpen ? handleAddFaculty : handleAddSecretary} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gdg-blue text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gdg-blue text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        isAddFacultyOpen ? setIsAddFacultyOpen(false) : setIsAddSecretaryOpen(false);
                                        setNewName('');
                                        setNewEmail('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingRole}
                                    className="px-4 py-2 bg-gdg-blue text-white rounded-lg text-sm font-medium hover:bg-[#3367d6] disabled:opacity-50 transition-colors"
                                >
                                    {isSubmittingRole ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
