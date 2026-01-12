import React, { useState } from 'react';
import { toast } from 'sonner';

export default function HostingRequestForm() {
    const [formData, setFormData] = useState({
        domain: '',
        type: 'shared',
        duration: 12,
        email: '',
        comments: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Demande envoyée avec succès!');
        // Simuler envoi
        console.log(formData);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Formulaire de Demande d'Hébergement</h2>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Domaine</label>
                    <input
                        type="text"
                        value={formData.domain}
                        onChange={e => setFormData({ ...formData, domain: e.target.value })}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Type d'Hébergement</label>
                    <select
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="shared">Partagé</option>
                        <option value="vps">VPS</option>
                        <option value="dedicated">Dédié</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Durée (mois)</label>
                    <input
                        type="number"
                        value={formData.duration}
                        onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
                        min={1}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Commentaires</label>
                    <textarea
                        value={formData.comments}
                        onChange={e => setFormData({ ...formData, comments: e.target.value })}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg h-24 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Envoyer Demande</button>
            </form>
        </div>
    );
}
