import React, { useState, useRef } from 'react';
import { secureFileUpload } from '../services/secureFileUpload';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadedFile {
    file: File;
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress: number;
    url?: string;
    error?: string;
}

export const SecureFileUploader: React.FC<{
    path: string;
    onUploadComplete?: (urls: string[]) => void;
}> = ({ path, onUploadComplete }) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            addFiles(selectedFiles);
        }
    };

    const addFiles = (newFiles: File[]) => {
        const uploadFiles: UploadedFile[] = newFiles.map(file => ({
            file,
            status: 'pending',
            progress: 0,
        }));

        setFiles(prev => [...prev, ...uploadFiles]);

        // Commencer l'upload automatiquement
        uploadFiles.forEach(uf => uploadFile(uf));
    };

    const uploadFile = async (uploadedFile: UploadedFile) => {
        // Mettre à jour le statut
        setFiles(prev =>
            prev.map(f =>
                f.file === uploadedFile.file
                    ? { ...f, status: 'uploading' }
                    : f
            )
        );

        // Configurer le callback de progression
        secureFileUpload.setProgressCallback((progress) => {
            setFiles(prev =>
                prev.map(f =>
                    f.file === uploadedFile.file
                        ? { ...f, progress }
                        : f
                )
            );
        });

        try {
            // Validation
            const validation = await secureFileUpload.validateFile(uploadedFile.file);

            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Upload
            const url = await secureFileUpload.uploadFile(uploadedFile.file, path);

            // Succès
            setFiles(prev =>
                prev.map(f =>
                    f.file === uploadedFile.file
                        ? { ...f, status: 'success', progress: 100, url }
                        : f
                )
            );

            // Trigger OnComplete if all files done (simplified for now)
            if (onUploadComplete) onUploadComplete([url]);

        } catch (error: any) {
            // Erreur
            setFiles(prev =>
                prev.map(f =>
                    f.file === uploadedFile.file
                        ? { ...f, status: 'error', error: error.message }
                        : f
                )
            );
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getStatusIcon = (status: UploadedFile['status']) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <File className="h-5 w-5 text-gray-400" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="w-full">
            {/* Drop Zone */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                    Glissez-déposez vos fichiers ici
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    ou
                </p>
                <Button
                    onClick={() => inputRef.current?.click()}
                    variant="outline"
                >
                    Sélectionner des fichiers
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                />

                {/* Allowed Types */}
                <div className="mt-4 text-xs text-gray-500">
                    <p>Types autorisés: JPG, PNG, GIF, PDF, ZIP, TXT, JSON</p>
                    <p>Taille max: 100 MB par fichier</p>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-6 space-y-3">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                        >
                            {getStatusIcon(file.status)}

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatFileSize(file.file.size)}
                                </p>

                                {file.status === 'uploading' && (
                                    <Progress value={file.progress} className="mt-2" />
                                )}

                                {file.status === 'error' && (
                                    <Alert variant="destructive" className="mt-2">
                                        <AlertDescription className="text-xs">
                                            {file.error}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {file.status === 'success' && (
                                    <p className="text-xs text-green-600 mt-1">
                                        ✓ Upload terminé
                                    </p>
                                )}
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Security Notice */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                    🛡️ Tous les fichiers sont scannés et validés avant upload
                </p>
            </div>
        </div>
    );
};
