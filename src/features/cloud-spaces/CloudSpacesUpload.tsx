import React, { useState, useRef } from 'react';
import { Upload, X, File as FileIcon, Image, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { cn } from '@/lib/utils';

export default function CloudSpacesUpload({ onClose, onUploadComplete }) {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRef = useRef(null);

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

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
    };

    const addFiles = (newFiles) => {
        const validFiles = newFiles.map(file => ({
            file,
            id: Math.random().toString(36).substring(7),
            status: 'pending', // pending, uploading, success, error
            progress: 0
        }));

        setFiles(prev => [...prev, ...validFiles]);
        // Start upload simulation for each file
        validFiles.forEach(fileObj => simulateUpload(fileObj.id));
    };

    const simulateUpload = (fileId) => {
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'uploading' } : f));

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'success', progress: 100 } : f));
                if (onUploadComplete) onUploadComplete();
            } else {
                setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress } : f));
            }
        }, 200);
    };

    const removeFile = (fileId) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return <Image className="w-5 h-5 text-purple-500" />;
        if (type.startsWith('text/') || type.includes('pdf')) return <FileText className="w-5 h-5 text-blue-500" />;
        return <FileIcon className="w-5 h-5 text-gray-500" />;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Upload Files</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-6">
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                            isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                        )}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            onChange={handleFileSelect}
                        />
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400 block" />
                        </div>
                        <p className="text-lg font-medium mb-1">Click or drag files here</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Support JPG, PNG, PDF, Doc (Max 10MB)
                        </p>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-6 space-y-3 max-h-60 overflow-y-auto">
                            {files.map(fileObj => (
                                <div key={fileObj.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    {getFileIcon(fileObj.file.type)}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                                            <span className="text-xs text-gray-500">{(fileObj.file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                        <Progress value={fileObj.progress} className="h-1" />
                                    </div>
                                    <div className="shrink-0">
                                        {fileObj.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                                        {fileObj.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                        {fileObj.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); removeFile(fileObj.id); }} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                                        <X className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <CardContent className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button disabled={files.length === 0 || files.some(f => f.status === 'uploading')}>Done</Button>
                </CardContent>
            </Card>
        </div>
    );
}
