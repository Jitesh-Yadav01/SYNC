import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, Loader2, Users, X } from 'lucide-react';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { cn } from '@/lib/utils';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function Students() {
    const [data, setData] = useState({ summary: {}, students: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [search, setSearch] = useState('');
    const [clubFilter, setClubFilter] = useState('all'); // 'all', '0', '1', '2', '3+'
    const [yearFilter, setYearFilter] = useState('All Years');
    const [exporting, setExporting] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const debouncedSearch = useDebouncedValue(search, 300);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API}/api/superadmin/get-users-no-club`, { withCredentials: true });
                if (res.data?.success) {
                    setData({ summary: res.data.summary, students: res.data.students || [] });
                } else {
                    setError(res.data?.message || 'Failed to load students');
                }
            } catch (err) {
                const message = err.response?.data?.message || err.message || 'Failed to load students';
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleExport = async () => {
        if (exporting) return;
        setExporting(true);
        try {
            const params = new URLSearchParams();
            if (yearFilter !== 'All Years') params.append('year', yearFilter);
            if (clubFilter !== 'all') params.append('clubFilter', clubFilter);
            if (search.trim()) params.append('search', search.trim());
            
            const res = await axios.get(`${API}/api/superadmin/export-students?${params.toString()}`, {
                withCredentials: true,
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            const yearFile = yearFilter === 'All Years' ? 'All' : yearFilter;
            link.setAttribute('download', `NEXUS_Students_${yearFile}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error("Unable to export data.");
        } finally {
            setExporting(false);
        }
    };

    const visibleStudents = useMemo(() => {
        const q = debouncedSearch.trim().toLowerCase();
        return data.students.filter((s) => {
            if (q && !s.name?.toLowerCase().includes(q) && !s.email?.toLowerCase().includes(q)) {
                return false;
            }
            if (clubFilter !== 'all') {
                if (clubFilter === '0' && s.clubCount !== 0) return false;
                if (clubFilter === '1' && s.clubCount !== 1) return false;
                if (clubFilter === '2' && s.clubCount !== 2) return false;
                if (clubFilter === '3+' && s.clubCount < 3) return false;
            }
            if (yearFilter !== 'All Years' && s.year !== yearFilter) {
                return false;
            }
            return true;
        }).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [data.students, debouncedSearch, clubFilter, yearFilter]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400" style={{ fontFamily: "inherit" }}>
                <Loader2 className="h-8 w-8 animate-spin mb-3" />
                <p className="text-sm">Loading students data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700" style={{ fontFamily: "inherit" }}>
                {error}
            </div>
        );
    }

    const { totalStudents = 0, unassignedStudents = 0, studentsInOneClub = 0, studentsInTwoClubs = 0, studentsInThreeOrMoreClubs = 0 } = data.summary;

    return (
        <div className="w-full" style={{ fontFamily: "inherit" }}>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Unassigned</p>
                    <p className="text-2xl font-bold text-gray-900">{unassignedStudents}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">1 Club</p>
                    <p className="text-2xl font-bold text-gray-900">{studentsInOneClub}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">2 Clubs</p>
                    <p className="text-2xl font-bold text-gray-900">{studentsInTwoClubs}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-center items-center text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">3+ Clubs</p>
                    <p className="text-2xl font-bold text-gray-900">{studentsInThreeOrMoreClubs}</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Student Overview</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and view student club memberships.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-gdg-blue focus:border-gdg-blue p-2 shadow-sm"
                    >
                        {['All Years', 'FE', 'SE', 'TE', 'BE'].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                        {['all', '0', '1', '2', '3+'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setClubFilter(filter)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                    clubFilter === filter 
                                        ? "bg-gdg-blue/10 text-[#3367d6]" 
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                )}
                            >
                                {filter === 'all' ? 'All' : filter === '0' ? '0 Clubs' : filter === '3+' ? '3+ Clubs' : `${filter} Club${filter === '1' ? '' : 's'}`}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or email"
                            style={{ colorScheme: "light" }}
                            className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 caret-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gdg-blue focus:border-gdg-blue w-full sm:w-64"
                        />
                    </div>
                    
                    <button
                        onClick={handleExport}
                        disabled={exporting || visibleStudents.length === 0}
                        className={cn(
                            "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                            exporting || visibleStudents.length === 0
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
                        )}
                    >
                        {exporting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Export CSV
                            </>
                        )}
                    </button>
                </div>
            </div>

            {!visibleStudents.length ? (
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center text-gray-500 text-sm">
                    {data.students.length ? 'No students match your filters.' : 'No students found.'}
                    {clubFilter === '0' && !data.students.length && (
                        <span className="block mt-1">All students are currently associated with at least one club.</span>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Clubs</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {visibleStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-blue-100 text-[#3367d6] flex items-center justify-center font-bold shrink-0">
                                                    {(student.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{student.name || 'Unknown'}</div>
                                                    <div className="text-xs text-gray-400">{student.year || '-'} • {student.branch || '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {student.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {student.clubCount === 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                    Unassigned
                                                </span>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    {student.clubs.slice(0, 2).map(c => (
                                                        <span key={c._id} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gdg-blue/10 text-[#3367d6] border border-blue-100">
                                                            {c.name}
                                                        </span>
                                                    ))}
                                                    {student.clubCount > 2 && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">
                                                            +{student.clubCount - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button 
                                                onClick={() => setSelectedStudent(student)}
                                                className="text-gdg-blue hover:text-blue-800 text-xs font-semibold uppercase tracking-wider"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Student Details Dialog */}
            {selectedStudent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Student Details</h3>
                            <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-200">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-14 w-14 rounded-full bg-blue-100 text-[#3367d6] flex items-center justify-center font-bold text-2xl shrink-0">
                                    {(selectedStudent.name || '?').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h4>
                                    <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Year</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedStudent.year || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Branch</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedStudent.branch || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Registration No</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedStudent.regnNo || 'N/A'}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-gray-900 mb-3 flex items-center justify-between">
                                    Club Memberships
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                        {selectedStudent.clubCount} {selectedStudent.clubCount === 1 ? 'Club' : 'Clubs'}
                                    </span>
                                </p>
                                {selectedStudent.clubCount === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        Not assigned to any club
                                    </p>
                                ) : (
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                        {selectedStudent.clubs.map(club => (
                                            <div key={club._id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                                                <div className="h-10 w-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                    {club.clubLogo ? (
                                                        <img src={club.clubLogo} alt={club.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <Users className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="font-semibold text-sm text-gray-900">{club.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
