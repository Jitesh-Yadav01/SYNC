import React, { useState, useEffect } from 'react';
import { useProfile } from './ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, ClipboardList, Code2, Terminal, GitBranch, IndianRupee, Edit2, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function SharedOverview() {
    const { members, notifications, activeClub, role } = useProfile();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [totalResponses, setTotalResponses] = useState(0);
    const [loadingResponses, setLoadingResponses] = useState(false);
    
    const [budget, setBudget] = useState(0);
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [editBudgetValue, setEditBudgetValue] = useState('');

    const activeMembers = members.filter(m => m.status === 'Active').length;
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const firstName = user?.name?.split(' ')[0] || 'there';

    const founder = '/founder.png';

    const currentClubName = activeClub?.name || user?.club?.name || '';
    
    useEffect(() => {
        if (!currentClubName) return;
        
        const fetchBudget = async () => {
            try {
                const res = await axios.get(`${API}/api/admin/get-budget`, { 
                    params: { club: currentClubName },
                    withCredentials: true 
                });
                if (res.data.success) {
                    setBudget(res.data.clubBudget || 0);
                }
            } catch (err) {
                console.error("Failed to fetch budget", err);
            }
        };
        fetchBudget();
    }, [currentClubName]);

    useEffect(() => {
        if (!currentClubName || role === 'Applicant') return;

        const fetchTotalResponses = async () => {
            setLoadingResponses(true);
            try {
                const formsRes = await fetch(`${API}/api/forms/get-club-forms?club=${encodeURIComponent(currentClubName)}`, { credentials: 'include' });
                const formsJson = await formsRes.json();

                if (formsJson.success && Array.isArray(formsJson.forms)) {
                    let count = 0;
                    await Promise.all(formsJson.forms.map(async (form) => {
                        try {
                            const resRes = await fetch(`${API}/api/response/get-form-responses/${form._id}`, { credentials: 'include' });
                            const resJson = await resRes.json();
                            if (resJson.success && Array.isArray(resJson.responses)) {
                                count += resJson.responses.length;
                            }
                        } catch (err) {
                            console.error(`Error fetching responses for form ${form._id}:`, err);
                        }
                    }));
                    setTotalResponses(count);
                }
            } catch (err) {
                console.error('Error fetching forms for responses count:', err);
            } finally {
                setLoadingResponses(false);
            }
        };

        fetchTotalResponses();
    }, [currentClubName, role]);

    const stats = [
        { icon: Users, label: 'Active Members', value: activeMembers },
        { icon: Trophy, label: 'Notifications', value: unreadCount },
        { icon: ClipboardList, label: 'Total Responses', value: loadingResponses ? '...' : totalResponses },
        ...(role === 'Admin' ? [{ icon: IndianRupee, label: 'Club Budget', value: `₹${budget}`, isBudget: true }] : []),
    ];

    const handleUpdateBudget = async () => {
        const numVal = Number(editBudgetValue);
        if (isNaN(numVal) || numVal < 0) {
            toast.error("Please enter a valid budget");
            return;
        }
        
        if (!window.confirm(`Are you sure you want to update the club budget to ₹${numVal}?`)) {
            return;
        }

        try {
            const res = await axios.put(`${API}/api/admin/update-budget`, { clubBudget: numVal }, { withCredentials: true });
            if (res.data.success) {
                toast.success('Budget updated!');
                setBudget(numVal);
                setIsEditingBudget(false);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update budget');
        }
    };

    const floatingIcons = [
        { icon: Code2, top: '10%', left: '-22px' },
        { icon: Terminal, bottom: '18%', left: '-18px' },
        { icon: GitBranch, top: '8%', right: '-22px' },
    ];

    return (
        <div className="max-w-5xl mx-auto" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-20 py-16">

                <div className="flex-1 min-w-0">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                        style={{ background: '#f0f0f0', border: '1px solid #e0e0e0' }}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span
                            className="text-sm font-semibold tracking-wide"
                            style={{ fontFamily: "'JetBrains Mono', monospace", color: '#4b5563' }}
                        >
                            {getGreeting()}, {firstName}
                        </span>
                    </div>

                    <h1
                        style={{
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                            fontWeight: 800,
                            lineHeight: 1.02,
                            letterSpacing: '-0.02em',
                            color: '#111827',
                            marginBottom: '1.15rem',
                        }}
                    >
                        {activeClub?.name || 'Your Club'}<br />
                        <span style={{ color: '#1d4ed8' }}>Dashboard.</span>
                    </h1>

                    <p
                        style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '1rem',
                            color: '#374151',
                            lineHeight: 1.7,
                            maxWidth: '420px',
                            marginBottom: '1.5rem',
                        }}
                    >
                        Manage members, track applications, and oversee your club's progress — all in one place.
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => navigate(role === 'Admin' ? '/admin/responses' : '/member/responses')}
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                padding: '12px 28px',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                background: '#111827',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                letterSpacing: '0.01em',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#1f2937')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#111827')}
                        >
                            View Responses
                        </button>
                        <button
                            onClick={() => navigate(role === 'Admin' ? '/my-forms' : '#')}
                            style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                padding: '12px 28px',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                background: '#fff',
                                color: '#374151',
                                border: '1.5px solid #d1d5db',
                                cursor: 'pointer',
                                letterSpacing: '0.01em',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                        >
                            {role === 'Admin' ? 'Manage Forms' : 'Members'}
                        </button>
                    </div>
                </div>

                <div
                    className="relative shrink-0"
                    style={{ width: '360px', height: '400px', marginTop: '45px' }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '24px',
                            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                            transform: 'rotate(4deg)',
                            zIndex: 0,
                        }}
                    />
                    <div
                        style={{
                            position: 'relative',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            width: '100%',
                            height: '100%',
                            border: '2px solid #fff',
                            boxShadow: '0 40px 70px rgba(0,0,0,0.12)',
                            zIndex: 1,
                        }}
                    >
                        <img
                            src={founder}
                            alt="Founder"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    {floatingIcons.map(({ icon: Icon, ...pos }, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                zIndex: 10,
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: '#ffffff',
                                border: '1.5px solid #e5e7eb',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...pos,
                            }}
                        >
                            <Icon style={{ width: '18px', height: '18px', color: '#1d4ed8' }} />
                        </div>
                    ))}
                </div>
            </div>

            <div
                style={{
                    marginTop: '32px',
                    borderRadius: '16px',
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    padding: '20px 32px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0',
                }}
            >
                {stats.map(({ icon: Icon, label, value, isBudget }, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            flex: '1 1 160px',
                            padding: '8px 24px',
                            borderRight: i < stats.length - 1 ? '1px solid #e5e7eb' : 'none',
                        }}
                    >
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon style={{ width: '18px', height: '18px', color: '#111827' }} />
                        </div>
                        <div>
                            {isBudget && isEditingBudget ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">₹</span>
                                    <input 
                                        type="number" 
                                        value={editBudgetValue}
                                        onChange={(e) => setEditBudgetValue(e.target.value)}
                                        className="w-20 px-1 py-0.5 text-sm font-bold border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 font-mono text-gray-900"
                                        autoFocus
                                    />
                                    <button onClick={handleUpdateBudget} className="p-1.5 text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm transition-colors flex items-center justify-center">
                                        <Check className="w-4 h-4 stroke-[3]" />
                                    </button>
                                    <button onClick={() => setIsEditingBudget(false)} className="p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors flex items-center justify-center">
                                        <X className="w-4 h-4 stroke-[3]" />
                                    </button>
                                </div>
                            ) : (
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.5rem', fontWeight: 900, color: '#111827', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {value}
                                    {isBudget && role === 'Admin' && (
                                        <button 
                                            onClick={() => { setEditBudgetValue(budget.toString()); setIsEditingBudget(true); }}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#4b5563', marginTop: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
