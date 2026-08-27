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

    const [vision, setVision] = useState('');
    const [mission, setMission] = useState('');
    const [isEditingVisionMission, setIsEditingVisionMission] = useState(false);
    const [editVisionValue, setEditVisionValue] = useState('');
    const [editMissionValue, setEditMissionValue] = useState('');

    const activeMembers = members.filter(m => m.status === 'Active').length;
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const firstName = user?.name?.split(' ')[0] || 'there';

    const founder = '/founder.png';

    const currentClubName = activeClub?.name || user?.club?.name || '';
    
    useEffect(() => {
        if (!currentClubName) return;
        
        const fetchBudgetAndVisionMission = async () => {
            try {
                const res = await axios.get(`${API}/api/admin/get-budget`, { 
                    params: { club: currentClubName },
                    withCredentials: true 
                });
                if (res.data.success) {
                    setBudget(res.data.clubBudget || 0);
                }

                const vmRes = await axios.get(`${API}/api/admin/get-vision-mission`, { 
                    params: { club: currentClubName },
                    withCredentials: true 
                });
                if (vmRes.data.success) {
                    setVision(vmRes.data.vision || '');
                    setMission(vmRes.data.mission || '');
                }
            } catch (err) {
                console.error("Failed to fetch club data", err);
            }
        };
        fetchBudgetAndVisionMission();
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
            const res = await axios.put(`${API}/api/admin/update-budget`, { clubBudget: numVal, club: currentClubName }, { withCredentials: true });
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

    const handleUpdateVisionMission = async () => {
        try {
            const res = await axios.put(`${API}/api/admin/update-vision-mission`, {
                club: currentClubName,
                vision: editVisionValue,
                mission: editMissionValue
            }, { withCredentials: true });
            
            if (res.data.success) {
                toast.success('Vision & Mission updated!');
                setVision(editVisionValue);
                setMission(editMissionValue);
                setIsEditingVisionMission(false);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update Vision & Mission');
        }
    };



    const floatingIcons = [
        { icon: Code2, top: '10%', left: '-22px' },
        { icon: Terminal, bottom: '18%', left: '-18px' },
        { icon: GitBranch, top: '8%', right: '-22px' },
    ];

    return (
        <div className="max-w-5xl mx-auto" style={{ fontFamily: "inherit" }}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-20 py-16">

                <div className="flex-1 min-w-0">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                        style={{ background: '#f0f0f0', border: '1px solid #e0e0e0' }}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span
                            className="text-sm font-semibold tracking-wide"
                            style={{ color: '#4b5563' }}
                        >
                            {getGreeting()}, {firstName}
                        </span>
                    </div>

                    <h1
                        style={{
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
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
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
                            borderRight: i < stats.length - 1 ? '1px solid #e2e8f0' : 'none',
                        }}
                    >
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                            <div style={{ fontSize: '0.7rem', color: '#4b5563', marginTop: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Vision & Mission Section */}
            {role === 'Admin' && (
                <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 font-sans">Vision & Mission</h2>
                        {!isEditingVisionMission ? (
                            <button
                                onClick={() => {
                                    setEditVisionValue(vision);
                                    setEditMissionValue(mission);
                                    setIsEditingVisionMission(true);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-sans"
                            >
                                <Edit2 className="w-4 h-4" /> Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditingVisionMission(false)}
                                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-sans"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateVisionMission}
                                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-sans"
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 font-sans">Vision</h3>
                            {isEditingVisionMission ? (
                                <textarea
                                    value={editVisionValue}
                                    onChange={(e) => setEditVisionValue(e.target.value)}
                                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans resize-y"
                                    rows={4}
                                    placeholder="Enter club vision..."
                                />
                            ) : (
                                <p className="text-gray-600 text-sm leading-relaxed font-sans min-h-[60px]">
                                    {vision || <span className="text-gray-400 italic">No vision statement set.</span>}
                                </p>
                            )}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 font-sans">Mission</h3>
                            {isEditingVisionMission ? (
                                <textarea
                                    value={editMissionValue}
                                    onChange={(e) => setEditMissionValue(e.target.value)}
                                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-sans resize-y"
                                    rows={4}
                                    placeholder="Enter club mission..."
                                />
                            ) : (
                                <p className="text-gray-600 text-sm leading-relaxed font-sans min-h-[60px]">
                                    {mission || <span className="text-gray-400 italic">No mission statement set.</span>}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
