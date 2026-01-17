import React, { useState } from 'react';
import { Plus, Globe, Settings, Eye, Trash2, BarChart3 } from 'lucide-react';
import { Site } from '../../../types/site.types';
import { useSites } from '../context/SiteContext';
import { PreviewModal } from './PreviewModal';

interface DashboardViewProps {
    onCreateSite: () => void;
    onEditSite: (site: Site) => void;
    onViewInsights: (site: Site) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onCreateSite, onEditSite, onViewInsights }) => {
    const { sites, deleteSite, publishSite } = useSites();
    const [previewSite, setPreviewSite] = useState<Site | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">My Sites</h1>
                        <p className="text-slate-600 mt-2">Create and manage your websites</p>
                    </div>
                    <button
                        onClick={onCreateSite}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        <Plus size={20} />
                        Create New Site
                    </button>
                </div>

                {sites.length === 0 ? (
                    <div className="text-center py-20">
                        <Globe size={64} className="mx-auto text-slate-300 mb-4" />
                        <h2 className="text-2xl font-semibold text-slate-700 mb-2">No sites yet</h2>
                        <p className="text-slate-500 mb-6">Create your first website to get started</p>
                        <button
                            onClick={onCreateSite}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Your First Site
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sites.map(site => (
                            <div key={site.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Globe size={64} className="text-white opacity-50" />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{site.name}</h3>
                                            <p className="text-sm text-slate-500 mt-1">{site.template}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${site.status === 'published'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {site.status}
                                        </span>
                                    </div>

                                    {site.url && (
                                        <p className="text-sm text-blue-600 mb-4 truncate">{site.url}</p>
                                    )}

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => onEditSite(site)}
                                            className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            <Settings size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setPreviewSite(site)}
                                            className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            <Eye size={16} />
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => onViewInsights(site)}
                                            className="col-span-2 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <BarChart3 size={16} />
                                            Analytics & Insights
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm(`Delete "${site.name}"?`)) {
                                                    deleteSite(site.id);
                                                }
                                            }}
                                            className="col-span-2 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                            Delete Site
                                        </button>
                                    </div>

                                    {site.status === 'draft' && (
                                        <button
                                            onClick={() => publishSite(site.id)}
                                            className="w-full mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Globe size={16} />
                                            Publish Site
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {previewSite && (
                <PreviewModal site={previewSite} onClose={() => setPreviewSite(null)} />
            )}
        </div>
    );
};
