import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, Loader2, Users } from 'lucide-react';
import useDebouncedValue from '@/hooks/useDebouncedValue';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function UnassignedStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const debouncedSearch = useDebouncedValue(search, 300);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API}/api/superadmin/get-users-no-club`, { withCredentials: true });
                if (res.data?.success) {
                    setStudents(res.data.usersInNoClub || []);
                } else {
                    setError(res.data?.message || 'Failed to load unassigned students');
                }
            } catch (err) {
                const message = err.response?.data?.message || err.message || 'Failed to load unassigned students';
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const visibleStudents = useMemo(() => {
        const q = debouncedSearch.trim().toLowerCase();
        return students.filter((s) => {
            if (!q) return true;
            return (s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
        }).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [students, debouncedSearch]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
                <Loader2 className="h-8 w-8 animate-spin mb-3" />
                <p className="text-sm">Loading students...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
                {error}
            </div>
        );
    }

    return (
        <div className="w-full" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Unassigned Students</h2>
                    <p className="text-sm text-gray-500 mt-1">Students who are currently not associated with any club.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 border border-blue-100">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-800">{students.length} Total</span>
                    </div>
                    <div className="relative">
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email"
                            style={{ colorScheme: "light" }}
                            className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 caret-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                        />
                    </div>
                </div>
            </div>

            {!visibleStudents.length ? (
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center text-gray-500 text-sm">
                    {students.length ? 'No unassigned students match your search.' : 'No unassigned students found. All available students are currently associated with at least one club.'}
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-semibold text-gray-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Club Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {visibleStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                                                    {(student.name || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{student.name || 'Unknown'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {student.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                                Not Assigned
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
