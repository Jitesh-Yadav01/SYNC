import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, Search } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function AvailableForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/forms/get-public-forms`, { credentials: 'include' })
      .then(r => r.json())
      .then(json => {
        if (json.success) setForms(json.forms || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hasStatusData = useMemo(() => {
    return forms.some(f => f.hasResponded !== undefined || f.isSubmitted !== undefined || f.formFilled !== undefined || f.isFilled !== undefined);
  }, [forms]);

  const filteredForms = useMemo(() => {
    return forms.filter(form => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = form.title?.toLowerCase().includes(query);
        const matchesDesc = form.desc?.toLowerCase().includes(query);
        const matchesClub = form.club?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesClub) return false;
      }

      if (hasStatusData && statusFilter !== 'all') {
        const isFilled = form.hasResponded || form.isSubmitted || form.formFilled || form.isFilled || false;
        if (statusFilter === 'filled' && !isFilled) return false;
        if (statusFilter === 'not_filled' && isFilled) return false;
      }

      return true;
    });
  }, [forms, searchTerm, statusFilter, hasStatusData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-sm text-gray-500">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Available Forms</h2>
          <p className="text-gray-500 mt-1">Fill out these forms created by the Admins.</p>
        </div>

        {forms.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
              />
            </div>
            
            {hasStatusData && (
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="h-9 w-full sm:w-36 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 text-gray-900"
              >
                <option value="all">All Forms</option>
                <option value="filled">Filled</option>
                <option value="not_filled">Not Filled</option>
              </select>
            )}
          </div>
        )}
      </div>

      {forms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No forms are available right now.</p>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <Search className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No forms match your search.</p>
          <button 
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} 
            className="mt-2 text-sm text-blue-600 hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredForms.map(form => (
            <div
              key={form._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => navigate(`/forms/${form._id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-gdg-blue" />
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#3367d6] transition-colors">
                      {form.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{form.desc}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    {form.fields?.length || 0} question{form.fields?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gdg-blue shrink-0 transition-colors mt-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
