import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';

// ============================================
// COMPOSANT PRINCIPAL - CLOUD SPACES UPLOAD
// ============================================

export default function CloudSpacesUpload() {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRef = useRef(null);

    // Gestion du drag & drop
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    };

    // Gestion de la sélection de fichiers
    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
    };

    // Ajouter des fichiers à la liste
    const addFiles = (newFiles) => {
        const filesWithMetadata = newFiles.map(file => ({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'pending', // pending, uploading, success, error
            progress: 0,
            preview: null
        }));

        // Générer les previews pour les images
        filesWithMetadata.forEach(fileData => {
            if (fileData.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFiles(prev => prev.map(f =>
                        f.id === fileData.id ? { ...f, preview: e.target.result } : f
                    ));
                };
                reader.readAsDataURL(fileData.file);
            }
        });

        setFiles(prev => [...prev, ...filesWithMetadata]);
    };

    // Supprimer un fichier
    const removeFile = (fileId) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
        });
    };

    // Simuler l'upload d'un fichier
    const uploadFile = async (fileData) => {
        setFiles(prev => prev.map(f =>
            f.id === fileData.id ? { ...f, status: 'uploading' } : f
        ));

        // Simulation de l'upload avec progression
        for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 200));

            setUploadProgress(prev => ({
                ...prev,
                [fileData.id]: progress
            }));

            setFiles(prev => prev.map(f =>
                f.id === fileData.id ? { ...f, progress } : f
            ));
        }

        // Marquer comme succès
        setFiles(prev => prev.map(f =>
            f.id === fileData.id ? { ...f, status: 'success' } : f
        ));
    };

    // Upload tous les fichiers
    const uploadAllFiles = async () => {
        const pendingFiles = files.filter(f => f.status === 'pending');

        for (const fileData of pendingFiles) {
            await uploadFile(fileData);
        }
    };

    // Formater la taille du fichier
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Obtenir l'icône selon le type de fichier
    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return Image;
        if (type.startsWith('text/')) return FileText;
        return File;
    };

    const pendingFilesCount = files.filter(f => f.status === 'pending').length;
    const successFilesCount = files.filter(f => f.status === 'success').length;
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload de fichiers</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Glissez-déposez vos fichiers ou cliquez pour sélectionner
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Fichiers totaux</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{files.length}</p>
                        </div>
                        <File className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Uploadés</p>
                            <p className="text-2xl font-bold text-green-600">{successFilesCount}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Taille totale</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatFileSize(totalSize)}</p>
                        </div>
                        <Upload className="w-8 h-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Zone de Drop */}
            <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer ${isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                        : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                    </div>

                    <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {isDragging ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            ou cliquez pour parcourir
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <span>• Images (PNG, JPG, GIF)</span>
                        <span>• Documents (PDF, DOCX)</span>
                        <span>• Max 50MB par fichier</span>
                    </div>
                </div>
            </div>

            {/* Liste des fichiers */}
            {files.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Fichiers sélectionnés ({files.length})
                        </h3>

                        {pendingFilesCount > 0 && (
                            <button
                                onClick={uploadAllFiles}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Uploader tous ({pendingFilesCount})
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {files.map(fileData => {
                            const FileIcon = getFileIcon(fileData.type);

                            return (
                                <div key={fileData.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                    <div className="flex items-center gap-4">
                                        {/* Preview ou Icône */}
                                        <div className="flex-shrink-0">
                                            {fileData.preview ? (
                                                <img
                                                    src={fileData.preview}
                                                    alt={fileData.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                                    <FileIcon className="w-6 h-6 text-gray-500" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {fileData.name}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {formatFileSize(fileData.size)}
                                            </p>

                                            {/* Barre de progression */}
                                            {fileData.status === 'uploading' && (
                                                <div className="mt-2">
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                                                            style={{ width: `${fileData.progress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">{fileData.progress}%</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-2">
                                            {fileData.status === 'pending' && (
                                                <button
                                                    onClick={() => uploadFile(fileData)}
                                                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg text-blue-600"
                                                >
                                                    <Upload className="w-5 h-5" />
                                                </button>
                                            )}

                                            {fileData.status === 'uploading' && (
                                                <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                                            )}

                                            {fileData.status === 'success' && (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            )}

                                            {fileData.status === 'error' && (
                                                <AlertCircle className="w-5 h-5 text-red-500" />
                                            )}

                                            <button
                                                onClick={() => removeFile(fileData.id)}
                                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Zone vide */}
            {files.length === 0 && (
                <div className="text-center py-12">
                    <File className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Aucun fichier sélectionné. Commencez par uploader des fichiers.
                    </p>
                </div>
            )}
        </div>
    );
}
