import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Play, Pause, Trophy, TrendingUp, Zap, Database, GitBranch, Settings, Download, Bell, Users, Lock } from 'lucide-react';
import { WebhookService, type Webhook } from '../../../services/webhooks/webhook-service';
import { PermissionsService, type User, type UserRole } from '../../../services/permissions/permissions-service';
import { CICDService, type CICDConfig } from '../../../services/cicd/cicd-service';
import { PDFExportService, type PDFExportConfig } from '../../../services/export/pdf-export-service';

const ABTestingDashboard = () => {
    const [activeTab, setActiveTab] = useState('ab-tests');
    const [selectedTest, setSelectedTest] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [cicdConfig, setCicdConfig] = useState<CICDConfig | null>(null);

    // Services
    const webhookService = useMemo(() => new WebhookService(), []);
    const permissionsService = useMemo(() => new PermissionsService(), []);
    const cicdService = useMemo(() => new CICDService(), []);
    const pdfExportService = useMemo(() => new PDFExportService(), []);

    // Mock data
    const abTests = [
        {
            id: 'test_1',
            name: 'Hero Content Optimization',
            status: 'running',
            progress: 67,
            variants: [
                { id: 'v1', name: 'Control', impressions: 450, successRate: 0.76, avgRating: 4.2 },
                { id: 'v2', name: 'Variant A', impressions: 430, successRate: 0.82, avgRating: 4.5 },
                { id: 'v3', name: 'Variant B', impressions: 420, successRate: 0.79, avgRating: 4.3 }
            ],
            confidence: 87,
            improvement: 7.9
        },
        {
            id: 'test_2',
            name: 'CTA Button Copy Test',
            status: 'completed',
            progress: 100,
            variants: [
                { id: 'v1', name: 'Get Started', impressions: 890, successRate: 0.71, avgRating: 4.0 },
                { id: 'v2', name: 'Start Free', impressions: 910, successRate: 0.85, avgRating: 4.6 }
            ],
            confidence: 96,
            improvement: 19.7,
            winner: 'v2'
        }
    ];

    const fineTuningJobs = [
        {
            id: 'job_1',
            name: 'Hero Content Model v2',
            status: 'running',
            progress: 73,
            baseModel: 'gpt-4',
            dataset: 'Hero Sections (500 examples)',
            epochs: 3,
            currentEpoch: 2,
            trainingLoss: [2.1, 1.8, 1.5],
            validationLoss: [2.2, 1.9, 1.6],
            cost: 12.50,
            startedAt: '2 hours ago'
        },
        {
            id: 'job_2',
            name: 'Features Content Model v1',
            status: 'succeeded',
            progress: 100,
            baseModel: 'claude-sonnet-4',
            dataset: 'Features Sections (750 examples)',
            epochs: 3,
            currentEpoch: 3,
            trainingLoss: [2.0, 1.6, 1.3],
            validationLoss: [2.1, 1.7, 1.4],
            cost: 18.75,
            startedAt: '1 day ago',
            fineTunedModel: 'ft-claude-sonnet-4-abc123',
            accuracy: 0.89,
            improvement: 32
        }
    ];





    const renderABTests = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">A/B Tests</h2>
                    <p className="text-gray-600">Optimize your prompts with statistical testing</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Create Test
                </button>
            </div>

            {/* Tests List */}
            <div className="grid gap-4">
                {abTests.map(test => (
                    <div key={test.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${test.status === 'running' ? 'bg-blue-100 text-blue-700' :
                                        test.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {test.status}
                                    </span>
                                    {test.winner && (
                                        <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                                            <Trophy className="w-4 h-4" />
                                            Winner: {test.variants.find(v => v.id === test.winner)?.name}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>{test.variants.length} variants</span>
                                    <span>•</span>
                                    <span>{test.confidence}% confidence</span>
                                    <span>•</span>
                                    <span className="text-green-600 font-medium">+{test.improvement}% improvement</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {test.status === 'running' && (
                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                        <Pause className="w-4 h-4 text-gray-600" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedTest(test)}
                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-gray-900">{test.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${test.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="grid grid-cols-3 gap-3">
                            {test.variants.map(variant => (
                                <div key={variant.id} className={`p-3 rounded-lg border-2 ${test.winner === variant.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50'
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900">{variant.name}</span>
                                        {test.winner === variant.id && <Trophy className="w-4 h-4 text-yellow-600" />}
                                    </div>
                                    <div className="space-y-1 text-xs text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Success Rate:</span>
                                            <span className="font-medium text-gray-900">{(variant.successRate * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Avg Rating:</span>
                                            <span className="font-medium text-gray-900">{variant.avgRating.toFixed(1)}/5</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Impressions:</span>
                                            <span className="font-medium text-gray-900">{variant.impressions}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderFineTuning = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Fine-tuning Jobs</h2>
                    <p className="text-gray-600">Train custom models on your data</p>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    New Training Job
                </button>
            </div>

            {/* Jobs List */}
            <div className="grid gap-4">
                {fineTuningJobs.map(job => (
                    <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{job.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'running' ? 'bg-purple-100 text-purple-700' :
                                        job.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                                            job.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {job.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                                    <div>
                                        <span className="block text-xs text-gray-500">Base Model</span>
                                        <span className="font-medium text-gray-900">{job.baseModel}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500">Dataset</span>
                                        <span className="font-medium text-gray-900">{job.dataset}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500">Epoch</span>
                                        <span className="font-medium text-gray-900">{job.currentEpoch}/{job.epochs}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-gray-500">Cost</span>
                                        <span className="font-medium text-gray-900">${job.cost.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedJob(job)}
                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                View Details
                            </button>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">Training Progress</span>
                                <span className="font-medium text-gray-900">{job.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-purple-600 h-2 rounded-full transition-all"
                                    style={{ width: `${job.progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Loss Chart */}
                        {job.trainingLoss.length > 0 && (
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={job.trainingLoss.map((loss, i) => ({
                                        epoch: i + 1,
                                        training: loss,
                                        validation: job.validationLoss[i]
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="epoch" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="training" stroke="#8B5CF6" strokeWidth={2} name="Training Loss" />
                                        <Line type="monotone" dataKey="validation" stroke="#EC4899" strokeWidth={2} name="Validation Loss" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Results (if completed) */}
                        {job.status === 'succeeded' && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-900">Training Completed</p>
                                        <p className="text-xs text-green-700 mt-1">
                                            Model: {job.fineTunedModel} • Accuracy: {(job.accuracy * 100).toFixed(1)}% • Improvement: +{job.improvement}%
                                        </p>
                                    </div>
                                    <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                                        Deploy Model
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const [webhooks, setWebhooks] = useState<Webhook[]>([]);

    useEffect(() => {
        setWebhooks(webhookService.getAllWebhooks());
    }, [webhookService]);

    const handleToggleWebhook = (id: string, active: boolean) => {
        webhookService.toggleWebhook(id, active);
        setWebhooks(webhookService.getAllWebhooks());
    };



    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        // Initialize demo data if empty
        const initData = () => {
            let orgs = localStorage.getItem('organizations');
            let ownerId = '';
            let orgId = '';

            if (!orgs || Object.keys(JSON.parse(orgs)).length === 0) {
                // Create default Organization and Owner
                const owner = permissionsService.createUser({
                    email: 'admin@company.com',
                    name: 'Admin User',
                    role: 'owner',
                    organizationId: 'temp_org_id'
                });
                ownerId = owner.id;

                const org = permissionsService.createOrganization({
                    name: 'My Organization',
                    ownerId: owner.id,
                    plan: 'pro'
                });
                orgId = org.id;

                // Note: In a real app, this circular dependency (user needs orgId, org needs ownerId)
                // is handled differently. For this demo service, we're just setting it up.
            } else {
                const allUsers = permissionsService.getOrganizationUsers(Object.values(JSON.parse(orgs))[0].id);
                if (allUsers.length > 0) {
                    ownerId = allUsers[0].id;
                    orgId = allUsers[0].organizationId;
                }
            }

            if (ownerId) {
                permissionsService.setCurrentUser(ownerId);
                setCurrentUser(permissionsService.getCurrentUser());
                setUsers(permissionsService.getOrganizationUsers(orgId));
            }
        };

        if (activeTab === 'users') {
            initData();
        }
    }, [permissionsService, activeTab]);

    const handleInviteUser = () => {
        if (!currentUser) return;

        try {
            const email = prompt('User Email:');
            const role = prompt('Role (admin, editor, viewer):') as UserRole;
            const name = prompt('User Name:');

            if (email && role && name) {
                const invitation = permissionsService.inviteUser(email, role, currentUser.organizationId);
                permissionsService.acceptInvitation(invitation.id, { name });
                setUsers(permissionsService.getOrganizationUsers(currentUser.organizationId));
                alert(`User ${name} added successfully!`);
            }
        } catch (error) {
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const hasPermission = (permission: any) => {
        return permissionsService.hasPermission(permission);
    };

    useEffect(() => {
        if (activeTab === 'settings') {
            const pipelines = cicdService.getAllPipelines();
            if (pipelines.length > 0) {
                setCicdConfig(pipelines[0].config);
            }
        }
    }, [activeTab, cicdService]);

    const handleSaveCICDConfig = (newConfig: Partial<CICDConfig>) => {
        try {
            const pipelines = cicdService.getAllPipelines();
            if (pipelines.length > 0) {
                cicdService.updatePipeline(pipelines[0].id, newConfig);
                setCicdConfig(pipelines[0].config);
            } else {
                // Create default pipeline if none exists
                const config: CICDConfig = {
                    provider: 'github-actions',
                    repository: '',
                    branch: 'main',
                    autoDeployOnSuccess: false,
                    notifications: {},
                    ...newConfig
                } as CICDConfig;
                const pipeline = cicdService.createPipeline(config);
                setCicdConfig(pipeline.config);
            }
            alert('CI/CD Configuration saved!');
        } catch (error) {
            alert(`Error saving configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleExportReport = async (type: 'ab-test' | 'fine-tuning' | 'full' | 'csv' | 'json') => {
        const config: PDFExportConfig = {
            title: 'AI Optimization Report',
            author: currentUser?.name || 'Admin',
            subtitle: `Generated on ${new Date().toLocaleDateString()}`
        };

        try {
            let blob: Blob;
            switch (type) {
                case 'ab-test':
                    if (abTests.length > 0) {
                        // Demo: export the first test
                        // In reality, we would map the mock data to the report interface
                        const report = {
                            test: { ...abTests[0], createdAt: new Date().toISOString() },
                            variants: abTests[0].variants,
                            winner: abTests[0].winner ? {
                                name: abTests[0].variants.find(v => v.id === abTests[0].winner)?.name || '',
                                improvement: abTests[0].improvement,
                                confidence: abTests[0].confidence
                            } : undefined,
                            statistical: { pValue: 0.04, zScore: 1.96, significanceLevel: 0.95 }
                        };
                        blob = await pdfExportService.exportABTestReport(report as any, config);
                        pdfExportService.downloadPDF(blob, 'ab-test-report.pdf');
                    }
                    break;
                case 'fine-tuning':
                    if (fineTuningJobs.length > 0) {
                        const job = fineTuningJobs[0];
                        const report = {
                            job: { ...job, createdAt: new Date().toISOString() },
                            dataset: { name: job.dataset, size: 50 * 1024, examples: 500 },
                            training: { epochs: job.epochs, trainingLoss: job.trainingLoss, validationLoss: job.validationLoss },
                            results: job.status === 'succeeded' ? {
                                fineTunedModel: (job as any).fineTunedModel,
                                accuracy: (job as any).accuracy,
                                improvement: (job as any).improvement,
                                cost: job.cost
                            } : undefined
                        };
                        blob = await pdfExportService.exportFineTuningReport(report as any, config);
                        pdfExportService.downloadPDF(blob, 'fine-tuning-report.pdf');
                    }
                    break;
                case 'full':
                    // Demo implementation
                    alert('Full report generation started...');
                    break;
            }
        } catch (error) {
            alert('Error generating report');
            console.error(error);
        }
    };

    const handleTestWebhook = async (id: string) => {
        const result = await webhookService.testWebhook(id);
        if (result.success) {
            alert('Webhook test successful!');
        } else {
            alert(`Webhook test failed: ${result.error}`);
        }
    };

    const renderWebhooks = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Webhooks</h2>
                    <p className="text-gray-600">Configure notifications for job events</p>
                </div>
                <button
                    onClick={() => {
                        // TODO: Implement create webhook modal
                        const name = prompt('Webhook Name:');
                        const url = prompt('Webhook URL:');
                        if (name && url) {
                            webhookService.createWebhook({
                                name,
                                url,
                                events: ['job.completed', 'test.completed']
                            });
                            setWebhooks(webhookService.getAllWebhooks());
                        }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Bell className="w-4 h-4" />
                    Add Webhook
                </button>
            </div>

            {webhooks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No webhooks configured</h3>
                    <p className="text-gray-500 mt-1">Add a webhook to receive notifications about your jobs.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {webhooks.map(webhook => (
                        <div key={webhook.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{webhook.name}</h3>
                                        <button
                                            onClick={() => handleToggleWebhook(webhook.id, !webhook.active)}
                                            className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${webhook.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {webhook.active ? 'Active' : 'Inactive'}
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 font-mono break-all">{webhook.url}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {webhook.events.map(event => (
                                            <span key={event} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                {event}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-3 flex gap-4 text-xs text-gray-500">
                                        <span>Success: {webhook.metadata.successCount}</span>
                                        <span>Failures: {webhook.metadata.failureCount}</span>
                                        {webhook.metadata.lastTriggered && (
                                            <span>Last: {new Date(webhook.metadata.lastTriggered).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleTestWebhook(webhook.id)}
                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Test
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Delete this webhook?')) {
                                                webhookService.deleteWebhook(webhook.id);
                                                setWebhooks(webhookService.getAllWebhooks());
                                            }
                                        }}
                                        className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderUsers = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Team & Permissions</h2>
                    <p className="text-gray-600">Manage user access and roles</p>
                </div>
                {hasPermission('users.invite') && (
                    <button
                        onClick={handleInviteUser}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Users className="w-4 h-4" />
                        Invite User
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {user.permissions.slice(0, 2).map(perm => (
                                            <span key={perm} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                {perm}
                                            </span>
                                        ))}
                                        {user.permissions.length > 2 && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                +{user.permissions.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {hasPermission('users.edit') && (
                                        <button
                                            onClick={() => {
                                                const newRole = prompt(`New role for ${user.name} (admin, editor, viewer):`) as UserRole;
                                                if (newRole && ['admin', 'editor', 'viewer'].includes(newRole)) {
                                                    try {
                                                        permissionsService.updateUserRole(user.id, newRole);
                                                        if (currentUser) {
                                                            setUsers(permissionsService.getOrganizationUsers(currentUser.organizationId));
                                                        }
                                                    } catch (e) {
                                                        alert(e instanceof Error ? e.message : 'Error');
                                                    }
                                                }
                                            }}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

            <div className="grid gap-6">
                {/* CI/CD Integration */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <GitBranch className="w-5 h-5 text-gray-700" />
                        <h3 className="text-lg font-semibold text-gray-900">CI/CD Integration</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Automatically deploy fine-tuned models to production</p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository</label>
                            <input
                                type="text"
                                placeholder="username/repo"
                                value={cicdConfig?.repository || ''}
                                onChange={(e) => setCicdConfig(prev => prev ? { ...prev, repository: e.target.value } : { provider: 'github-actions', repository: e.target.value } as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                            <input
                                type="text"
                                value={cicdConfig?.branch || 'main'}
                                onChange={(e) => setCicdConfig(prev => prev ? { ...prev, branch: e.target.value } : { provider: 'github-actions', branch: e.target.value } as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="auto-deploy"
                                checked={cicdConfig?.autoDeployOnSuccess || false}
                                onChange={(e) => setCicdConfig(prev => prev ? { ...prev, autoDeployOnSuccess: e.target.checked } : { provider: 'github-actions', autoDeployOnSuccess: e.target.checked } as any)}
                                className="rounded"
                            />
                            <label htmlFor="auto-deploy" className="text-sm text-gray-700">
                                Auto-deploy when model training succeeds
                            </label>
                        </div>
                        <button
                            onClick={() => cicdConfig && handleSaveCICDConfig(cicdConfig)}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                            Save Configuration
                        </button>
                    </div>
                </div>

                {/* Export Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Download className="w-5 h-5 text-gray-700" />
                        <h3 className="text-lg font-semibold text-gray-900">Export & Reports</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Generate and download comprehensive reports</p>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleExportReport('ab-test')}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                        >
                            Export A/B Test Results (PDF)
                        </button>
                        <button
                            onClick={() => handleExportReport('fine-tuning')}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                        >
                            Export Training Metrics (PDF)
                        </button>
                        <button
                            onClick={() => alert('JSON download not implemented in demo')}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                        >
                            Download All Data (JSON)
                        </button>
                        <button
                            onClick={() => handleExportReport('full')}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                        >
                            Generate Full Report (PDF)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Zap className="w-6 h-6 text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-900">AI Optimization Hub</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                                <Users className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-6">
                        {[
                            { id: 'ab-tests', label: 'A/B Tests', icon: TrendingUp },
                            { id: 'fine-tuning', label: 'Fine-tuning', icon: Database },
                            { id: 'webhooks', label: 'Webhooks', icon: Bell },
                            { id: 'users', label: 'Team', icon: Users },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'ab-tests' && renderABTests()}
                {activeTab === 'fine-tuning' && renderFineTuning()}
                {activeTab === 'webhooks' && renderWebhooks()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'settings' && renderSettings()}
            </div>
        </div>
    );
};

export default ABTestingDashboard;
