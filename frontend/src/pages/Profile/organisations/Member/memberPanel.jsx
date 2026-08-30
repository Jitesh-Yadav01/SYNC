import React from 'react';
import { useLocation } from 'react-router-dom';
// import { useView } from '@/context/ViewContext';
import { ProfileProvider } from '../../Shared/ProfileContext';
import SharedDashboardLayout from '../../Shared/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

const MemberPanel = () => {
    const location = useLocation();
    const { user } = useAuth();
    // const { setCurrentView } = useView();

    // useEffect(() => {
    //     setCurrentView('se-dashboard');
    //     localStorage.setItem('se_dashboard_active', 'true');
    // }, [setCurrentView]);
    const selectedClub = location.state?.club || (() => {
        try {
            const saved = localStorage.getItem("enteredClub");
            return saved ? JSON.parse(saved) : null;
        } catch(e) { return null; }
    })();

    const memberClubs = (user?.clubs || []).map((club) => ({
        id: club._id,
        _id: club._id,
        name: club.name,
        abbr: club.abbr || club.name?.substring(0, 3).toUpperCase(),
        logo: club.logo || club.img || "/clubprofiles/ns.png",
        role: 'Member'
    }));

    const resolvedSelectedClub = selectedClub
        ? memberClubs.find((club) => club.id === selectedClub.id || club._id === selectedClub._id || club.name === selectedClub.name)
        : memberClubs[0] || null;

    const clubs = resolvedSelectedClub ? [resolvedSelectedClub] : memberClubs;

    const initialData = {
        profile: { ...user, clubs },
        members: [],
        tasks: [],
        messages: [],
        notifications: []
    };

    return (
        <ProfileProvider initialData={initialData} role="Member">
            <SharedDashboardLayout />
        </ProfileProvider>
    );
};

export default MemberPanel;
