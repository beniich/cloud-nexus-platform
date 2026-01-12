import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/Modal';

export default function ServersManagement() {
    const [servers, setServers] = useState([
        { id: 1, name: 'Server-01', status: 'Actif', cpu: '45%', memory: '60%', disk: '30%' },
        { id: 2, name: 'Server-02', status: 'Inactif', cpu: '0%', memory: '0%', disk: '0%' },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newServer, setNewServer] = useState({ name: '', status: 'Actif' });
    const [editingId, setEditingId] = useState<number | null>(null);

    const addOrUpdateServer = () => {
        if (editingId) {
            setServers(prev => prev.map(s => s.id === editingId ? { ...s, ...newServer } : s) as any);
            toast.success('Serveur mis à jour!');
        } else {
            setServers(prev => [...prev, { id: Date.now(), ...newServer, cpu: '0%', memory: '0%', disk: '0%' }]);
            toast.success('Serveur ajouté!');
        }
        setShowModal(false);
        setNewServer({ name: '', status: 'Actif' });
        setEditingId(null);
    };

    const deleteServer = (id: number) => {
        setServers(prev => prev.filter(s => s.id !== id));
        toast.success('Serveur supprimé!');
    };

    const editServer = (server: any) => {
        setNewServer({ name: server.name, status: server.status });
        setEditingId(server.id);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Serveurs</h2>
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg flex gap-2 hover:bg-blue-600 transition-colors">
                    <Plus className="w-4 h-4" /> Ajouter Serveur
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mémoire</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disque</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {servers.map(server => (
                            <tr key={server.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{server.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${server.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {server.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{server.cpu}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{server.memory}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{server.disk}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => editServer(server)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <Edit2 className="w-4 h-4 text-blue-600" />
                                    </button>
                                    <button onClick={() => deleteServer(server.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Modifier Serveur' : 'Ajouter Serveur'}>
                <input
                    type="text"
                    value={newServer.name}
                    onChange={e => setNewServer({ ...newServer, name: e.target.value })}
                    placeholder="Nom du serveur"
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={newServer.status}
                    onChange={e => setNewServer({ ...newServer, status: e.target.value })}
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>Actif</option>
                    <option>Inactif</option>
                </select>
                <button onClick={addOrUpdateServer} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
            </Modal>
        </div>
    );
}
