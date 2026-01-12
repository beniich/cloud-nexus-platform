import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export default function UsersManagement() {
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'Actif' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'Inactif' },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user', status: 'Actif' });
    const [editingId, setEditingId] = useState<number | null>(null);

    const addOrUpdateUser = () => {
        if (editingId) {
            setUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...newUser } : u) as any);
            toast.success('Utilisateur mis à jour!');
        } else {
            setUsers(prev => [...prev, { id: Date.now(), ...newUser }]);
            toast.success('Utilisateur ajouté!');
        }
        setShowModal(false);
        setNewUser({ name: '', email: '', role: 'user', status: 'Actif' });
        setEditingId(null);
    };

    const deleteUser = (id: number) => {
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success('Utilisateur supprimé!');
    };

    const editUser = (user: any) => {
        setNewUser({ name: user.name, email: user.email, role: user.role, status: user.status });
        setEditingId(user.id);
        setShowModal(true);
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(users);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');
        XLSX.writeFile(wb, 'users.xlsx');
        toast.success('Exporté vers Excel!');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Liste des Utilisateurs', 10, 10);
        users.forEach((user, idx) => {
            doc.text(`${user.name} - ${user.email} - ${user.role}`, 10, 20 + (idx * 10));
        });
        doc.save('users.pdf');
        toast.success('Exporté vers PDF!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Utilisateurs</h2>
                <div className="flex gap-2">
                    <button onClick={exportToExcel} className="px-4 py-2 bg-green-500 text-white rounded-lg flex gap-2 hover:bg-green-600 transition-colors">
                        <Download className="w-4 h-4" /> Excel
                    </button>
                    <button onClick={exportToPDF} className="px-4 py-2 bg-red-500 text-white rounded-lg flex gap-2 hover:bg-red-600 transition-colors">
                        <Download className="w-4 h-4" /> PDF
                    </button>
                    <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg flex gap-2 hover:bg-blue-600 transition-colors">
                        <Plus className="w-4 h-4" /> Ajouter Utilisateur
                    </button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => editUser(user)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <Edit2 className="w-4 h-4 text-blue-600" />
                                    </button>
                                    <button onClick={() => deleteUser(user.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}>
                <input
                    type="text"
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Nom"
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="email"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Email"
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="owner">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="seller">Manager</option>
                    <option value="client">Client</option>
                </select>
                <select
                    value={newUser.status}
                    onChange={e => setNewUser({ ...newUser, status: e.target.value })}
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>Actif</option>
                    <option>Inactif</option>
                </select>
                <button onClick={addOrUpdateUser} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
            </Modal>
        </div>
    );
}
