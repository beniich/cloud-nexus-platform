import { useState, useEffect } from 'react';

export interface CloudFile {
    id: string;
    name: string;
    type: 'folder' | 'file';
    size: string;
    modified: string;
    path: string;
}

export interface CloudSpacesStats {
    totalFiles: number;
    totalFolders: number;
    storageUsed: string;
    storageTotal: string;
    storagePercentage: number;
}

const MOCK_FILES: CloudFile[] = [
    { id: '1', name: 'documents/', type: 'folder', size: '-', modified: '2025-01-10', path: '/documents' },
    { id: '2', name: 'images/', type: 'folder', size: '-', modified: '2025-01-11', path: '/images' },
    { id: '3', name: 'videos/', type: 'folder', size: '-', modified: '2025-01-09', path: '/videos' },
    { id: '4', name: 'report.pdf', type: 'file', size: '2.4 MB', modified: '2025-01-12', path: '/report.pdf' },
    { id: '5', name: 'data.json', type: 'file', size: '145 KB', modified: '2025-01-12', path: '/data.json' },
    { id: '6', name: 'presentation.pptx', type: 'file', size: '8.7 MB', modified: '2025-01-11', path: '/presentation.pptx' },
];

export function useCloudSpaces() {
    const [files, setFiles] = useState<CloudFile[]>(MOCK_FILES);
    const [currentPath, setCurrentPath] = useState('/');
    const [loading, setLoading] = useState(false);

    const stats: CloudSpacesStats = {
        totalFiles: files.filter(f => f.type === 'file').length,
        totalFolders: files.filter(f => f.type === 'folder').length,
        storageUsed: '45.2 GB',
        storageTotal: '100 GB',
        storagePercentage: 45.2,
    };

    const uploadFile = async (file: File) => {
        setLoading(true);
        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newFile: CloudFile = {
            id: Date.now().toString(),
            name: file.name,
            type: 'file',
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            modified: new Date().toISOString().split('T')[0],
            path: `${currentPath}${file.name}`,
        };

        setFiles(prev => [...prev, newFile]);
        setLoading(false);
        return newFile;
    };

    const deleteFile = async (fileId: string) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setFiles(prev => prev.filter(f => f.id !== fileId));
        setLoading(false);
    };

    const createFolder = async (folderName: string) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const newFolder: CloudFile = {
            id: Date.now().toString(),
            name: `${folderName}/`,
            type: 'folder',
            size: '-',
            modified: new Date().toISOString().split('T')[0],
            path: `${currentPath}${folderName}`,
        };

        setFiles(prev => [...prev, newFolder]);
        setLoading(false);
        return newFolder;
    };

    const navigateToFolder = (folderPath: string) => {
        setCurrentPath(folderPath);
    };

    return {
        files,
        currentPath,
        loading,
        stats,
        uploadFile,
        deleteFile,
        createFolder,
        navigateToFolder,
    };
}
