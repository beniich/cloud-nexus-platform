import React, { useState } from 'react';
import { Folder, File, MoreVertical, Upload, Search, Grid, List, Download, Share2, Trash2, Cloud, HardDrive, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent } from '@/shared/ui/card';
import CloudSpacesUpload from './CloudSpacesUpload';

export default function CloudSpaces() {
    const [viewMode, setViewMode] = useState('grid');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [currentPath, setCurrentPath] = useState(['Home']);

    // Mock Data
    const [files, setFiles] = useState([
        { id: 1, name: 'Documents', type: 'folder', items: 12, modified: '2025-01-10' },
        { id: 2, name: 'Images', type: 'folder', items: 254, modified: '2025-01-12' },
        { id: 3, name: 'Project-Specs.pdf', type: 'file', size: '2.4 MB', modified: '2025-01-14' },
        { id: 4, name: 'dashboard-design.fig', type: 'file', size: '15 MB', modified: '2025-01-14' },
        { id: 5, name: 'budget_2025.xlsx', type: 'file', size: '1.2 MB', modified: '2025-01-13' },
    ]);

    const handleUploadComplete = () => {
        setShowUploadModal(false);
        // Refresh list logic here
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cloud Spaces</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Stockage et gestion de fichiers sécurisés
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => setShowUploadModal(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Files
                    </Button>
                    <Button variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        New Folder
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <Cloud className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded">Pro Plan</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">245.5 GB</h3>
                        <p className="text-blue-100 text-sm">Utilisés sur 1 TB</p>
                        <div className="mt-4 h-2 bg-black/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-[24%]" />
                        </div>
                    </CardContent>
                </Card>
                {/* Add more stats if needed */}
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {currentPath.map((folder, index) => (
                        <React.Fragment key={folder}>
                            <span className="hover:text-blue-600 cursor-pointer">{folder}</span>
                            {index < currentPath.length - 1 && <span>/</span>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Rechercher..." className="pl-9" />
                    </div>
                    <div className="flex items-center gap-1 border-l pl-4 dark:border-gray-700">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Files Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {files.map(file => (
                        <div key={file.id} className="group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${file.type === 'folder' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {file.type === 'folder' ? <Folder className="w-6 h-6" /> : <File className="w-6 h-6" />}
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">{file.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                                {file.type === 'folder' ? `${file.items} items` : file.size}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Taille</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Modifié le</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {files.map(file => (
                                <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 icon-trigger">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        {file.type === 'folder' ? <Folder className="w-5 h-5 text-amber-500" /> : <File className="w-5 h-5 text-blue-500" />}
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{file.type === 'folder' ? '-' : file.size}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{file.modified}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showUploadModal && (
                <CloudSpacesUpload
                    onClose={() => setShowUploadModal(false)}
                    onUploadComplete={handleUploadComplete}
                />
            )}
        </div>
    );
}
