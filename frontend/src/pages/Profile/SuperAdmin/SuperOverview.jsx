import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Building2, Users, FileText, ClipboardList, CalendarDays, RefreshCw, Code2, Terminal, GitBranch, FileBarChart, Download, Loader2 } from 'lucide-react';
import AdminCalendar from './AdminCalendar';
import UserSearchBar from './UserSearchBar';
import { generateIqacPdf } from './generateIqacPdf';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

export default function SuperOverview({ admin, onNavigate }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── IQAC Reports state ────────────────────────────────────────
    const [iqacClubSlug, setIqacClubSlug] = useState('');
    const [iqacLoading, setIqacLoading] = useState(false);
    const [iqacData, setIqacData] = useState(null);
    const [pdfGenerating, setPdfGenerating] = useState(false);

    const fetchDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API}/api/superadmin/dashboard`, { withCredentials: true });
            if (res.data?.success) {
                setData(res.data.data);
            } else {
                setError(res.data?.message || 'Failed to load dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const firstName = admin?.role ? admin.role.toUpperCase() : 'Admin';

    const stats = [
        { icon: Building2, label: 'Total Clubs', value: data?.totalClubs ?? 0, color: 'var(--gdg-blue)' },
        { icon: Users, label: 'Total Members', value: data?.totalMembers ?? 0, color: 'var(--gdg-green)' },
        { icon: FileText, label: 'Total Forms', value: data?.totalForms ?? 0, color: 'var(--gdg-yellow)' },
        { icon: ClipboardList, label: 'Total Responses', value: data?.totalResponses ?? 0, color: 'var(--gdg-blue)' },
        { icon: CalendarDays, label: 'Total Events', value: data?.totalEvents ?? 0, color: 'var(--gdg-yellow)' },
    ];

    const floatingIcons = [
        { icon: Code2, top: '10%', left: '-22px' },
        { icon: Terminal, bottom: '18%', left: '-18px' },
        { icon: GitBranch, top: '8%', right: '-22px' },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-20 py-12">
                <div className="flex-1 min-w-0">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                        style={{ background: '#f0f0f0', border: '1px solid #e0e0e0' }}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-semibold tracking-wide" style={{ color: '#4b5563' }}>
                            {getGreeting()}, {firstName}
                        </span>
                    </div>

                    <h1
                        style={{
                            fontSize: 'clamp(2.6rem, 6vw, 4.8rem)',
                            fontWeight: 800,
                            lineHeight: 1.02,
                            letterSpacing: '-0.02em',
                            color: '#111827',
                            marginBottom: '1.15rem',
                        }}
                    >
                        Institute<br />
                        <span style={{ color: 'var(--gdg-blue)' }}>Control Center.</span>
                    </h1>

                    <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.7, maxWidth: '440px', marginBottom: '1.5rem' }}>
                        Oversee every club, monitor institute-wide activity, and generate reports — all from a single console.
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => onNavigate?.('clubs')}
                            style={{ padding: '12px 28px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#1f2937')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#111827')}
                        >
                            Manage Clubs
                        </button>
                        <button
                            onClick={fetchDashboard}
                            disabled={loading}
                            className="inline-flex items-center gap-2"
                            style={{ padding: '12px 28px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, background: '#fff', color: '#374151', border: '1.5px solid #d1d5db', cursor: 'pointer' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                    </div>
                </div>

                <div className="relative shrink-0" style={{ width: '320px', height: '360px', marginTop: '20px' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '24px', background: 'linear-gradient(135deg, var(--gdg-blue) 0%, #1e3a8a 100%)', transform: 'rotate(4deg)', zIndex: 0 }} />
                    <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', width: '100%', height: '100%', border: '2px solid #fff', boxShadow: '0 40px 70px rgba(0,0,0,0.12)', zIndex: 1, background: '#0b1220', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="text-center px-6">
                            <div className="h-20 w-20 rounded-2xl bg-gdg-blue flex items-center justify-center mx-auto mb-5 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 flex"><div className="flex-1 bg-gdg-red"></div><div className="flex-1 bg-gdg-yellow"></div><div className="flex-1 bg-gdg-green"></div></div>
                                <Building2 className="h-10 w-10 text-white" />
                            </div>
                            <div className="text-white text-2xl font-extrabold tracking-tight">{data?.totalClubs ?? 0} Clubs</div>
                            <div className="text-blue-300 text-sm mt-1 uppercase tracking-widest">Under Management</div>
                        </div>
                    </div>
                    {floatingIcons.map(({ icon: Icon, ...pos }, i) => (
                        <div key={i} style={{ position: 'absolute', zIndex: 10, width: '40px', height: '40px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...pos }}>
                            <Icon style={{ width: '18px', height: '18px', color: 'var(--gdg-blue)' }} />
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}
            
            <UserSearchBar />

            {/* Stats bar */}
            <div style={{ marginTop: '8px', borderRadius: '16px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: '0' }}>
                {stats.map(({ icon: Icon, label, value, color }, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 150px', padding: '8px 20px', borderRight: i < stats.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon style={{ width: '18px', height: '18px', color: color || '#111827' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>{loading ? '…' : value}</div>
                            <div style={{ fontSize: '0.68rem', color: '#4b5563', marginTop: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Club's IQAC Reports ──────────────────────────── */}
            <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-gdg-blue/10 flex items-center justify-center">
                        <FileBarChart className="h-5 w-5 text-gdg-blue" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Club's IQAC Reports</h2>
                        <p className="text-xs text-gray-500">Select a club to preview and download IQAC PDF</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <select
                            value={iqacClubSlug}
                            onChange={(e) => { setIqacClubSlug(e.target.value); setIqacData(null); }}
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-gdg-blue"
                        >
                            <option value="">Select a club...</option>
                            {(data?.clubs || []).map((c) => (
                                <option key={c._id} value={c.slug}>{c.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={async () => {
                                if (!iqacClubSlug) { toast.error('Select a club first'); return; }
                                setIqacLoading(true);
                                setIqacData(null);
                                try {
                                    const res = await axios.get(`${API}/api/superadmin/club-iqac-data`, {
                                        params: { slug: iqacClubSlug },
                                        withCredentials: true,
                                    });
                                    if (res.data?.success) setIqacData(res.data);
                                    else toast.error(res.data?.message || 'Failed');
                                } catch (err) {
                                    toast.error('Failed to load IQAC data');
                                } finally {
                                    setIqacLoading(false);
                                }
                            }}
                            disabled={!iqacClubSlug || iqacLoading}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                            {iqacLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileBarChart className="h-4 w-4" />}
                            Load Events
                        </button>
                    </div>

                    {iqacData && (
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <span className="text-sm font-bold text-gray-900">{iqacData.clubName}</span>
                                    <span className="text-xs text-gray-500 ml-2">· {iqacData.events?.length || 0} event{(iqacData.events?.length || 0) === 1 ? '' : 's'} · Budget: ₹{Number(iqacData.clubBudget || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <button
                                    onClick={async () => {
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
                                            toast.success('PDF downloaded!');
                                        } catch { toast.error('PDF generation failed'); }
                                        finally { setPdfGenerating(false); }
                                    }}
                                    disabled={pdfGenerating || !iqacData.events?.length}
                                    className="inline-flex items-center gap-2 rounded-lg bg-gdg-blue px-4 py-2 text-sm font-bold text-white hover:bg-[#3367d6] disabled:opacity-50 transition-colors"
                                >
                                    {pdfGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                    Download IQAC PDF
                                </button>
                            </div>
                            {iqacData.events?.length ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                                <th className="py-2 pr-4 w-10">#</th>
                                                <th className="py-2 pr-4">Title</th>
                                                <th className="py-2 pr-4">Year</th>
                                                <th className="py-2 pr-4">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {iqacData.events.map((evt, i) => (
                                                <tr key={evt._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                    <td className="py-2 pr-4 text-gray-500">{i + 1}</td>
                                                    <td className="py-2 pr-4 font-medium text-gray-900">{evt.title}</td>
                                                    <td className="py-2 pr-4 text-gray-600">{evt.academicYear || '—'}</td>
                                                    <td className="py-2 pr-4 text-gray-600">{evt.eventType || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-400 text-sm">No IQAC events found for this club.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Full-year event calendar */}
            <div className="mt-8 mb-12">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-gdg-blue" /> Event Calendar
                    </h2>
                </div>
                <AdminCalendar />
            </div>
        </div>
    );
}
