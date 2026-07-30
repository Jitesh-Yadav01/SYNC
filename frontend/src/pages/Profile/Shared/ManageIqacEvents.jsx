import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Loader2, X, Search, FileBarChart } from 'lucide-react';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { useProfile } from './ProfileContext';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function ManageIqacEvents() {
    const { activeClub } = useProfile();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        academicYear: '',
        eventType: '',
        theme: '',
        startDate: '',
        endDate: '',
        budget: 0,
        studentParticipation: 0,
        facultyParticipation: 0,
        collaborators: '',
        description: [''],
        objectives: [''],
        overview: [''],
        pos: ''
    });

    const debouncedSearch = useDebouncedValue(search, 500);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/iqacevents/all`, { 
                withCredentials: true,
                params: { club: activeClub?.name }
            });
            if (res.data.success) {
                setEvents(res.data.events || []);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch IQAC events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeClub?.name) {
            fetchEvents();
        }
    }, [activeClub?.name]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayItemChange = (field, index, value) => {
        setFormData(prev => {
            const updated = [...prev[field]];
            updated[index] = value;
            return { ...prev, [field]: updated };
        });
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => {
            const updated = prev[field].filter((_, i) => i !== index);
            return { ...prev, [field]: updated.length ? updated : [''] };
        });
    };

    const openModal = (event = null) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                title: event.title || '',
                academicYear: event.academicYear || '',
                eventType: event.eventType || '',
                theme: event.theme || '',
                startDate: event.startDate || '',
                endDate: event.endDate || '',
                budget: event.budget || 0,
                studentParticipation: event.studentParticipation || 0,
                facultyParticipation: event.facultyParticipation || 0,
                collaborators: (event.collaborators || []).join(', '),
                description: event.description?.length ? [...event.description] : [''],
                objectives: event.objectives?.length ? [...event.objectives] : [''],
                overview: event.overview?.length ? [...event.overview] : [''],
                pos: (event.pos || []).join(', ')
            });
        } else {
            setEditingEvent(null);
            setFormData({
                title: '', academicYear: '', eventType: '', theme: '', startDate: '', endDate: '',
                budget: 0, studentParticipation: 0, facultyParticipation: 0,
                collaborators: '', description: [''], objectives: [''], overview: [''], pos: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                club: activeClub?.name,
                collaborators: formData.collaborators.split(',').map(s => s.trim()).filter(Boolean),
                description: formData.description.map(s => s.trim()).filter(Boolean),
                objectives: formData.objectives.map(s => s.trim()).filter(Boolean),
                overview: formData.overview.map(s => s.trim()).filter(Boolean),
                pos: formData.pos.split(',').map(s => s.trim()).filter(Boolean),
            };

            if (editingEvent) {
                const res = await axios.put(`${API}/api/iqacevents/${editingEvent._id}`, payload, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Event updated successfully');
                    fetchEvents();
                    closeModal();
                } else {
                    toast.error(res.data.message);
                }
            } else {
                const res = await axios.post(`${API}/api/iqacevents/create`, payload, { withCredentials: true });
                if (res.data.success) {
                    toast.success('Event created successfully');
                    fetchEvents();
                    closeModal();
                } else {
                    toast.error(res.data.message);
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving event');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            // Need to pass club in body for resolution
            const res = await axios.delete(`${API}/api/iqacevents/${id}`, { 
                withCredentials: true,
                data: { club: activeClub?.name }
            });
            if (res.data.success) {
                toast.success('Event deleted successfully');
                fetchEvents();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error deleting event');
        }
    };

    const filteredEvents = events.filter(e => 
        (e.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (e.academicYear || '').toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FileBarChart className="h-6 w-6 text-blue-600" />
                        IQAC Reports & Events
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage events for IQAC reporting</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Create Event
                </button>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by title or academic year..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-3" />
                        <p className="text-sm">Loading IQAC events...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-12 text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                        No IQAC events found. Click "Create Event" to add one.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Title</th>
                                    <th className="px-4 py-3">Academic Year</th>
                                    <th className="px-4 py-3">Event Type</th>
                                    <th className="px-4 py-3">Date Range</th>
                                    <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredEvents.map(event => (
                                    <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-900">{event.title}</td>
                                        <td className="px-4 py-3 text-gray-600">{event.academicYear}</td>
                                        <td className="px-4 py-3 text-gray-600">{event.eventType || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {event.startDate !== 'Nil' ? event.startDate : '—'} 
                                            {event.endDate !== 'Nil' ? ` to ${event.endDate}` : ''}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(event)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit Event"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event._id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete Event"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingEvent ? 'Edit IQAC Event' : 'Create IQAC Event'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 bg-white p-1.5 rounded-md border border-gray-200">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-6 flex-1">
                            <form id="iqac-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Event Title <span className="text-red-500">*</span></label>
                                        <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Academic Year <span className="text-red-500">*</span></label>
                                        <input required name="academicYear" placeholder="e.g. 2023-2024" value={formData.academicYear} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Event Type</label>
                                        <input name="eventType" value={formData.eventType} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Theme</label>
                                        <input name="theme" value={formData.theme} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Start Date</label>
                                        <input type="date" name="startDate" value={formData.startDate !== 'Nil' ? formData.startDate : ''} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">End Date</label>
                                        <input type="date" name="endDate" value={formData.endDate !== 'Nil' ? formData.endDate : ''} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Budget (₹)</label>
                                        <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Collaborators (Comma-separated)</label>
                                        <input name="collaborators" value={formData.collaborators} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Student Participation</label>
                                        <input type="number" name="studentParticipation" value={formData.studentParticipation} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Faculty Participation</label>
                                        <input type="number" name="facultyParticipation" value={formData.facultyParticipation} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
                                    <div className="space-y-2">
                                        {formData.description.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-2 group">
                                                <span className="mt-2.5 text-xs text-gray-400 font-mono w-5 text-right shrink-0">{idx + 1}.</span>
                                                <textarea
                                                    rows={2}
                                                    value={item}
                                                    onChange={(e) => handleArrayItemChange('description', idx, e.target.value)}
                                                    placeholder={`Paragraph ${idx + 1}`}
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('description', idx)}
                                                    className="mt-1.5 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem('description')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-dashed border-blue-300 rounded-lg transition-colors"
                                        >
                                            <Plus className="h-3.5 w-3.5" /> Add paragraph
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Objectives</label>
                                    <div className="space-y-2">
                                        {formData.objectives.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2 group">
                                                <span className="text-xs text-gray-400 font-mono w-5 text-right shrink-0">{idx + 1}.</span>
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => handleArrayItemChange('objectives', idx, e.target.value)}
                                                    placeholder={`Objective ${idx + 1}`}
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('objectives', idx)}
                                                    className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem('objectives')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-dashed border-blue-300 rounded-lg transition-colors"
                                        >
                                            <Plus className="h-3.5 w-3.5" /> Add objective
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Overview of the Event</label>
                                    <div className="space-y-2">
                                        {formData.overview.map((item, idx) => (
                                            <div key={idx} className="flex items-start gap-2 group">
                                                <span className="mt-2.5 text-xs text-gray-400 font-mono w-5 text-right shrink-0">{idx + 1}.</span>
                                                <textarea
                                                    rows={2}
                                                    value={item}
                                                    onChange={(e) => handleArrayItemChange('overview', idx, e.target.value)}
                                                    placeholder={`Paragraph ${idx + 1}`}
                                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('overview', idx)}
                                                    className="mt-1.5 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem('overview')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-dashed border-blue-300 rounded-lg transition-colors"
                                        >
                                            <Plus className="h-3.5 w-3.5" /> Add paragraph
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Program Outcomes (POs) (Comma-separated)</label>
                                    <input name="pos" placeholder="e.g. PO1, PO2, PO4" value={formData.pos} onChange={handleInputChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" form="iqac-form" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                                {editingEvent ? 'Update Event' : 'Create Event'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
