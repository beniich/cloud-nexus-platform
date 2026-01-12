import React, { useState } from 'react';
import { Database, Upload, FileText, HardDrive, Eye, Download, Trash2, FolderPlus, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import Dropzone from 'react-dropzone';
import { Modal } from '@/components/ui/Modal';

export default function CloudSpacesBrowser() {
    const [files, setFiles] = useState([
        { id: 1, name: 'documents/', type: 'folder', size: '-', modified: '2025-01-10', preview: null as string | null },
        { id: 2, name: 'images/', type: 'folder', size: '-', modified: '2025-01-11', preview: null as string | null },
        { id: 3, name: 'report.pdf', type: 'file', size: '2.4 MB', modified: '2025-01-12', preview: null as string | null },
        { id: 4, name: 'data.json', type: 'file', size: '145 KB', modified: '2025-01-12', preview: null as string | null }
    ]);
    const [currentPath, setCurrentPath] = useState('/');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                setFiles(prev => [...prev, {
                    id: Date.now(),
                    name: file.name,
                    type: 'file',
                    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                    modified: new Date().toISOString().split('T')[0],
                    preview: file.type.startsWith('image/') ? (reader.result as string) : null
                }]);
                toast.success(`Fichier ${file.name} uploadé avec succès!`);
            };
            reader.readAsDataURL(file);
        });
    };

    const createFolder = () => {
        if (newFolderName) {
            setFiles(prev => [...prev, {
                id: Date.now(),
                name: `${newFolderName}/`,
                type: 'folder',
                size: '-',
                modified: new Date().toISOString().split('T')[0],
                preview: null
            }]);
            setNewFolderName('');
            setShowCreateModal(false);
            toast.success('Dossier créé avec succès!');
        }
    };

    const deleteItem = (id: number) => {
        setFiles(prev => prev.filter(f => f.id !== id));
        toast.success('Élément supprimé!');
    };

    const shareItem = (id: number) => {
        const file = files.find(f => f.id === id);
        if (file) {
            const url = `https://example.com/share/${file.name}`; // Simuler presigned URL
            navigator.clipboard.writeText(url);
            toast.success('Lien de partage copié!');
        }
    };

    const previewItem = (file: any) => {
        if (file.preview) {
            setSelectedFile(file.preview);
            setShowPreview(true);
        }
    };

    const filteredFiles = files
        .filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            return 0;
        });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cloud Spaces</h2>
                    <p className="text-gray-600 dark:text-gray-400">Gérez vos fichiers cloud</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors">
                        <FolderPlus className="w-4 h-4" />
                        Nouveau Dossier
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Uploader
                    </button>
                </div>
            </div>
            {/* Recherche */}
            <input
                type="text"
                placeholder="Rechercher des fichiers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Database className="w-4 h-4" />
                    <span className="font-medium">{currentPath}</span>
                </div>
            </div>
            {/* Dropzone pour upload */}
            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-all bg-gray-50 dark:bg-gray-800/50">
                        <input {...getInputProps()} />
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Glissez des fichiers ici ou cliquez pour uploader</p>
                    </div>
                )}
            </Dropzone>
            {/* File List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none" onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>Nom</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taille</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modifié</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredFiles.map((file) => (
                            <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    {file.type === 'folder' ? (
                                        <HardDrive className="w-5 h-5 text-blue-500" />
                                    ) : (
                                        <FileText className="w-5 h-5 text-gray-500" />
                                    )}
                                    <span className="font-medium text-gray-900 dark:text-white">{file.name}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{file.size}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{file.modified}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {file.preview && (
                                            <button onClick={() => previewItem(file)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                                <Eye className="w-4 h-4 text-gray-600" />
                                            </button>
                                        )}
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                            <Download className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button onClick={() => shareItem(file.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                            <Share2 className="w-4 h-4 text-green-600" />
                                        </button>
                                        <button onClick={() => deleteItem(file.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Modal Créer Dossier */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Créer un Nouveau Dossier">
                <input
                    type="text"
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    placeholder="Nom du dossier"
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button onClick={createFolder} className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Créer</button>
            </Modal>
            {/* Modal Preview */}
            <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Prévisualisation">
                {selectedFile && <img src={selectedFile} alt="preview" className="w-full rounded-lg" />}
            </Modal>
        </div>
    );
}
