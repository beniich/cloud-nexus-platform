import { useState } from 'react';
import { Upload, Download, Trash2, Eye, HardDrive, FileText, Database, FolderPlus, Search } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { useCloudSpaces } from '@/hooks/useCloudSpaces';
import { toast } from 'sonner';

export default function CloudSpacesBrowser() {
    const { files, currentPath, loading, uploadFile, deleteFile, createFolder } = useCloudSpaces();
    const [searchQuery, setSearchQuery] = useState('');
    const [showUploadDialog, setShowUploadDialog] = useState(false);

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            await uploadFile(file);
            toast.success(`Fichier "${file.name}" uploadé avec succès`);
            setShowUploadDialog(false);
        } catch (error) {
            toast.error('Erreur lors de l\'upload du fichier');
        }
    };

    const handleDelete = async (fileId: string, fileName: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${fileName}" ?`)) return;

        try {
            await deleteFile(fileId);
            toast.success(`"${fileName}" supprimé avec succès`);
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleCreateFolder = async () => {
        const folderName = prompt('Nom du nouveau dossier :');
        if (!folderName) return;

        try {
            await createFolder(folderName);
            toast.success(`Dossier "${folderName}" créé avec succès`);
        } catch (error) {
            toast.error('Erreur lors de la création du dossier');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cloud Spaces</h2>
                    <p className="text-gray-600 dark:text-gray-400">Gérez vos fichiers cloud</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleCreateFolder} variant="outline">
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Nouveau dossier
                    </Button>
                    <label htmlFor="file-upload">
                        <Button className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Uploader
                        </Button>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </label>
                </div>
            </div>

            {/* Search and Breadcrumb */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Database className="w-4 h-4" />
                            <span className="font-medium">{currentPath}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher des fichiers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* File List */}
            <Card>
                <CardHeader>
                    <CardTitle>Fichiers et dossiers</CardTitle>
                    <CardDescription>
                        {filteredFiles.length} élément(s) trouvé(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taille</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modifié</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredFiles.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            Aucun fichier trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    filteredFiles.map((file) => (
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
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="w-4 h-4 text-gray-600" />
                                                    </Button>
                                                    {file.type === 'file' && (
                                                        <Button variant="ghost" size="sm">
                                                            <Download className="w-4 h-4 text-blue-600" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(file.id, file.name)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                        <p className="mt-4 text-center">Chargement...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
