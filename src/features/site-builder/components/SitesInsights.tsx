import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    BarChart3, TrendingUp, Users, Clock, Globe,
    Search, Layout, AlertCircle, CheckCircle,
    MousePointer2, FileText, ArrowLeft, Download, RefreshCw,
    Settings as SettingsIcon, Activity, Smartphone, LucideIcon
} from 'lucide-react';
import { Site } from '../../../types/site.types';
import { AnalyticsService } from '../../../services/analytics-service';
import { SEOAnalyzer } from '../../../services/seo-analyzer';
import { FormService } from '../../../services/form-service';
import { AnalyticsData, SEOScore } from '../../../types/analytics.types';
import { FormAnalytics, FormSubmission } from '../../../types/forms.types';

interface SitesInsightsProps {
    site: Site;
    onBack: () => void;
}

export const SitesInsights: React.FC<SitesInsightsProps> = ({ site, onBack }) => {
    const [activeTab, setActiveTab] = useState<'analytics' | 'seo' | 'forms'>('analytics');
    const [isLoading, setIsLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [seoScore, setSeoScore] = useState<SEOScore | null>(null);
    const [formsData, setFormsData] = useState<{ analytics: FormAnalytics[], submissions: FormSubmission[] }>({ analytics: [], submissions: [] });


    const analyticsService = useMemo(() => new AnalyticsService(), []);
    const seoAnalyzer = useMemo(() => new SEOAnalyzer(), []);
    const formService = useMemo(() => new FormService(), []);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Analytics
            const analytics = await analyticsService.getAnalytics(site.id, {
                start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                end: new Date().toISOString(),
                preset: '30d'
            });
            setAnalyticsData(analytics);

            // SEO
            const seo = seoAnalyzer.analyzePage(site);
            setSeoScore(seo);

            // Forms
            const forms = await formService.getSiteForms(site.id);
            const formsAnalyticsProms = forms.map(f => formService.getFormAnalytics(f.id, {
                start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                end: new Date().toISOString()
            }));
            const allAnalytics = await Promise.all(formsAnalyticsProms);

            // Get mock submissions just for demo
            // In real app we would might query per form
            setFormsData({
                analytics: allAnalytics,
                submissions: [] // Would load submissions here
            });

        } catch (error) {
            console.error('Failed to load insights:', error);
        } finally {
            setIsLoading(false);
        }
    }, [site, analyticsService, seoAnalyzer, formService]);

    useEffect(() => {
        loadData();
    }, [loadData]);



    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <RefreshCw className="animate-spin text-blue-600 mb-4" size={32} />
                <p className="text-slate-500">Loading insights...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
            >
                <ArrowLeft size={16} />
                Back to Dashboard
            </button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Site Insights</h1>
                    <p className="text-slate-500">{site.name}</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'analytics' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('seo')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'seo' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        SEO Audit
                    </button>
                    <button
                        onClick={() => setActiveTab('forms')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'forms' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        Forms ({formsData.analytics.length})
                    </button>
                </div>
            </div>

            {activeTab === 'analytics' && analyticsData && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <MetricCard
                            title="Total Page Views"
                            value={analyticsData.metrics.totalPageViews}
                            icon={MousePointer2}
                            trend="+12%"
                        />
                        <MetricCard
                            title="Unique Visitors"
                            value={analyticsData.metrics.uniqueVisitors}
                            icon={Users}
                            trend="+5%"
                        />
                        <MetricCard
                            title="Avg. Session Duration"
                            value={`${analyticsData.metrics.avgSessionDuration}s`}
                            icon={Clock}
                            trend="-2%"
                            isNegative
                        />
                        <MetricCard
                            title="Bounce Rate"
                            value={`${(analyticsData.metrics.bounceRate * 100).toFixed(1)}%`}
                            icon={TrendingUp}
                            trend="0%"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Pages */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-slate-400" />
                                Top Pages
                            </h3>
                            <div className="space-y-4">
                                {analyticsData.topPages.map((page, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-900 truncate">{page.title}</p>
                                            <p className="text-xs text-slate-500">{page.path}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-slate-900">{page.views} views</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Devices */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Layout size={20} className="text-slate-400" />
                                Traffic by Device
                            </h3>
                            <div className="space-y-4">
                                {analyticsData.devices.map((device, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="capitalize text-slate-700">{device.type}</span>
                                            <span className="font-medium text-slate-900">{device.count} ({device.percentage.toFixed(1)}%)</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full"
                                                style={{ width: `${device.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'seo' && seoScore && (
                <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Overall SEO Score</h3>
                            <p className="text-slate-500 text-sm mt-1">Based on technical, content, and mobile analysis</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`text-4xl font-bold ${getScoreColor(seoScore.overall)}`}>
                                {seoScore.overall}/100
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <SEOCategoryCard
                            title="Technical"
                            score={seoScore.categories.technical.score}
                            icon={SettingsIcon}
                        />
                        <SEOCategoryCard
                            title="Content"
                            score={seoScore.categories.content.score}
                            icon={FileText}
                        />
                        <SEOCategoryCard
                            title="Performance"
                            score={seoScore.categories.performance.score}
                            icon={Activity}
                        />
                        <SEOCategoryCard
                            title="Mobile"
                            score={seoScore.categories.mobile.score}
                            icon={Smartphone}
                        />
                    </div>

                    {/* Issues */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900">Issues & Recommendations</h3>
                        </div>
                        <div className="divide-y divide-slate-200">
                            {seoScore.issues.length === 0 ? (
                                <div className="p-6 text-center text-slate-500">
                                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                                    <p>Great job! No critical issues found.</p>
                                </div>
                            ) : (
                                seoScore.issues.map((issue, i) => (
                                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 ${issue.severity === 'error' ? 'text-red-500' :
                                                issue.severity === 'warning' ? 'text-amber-500' :
                                                    'text-blue-500'
                                                }`}>
                                                <AlertCircle size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-slate-900">{issue.element}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-bold ${issue.severity === 'error' ? 'bg-red-100 text-red-700' :
                                                        issue.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {issue.severity}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 text-sm mb-2">{issue.message}</p>
                                                <div className="bg-slate-50 p-2 rounded text-xs text-slate-700 font-mono">
                                                    Box to fix: {issue.solution}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'forms' && (
                <div className="space-y-6">
                    {formsData.analytics.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">No Forms Detected</h3>
                            <p className="text-slate-500 mb-4">Add a contact form to your site to start collecting data.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {formsData.analytics.map((form, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-900">Contact Form</h3>
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Active</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 text-sm">Submissions</span>
                                            <span className="font-bold text-lg">{form.totalSubmissions}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 text-sm">Completion Rate</span>
                                            <span className="font-bold text-lg">{(form.completionRate * 100).toFixed(1)}%</span>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <button className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors font-medium">
                                                <Download size={16} />
                                                Export Data (CSV)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Utils
interface MetricCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend: string;
    isNegative?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, trend, isNegative }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">{title}</h3>
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                <Icon size={18} />
            </div>
        </div>
        <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900">{value}</span>
            <span className={`text-sm font-medium mb-1 ${(trend.startsWith('+') && !isNegative) || (trend.startsWith('-') && isNegative)
                ? 'text-green-600'
                : 'text-red-600'
                }`}>
                {trend}
            </span>
        </div>
    </div>
);

interface SEOCategoryCardProps {
    title: string;
    score: number;
    icon: LucideIcon;
}

const SEOCategoryCard: React.FC<SEOCategoryCardProps> = ({ title, score, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-50 p-2 rounded text-blue-600">
                <Icon size={18} />
            </div>
            <h3 className="font-medium text-slate-900">{title}</h3>
        </div>
        <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-slate-900">{score}/100</span>
            <div className={`h-2 w-16 rounded-full overflow-hidden bg-slate-100`}>
                <div
                    className={`h-full rounded-full ${getScoreColor(score).replace('text-', 'bg-')}`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    </div>
);

const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
};


