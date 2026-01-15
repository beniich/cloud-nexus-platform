import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, MoreVertical, Edit, Trash2, UserCheck, UserX, Mail, Phone, MapPin, Calendar, Shield, Eye, Lock, CheckCircle, XCircle, Clock } from 'lucide-react';

// ============================================
// DONNÉES INITIALES
// ============================================

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: 'active' | 'inactive' | 'pending';
    avatar: string | null;
    location: string;
    company: string;
    department: string;
    joinedAt: string;
    lastLogin: string;
    permissions: string[];
}

const INITIAL_USERS: UserData[] = [
    {
        id: 'user-001',
        name: 'Mohamed Alami',
        email: 'mohamed.alami@example.com',
        phone: '+212 6 12 34 56 78',
        role: 'super_admin',
        status: 'active',
        avatar: null,
        location: 'Casablanca, Maroc',
        company: 'Tech Solutions',
        department: 'IT',
        joinedAt: '2024-01-15',
        lastLogin: '2025-01-12 10:30',
        permissions: ['all']
    },
    {
        id: 'user-002',
        name: 'Fatima Zahra',
        email: 'fatima.zahra@example.com',
        phone: '+212 6 98 76 54 32',
        role: 'admin',
        status: 'active',
        avatar: null,
        location: 'Rabat, Maroc',
        company: 'Tech Solutions',
        department: 'Management',
        joinedAt: '2024-02-20',
        lastLogin: '2025-01-12 09:15',
        permissions: ['users', 'servers', 'analytics']
    },
    {
        id: 'user-003',
        name: 'Youssef Benjelloun',
        email: 'youssef.b@example.com',
        phone: '+212 6 55 44 33 22',
        role: 'manager',
        status: 'active',
        avatar: null,
        location: 'Marrakech, Maroc',
        company: 'Digital Agency',
        department: 'Marketing',
        joinedAt: '2024-03-10',
        lastLogin: '2025-01-11 18:45',
        permissions: ['products', 'analytics']
    },
    {
        id: 'user-004',
        name: 'Amina Rachidi',
        email: 'amina.rachidi@example.com',
        phone: '+212 6 11 22 33 44',
        role: 'user',
        status: 'active',
        avatar: null,
        location: 'Fès, Maroc',
        company: 'StartupHub',
        department: 'Design',
        joinedAt: '2024-04-05',
        lastLogin: '2025-01-10 14:20',
        permissions: ['dashboard']
    },
    {
        id: 'user-005',
        name: 'Hassan Idrissi',
        email: 'hassan.idrissi@example.com',
        phone: '+212 6 77 88 99 00',
        role: 'user',
        status: 'inactive',
        avatar: null,
        location: 'Tanger, Maroc',
        company: 'WebCorp',
        department: 'Sales',
        joinedAt: '2024-05-12',
        lastLogin: '2024-12-28 11:00',
        permissions: ['dashboard']
    }
];

const ROLES = [
    { value: 'super_admin', label: 'Super Admin', color: 'purple' },
    { value: 'admin', label: 'Admin', color: 'blue' },
    { value: 'manager', label: 'Manager', color: 'green' },
    { value: 'user', label: 'User', color: 'gray' },
    { value: 'client', label: 'Client', color: 'orange' }
];

const DEPARTMENTS = ['IT', 'Management', 'Marketing', 'Design', 'Sales', 'Support', 'Finance', 'HR'];

const PERMISSIONS = [
    { id: 'all', label: 'Tous les accès' },
    { id: 'users', label: 'Gestion utilisateurs' },
    { id: 'servers', label: 'Gestion serveurs' },
    { id: 'products', label: 'Gestion produits' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Paramètres' },
    { id: 'dashboard', label: 'Dashboard' }
];

// ============================================
// COMPOSANTS
// ============================================

interface UserCardProps {
    user: UserData;
    onAction: (action: string, user: UserData) => void;
}

function UserCard({ user, onAction }: UserCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    // Fallback safe search for role
    const roleConfig = ROLES.find(r => r.value === user.role) || ROLES[3];

    const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
        active: { color: 'green', icon: CheckCircle, label: 'Actif' },
        inactive: { color: 'red', icon: XCircle, label: 'Inactif' },
        pending: { color: 'yellow', icon: Clock, label: 'En attente' }
    };
    const status = statusConfig[user.status] || statusConfig.active;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                            <button
                                onClick={() => { onAction('view', user); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                Voir détails
                            </button>
                            <button
                                onClick={() => { onAction('edit', user); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Modifier
                            </button>
                            <button
                                onClick={() => { onAction(user.status === 'active' ? 'deactivate' : 'activate', user); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                {user.status === 'active' ? 'Désactiver' : 'Activer'}
                            </button>
                            <button
                                onClick={() => { onAction('reset-password', user); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <Lock className="w-4 h-4" />
                                Réinitialiser MDP
                            </button>
                            <button
                                onClick={() => { onAction('delete', user); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Status & Role */}
            <div className="flex items-center gap-2 mb-4">
                <status.icon className={`w-4 h-4 text-${status.color}-600`} />
                <span className={`text-sm font-medium text-${status.color}-600`}>{status.label}</span>
                <span className="text-gray-400">•</span>
                <span className={`px-2 py-0.5 bg-${roleConfig.color}-100 dark:bg-${roleConfig.color}-900 text-${roleConfig.color}-700 dark:text-${roleConfig.color}-300 text-xs rounded-full`}>
                    {roleConfig.label}
                </span>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>{user.department}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Inscrit le {new Date(user.joinedAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div>
                    Connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                </div>
            </div>
        </div>
    );
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<UserData>) => void;
    user?: UserData | null;
}

function UserModal({ isOpen, onClose, onSubmit, user = null }: UserModalProps) {
    const [formData, setFormData] = useState<Partial<UserData>>({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active',
        location: '',
        company: '',
        department: 'IT',
        permissions: []
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'user',
                status: 'active',
                location: '',
                company: '',
                department: 'IT',
                permissions: []
            });
        }
    }, [user]);

    const handleSubmit = () => {
        if (!formData.name || !formData.email) {
            alert('Le nom et l\'email sont requis');
            return;
        }
        onSubmit(formData);
        onClose();
    };

    const togglePermission = (permId: string) => {
        if (permId === 'all') {
            setFormData(prev => ({
                ...prev,
                permissions: prev.permissions?.includes('all') ? [] : ['all']
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                permissions: prev.permissions?.includes(permId)
                    ? prev.permissions.filter(p => p !== permId)
                    : [...(prev.permissions?.filter(p => p !== 'all') || []), permId]
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Informations personnelles */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Informations personnelles
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nom complet *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="ex: Mohamed Alami"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="+212 6 12 34 56 78"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Localisation
                                </label>
                                <input
                                    type="text"
                                    value={formData.location || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Casablanca, Maroc"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informations professionnelles */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Informations professionnelles
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Entreprise
                                </label>
                                <input
                                    type="text"
                                    value={formData.company || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Tech Solutions"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Département
                                </label>
                                <select
                                    value={formData.department || 'IT'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    {DEPARTMENTS.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Rôle et Statut */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Rôle et Statut
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Rôle
                                </label>
                                <select
                                    value={formData.role || 'user'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    {ROLES.map(role => (
                                        <option key={role.value} value={role.value}>{role.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Statut
                                </label>
                                <select
                                    value={formData.status || 'active'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as UserData['status'] }))}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="active">Actif</option>
                                    <option value="inactive">Inactif</option>
                                    <option value="pending">En attente</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Permissions */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Permissions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {PERMISSIONS.map(perm => (
                                <label
                                    key={perm.id}
                                    className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions?.includes(perm.id) || false}
                                        onChange={() => togglePermission(perm.id)}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{perm.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            {user ? 'Mettre à jour' : 'Créer l\'utilisateur'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function UsersManagement() {
    const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery);
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleUserAction = (action: string, user: UserData) => {
        switch (action) {
            case 'view':
                console.log('View user:', user);
                break;
            case 'edit':
                setEditingUser(user);
                setShowModal(true);
                break;
            case 'activate':
                setUsers(prev => prev.map(u =>
                    u.id === user.id ? { ...u, status: 'active' } : u
                ));
                break;
            case 'deactivate':
                setUsers(prev => prev.map(u =>
                    u.id === user.id ? { ...u, status: 'inactive' } : u
                ));
                break;
            case 'reset-password':
                alert(`Email de réinitialisation envoyé à ${user.email}`);
                break;
            case 'delete':
                if (confirm(`Supprimer l'utilisateur ${user.name} ?`)) {
                    setUsers(prev => prev.filter(u => u.id !== user.id));
                }
                break;
        }
    };

    const handleSubmitUser = (formData: Partial<UserData>) => {
        if (editingUser) {
            setUsers(prev => prev.map(u =>
                u.id === editingUser.id ? { ...editingUser, ...formData } as UserData : u
            ));
        } else {
            const newUser: UserData = {
                id: `user-${Date.now()}`,
                name: formData.name!,
                email: formData.email!,
                phone: formData.phone || '',
                role: formData.role || 'user',
                status: (formData.status || 'active') as UserData['status'],
                avatar: null,
                location: formData.location || '',
                company: formData.company || '',
                department: formData.department || '',
                joinedAt: new Date().toISOString().split('T')[0],
                lastLogin: new Date().toISOString().slice(0, 16).replace('T', ' '),
                permissions: formData.permissions || []
            };
            setUsers(prev => [...prev, newUser]);
        }
        setEditingUser(null);
    };

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        admins: users.filter(u => ['super_admin', 'admin'].includes(u.role)).length
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Utilisateurs</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Gérez les utilisateurs et leurs permissions
                    </p>
                </div>
                <button
                    onClick={() => { setEditingUser(null); setShowModal(true); }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nouvel utilisateur
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Utilisateurs</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                        <Users className="w-10 h-10 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
                            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <UserCheck className="w-10 h-10 text-green-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Inactifs</p>
                            <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
                        </div>
                        <UserX className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Administrateurs</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.admins}</p>
                        </div>
                        <Shield className="w-10 h-10 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email ou téléphone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">Tous les rôles</option>
                        {ROLES.map(role => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
                        <option value="inactive">Inactifs</option>
                        <option value="pending">En attente</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(user => (
                    <UserCard
                        key={user.id}
                        user={user}
                        onAction={handleUserAction}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Aucun utilisateur trouvé
                    </p>
                </div>
            )}

            {/* User Modal */}
            <UserModal
                isOpen={showModal}
                onClose={() => { setShowModal(false); setEditingUser(null); }}
                onSubmit={handleSubmitUser}
                user={editingUser}
            />
        </div>
    );
}
