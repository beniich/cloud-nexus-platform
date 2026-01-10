import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, Eye, Code, FileText, Layout, Settings, Search, Filter, Calendar, Tag, Users, Globe, Sparkles, Zap, Download, Copy, Upload, X, Image, Film, File, Check } from 'lucide-react';

// IndexedDB avec Dexie-like simple implementation
class SimpleDB {
    dbName: string;
    db: IDBDatabase | null;

    constructor(dbName: string) {
        this.dbName = dbName;
        this.db = null;
    }

    async init(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains('contents')) {
                    db.createObjectStore('contents', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('contentTypes')) {
                    db.createObjectStore('contentTypes', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('media')) {
                    db.createObjectStore('media', { keyPath: 'id' });
                }
            };
        });
    }

    async getAll(storeName: string): Promise<any[]> {
        if (!this.db) throw new Error("Database not initialized");
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async get(storeName: string, id: string): Promise<any> {
        if (!this.db) throw new Error("Database not initialized");
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async put(storeName: string, data: any): Promise<any> {
        if (!this.db) throw new Error("Database not initialized");
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.put(data);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName: string, id: string): Promise<void> {
        if (!this.db) throw new Error("Database not initialized");
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve(undefined);
            request.onerror = () => reject(request.error);
        });
    }
}

// API REST locale
class LocalAPI {
    db: SimpleDB;

    constructor(db: SimpleDB) {
        this.db = db;
    }

    async get(contentType?: string | null, filters: any = {}) {
        const allContents = await this.db.getAll('contents');
        let filtered = contentType ? allContents.filter(c => c.contentType === contentType) : allContents;

        if (filters.status) {
            filtered = filtered.filter(c => c.status === filters.status);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(c =>
                c.title?.toLowerCase().includes(search) ||
                c.body?.toLowerCase().includes(search)
            );
        }

        return filtered;
    }

    async getById(id: string) {
        return await this.db.get('contents', id);
    }

    async post(data) {
        const newContent = {
            id: `content_${Date.now()}`,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await this.db.put('contents', newContent);
        return newContent;
    }

    async put(id, data) {
        const existing = await this.db.get('contents', id);
        const updated = {
            ...existing,
            ...data,
            id,
            updatedAt: new Date().toISOString()
        };
        await this.db.put('contents', updated);
        return updated;
    }

    async deleteContent(id) {
        await this.db.delete('contents', id);
        return { deleted: true };
    }
}

const HeadlessCMS = () => {
    const [db, setDb] = useState<SimpleDB | null>(null);
    const [api, setApi] = useState<LocalAPI | null>(null);
    const [activeView, setActiveView] = useState('dashboard');
    const [contents, setContents] = useState<any[]>([]);
    const [contentTypes, setContentTypes] = useState<any[]>([]);
    const [media, setMedia] = useState<any[]>([]);
    const [selectedContent, setSelectedContent] = useState<any | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [generationType, setGenerationType] = useState('dashboard');

    // Content Type Editor
    const [editingType, setEditingType] = useState<string | null>(null);
    const [typeFormData, setTypeFormData] = useState<any>({
        id: '',
        name: '',
        fields: []
    });

    // Media uploader
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [uploadingMedia, setUploadingMedia] = useState(false);

    // Dynamic form data
    const [formData, setFormData] = useState<any>({});

    // Types de contenu par défaut
    const defaultContentTypes = [
        {
            id: 'article',
            name: 'Article',
            fields: [
                { name: 'title', label: 'Titre', type: 'text', required: true },
                { name: 'slug', label: 'Slug', type: 'text', required: true },
                { name: 'excerpt', label: 'Extrait', type: 'textarea', required: false },
                { name: 'body', label: 'Contenu', type: 'richtext', required: true },
                { name: 'featuredImage', label: 'Image à la une', type: 'media', required: false },
                { name: 'author', label: 'Auteur', type: 'text', required: true },
                { name: 'publishDate', label: 'Date de publication', type: 'date', required: true },
                { name: 'category', label: 'Catégorie', type: 'select', options: ['Tech', 'Business', 'Lifestyle', 'News'], required: true },
                { name: 'published', label: 'Publié', type: 'boolean', required: false }
            ]
        },
        {
            id: 'page',
            name: 'Page',
            fields: [
                { name: 'title', label: 'Titre', type: 'text', required: true },
                { name: 'slug', label: 'Slug', type: 'text', required: true },
                { name: 'body', label: 'Contenu', type: 'richtext', required: true },
                { name: 'template', label: 'Template', type: 'select', options: ['Default', 'Landing', 'Contact'], required: true },
                { name: 'seo', label: 'SEO Meta', type: 'json', required: false }
            ]
        },
        {
            id: 'product',
            name: 'Produit',
            fields: [
                { name: 'name', label: 'Nom', type: 'text', required: true },
                { name: 'slug', label: 'Slug', type: 'text', required: true },
                { name: 'description', label: 'Description', type: 'textarea', required: true },
                { name: 'price', label: 'Prix', type: 'number', required: true },
                { name: 'sku', label: 'SKU', type: 'text', required: true },
                { name: 'stock', label: 'Stock', type: 'number', required: true },
                { name: 'images', label: 'Images', type: 'media', required: false },
                { name: 'inStock', label: 'En stock', type: 'boolean', required: false }
            ]
        }
    ];

    // Initialiser IndexedDB
    useEffect(() => {
        const initDB = async () => {
            const database = new SimpleDB('headlessCMS');
            await database.init();
            setDb(database);

            const localApi = new LocalAPI(database);
            setApi(localApi);

            await loadData(database);
        };
        initDB();
    }, []);

    const loadData = async (database: SimpleDB) => {
        setLoading(true);
        const loadedContents = await database.getAll('contents') as any[];
        const loadedTypes = await database.getAll('contentTypes') as any[];
        const loadedMedia = await database.getAll('media') as any[];

        setContents(loadedContents || []);

        if (loadedTypes.length === 0) {
            for (const type of defaultContentTypes) {
                await database.put('contentTypes', type);
            }
            setContentTypes(defaultContentTypes);
        } else {
            setContentTypes(loadedTypes);
        }

        setMedia(loadedMedia || []);
        setLoading(false);
    };

    // Générer avec l'IA
    const generateWithAI = async () => {
        if (!aiPrompt.trim()) {
            alert('Veuillez entrer une description');
            return;
        }

        setAiGenerating(true);
        setGeneratedCode('');

        try {
            const systemPrompt = generationType === 'dashboard'
                ? `Tu es un expert en développement web React. Génère un dashboard complet et fonctionnel en React avec Tailwind CSS basé sur la description de l'utilisateur. Le code doit:
- Être un composant React fonctionnel autonome
- Utiliser uniquement les classes Tailwind core (pas de custom)
- Inclure des graphiques avec recharts si nécessaire: import { LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
- Utiliser lucide-react pour les icônes: import { IconName } from 'lucide-react'
- Être responsive et moderne
- Inclure des données de démonstration réalistes
- Avoir une interface utilisateur intuitive et professionnelle
- Utiliser useState pour la gestion d'état si nécessaire: import { useState } from 'react'

Retourne UNIQUEMENT le code React complet, sans explications.`
                : `Tu es un expert en développement web React. Génère une page web complète et fonctionnelle en React avec Tailwind CSS basée sur la description de l'utilisateur. Le code doit:
- Être un composant React fonctionnel autonome
- Utiliser uniquement les classes Tailwind core (pas de custom)
- Utiliser lucide-react pour les icônes: import { IconName } from 'lucide-react'
- Être responsive et moderne avec des animations subtiles
- Inclure tous les éléments demandés (header, hero, sections, footer, etc.)
- Avoir une interface utilisateur professionnelle et attrayante
- Utiliser useState pour les interactions si nécessaire: import { useState } from 'react'
- Inclure des call-to-action et une navigation claire

Retourne UNIQUEMENT le code React complet, sans explications.`;

            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 4000,
                    messages: [
                        {
                            role: 'user',
                            content: `${systemPrompt}

Description: ${aiPrompt}`
                        }
                    ]
                })
            });

            const data = await response.json();
            const code = data.content
                .filter((item: any) => item.type === 'text')
                .map((item: any) => item.text)
                .join('\n');

            const cleanCode = code.replace(/```(?:jsx|javascript|react)?\n?/g, '').replace(/```\n?$/g, '').trim();
            setGeneratedCode(cleanCode);
        } catch (error) {
            console.error('Erreur génération IA:', error);
            alert('Erreur lors de la génération. Veuillez réessayer.');
        } finally {
            setAiGenerating(false);
        }
    };

    // Upload média
    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setUploadingMedia(true);

        for (const file of files) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (!event.target?.result || !db) return;
                const base64 = event.target.result;
                const mediaItem = {
                    id: `media_${Date.now()}_${Math.random()}`,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: base64,
                    createdAt: new Date().toISOString()
                };

                await db.put('media', mediaItem);
                setMedia(prev => [...prev, mediaItem]);
            };
            reader.readAsDataURL(file);
        }

        setUploadingMedia(false);
    };

    // Supprimer média
    const deleteMedia = async (id: string) => {
        if (!db) return;
        if (confirm('Supprimer ce média ?')) {
            await db.delete('media', id);
            setMedia(prev => prev.filter(m => m.id !== id));
        }
    };

    // CRUD Content Types
    const saveContentType = async () => {
        if (!db) return;
        if (!typeFormData.id || !typeFormData.name || typeFormData.fields.length === 0) {
            alert('Veuillez remplir tous les champs requis');
            return;
        }

        await db.put('contentTypes', typeFormData);
        setContentTypes(prev => {
            const index = prev.findIndex(t => t.id === typeFormData.id);
            if (index >= 0) {
                const updated = [...prev];
                updated[index] = typeFormData;
                return updated;
            }
            return [...prev, typeFormData];
        });

        resetTypeForm();
        setActiveView('types');
    };

    const deleteContentType = async (id: string) => {
        if (!db) return;
        if (confirm('Supprimer ce type de contenu ? Les contenus associés ne seront pas supprimés.')) {
            await db.delete('contentTypes', id);
            setContentTypes(prev => prev.filter(t => t.id !== id));
        }
    };

    const editContentType = (type: any) => {
        setTypeFormData(JSON.parse(JSON.stringify(type)));
        setEditingType(type.id);
        setActiveView('type-editor');
    };

    const resetTypeForm = () => {
        setTypeFormData({
            id: '',
            name: '',
            fields: []
        });
        setEditingType(null);
    };

    const addField = () => {
        setTypeFormData((prev: any) => ({
            ...prev,
            fields: [...prev.fields, { name: '', label: '', type: 'text', required: false }]
        }));
    };

    const updateField = (index: number, key: string, value: any) => {
        setTypeFormData((prev: any) => {
            const fields = [...prev.fields];
            fields[index] = { ...fields[index], [key]: value };
            return { ...prev, fields };
        });
    };

    const removeField = (index: number) => {
        setTypeFormData((prev: any) => ({
            ...prev,
            fields: prev.fields.filter((_: any, i: number) => i !== index)
        }));
    };

    // CRUD Contenus
    const saveContent = async () => {
        if (!api || !db) return;
        const selectedType = contentTypes.find(t => t.id === formData.contentType);
        if (!selectedType) {
            alert('Sélectionnez un type de contenu');
            return;
        }

        // Validation
        const missingFields = selectedType.fields
            .filter((f: any) => f.required && !formData[f.name])
            .map((f: any) => f.label);

        if (missingFields.length > 0) {
            alert(`Champs requis manquants: ${missingFields.join(', ')}`);
            return;
        }

        if (editMode && selectedContent) {
            await api.put(selectedContent.id, formData);
        } else {
            await api.post(formData);
        }

        const updatedContents = await db.getAll('contents') as any[];
        setContents(updatedContents);
        resetForm();
        setActiveView('contents');
    };

    const deleteContent = async (id: string) => {
        if (!api) return;
        if (confirm('Supprimer ce contenu ?')) {
            await api.deleteContent(id);
            setContents(prev => prev.filter(c => c.id !== id));
        }
    };

    const editContent = (content: any) => {
        setFormData(content);
        setSelectedContent(content);
        setEditMode(true);
        setActiveView('editor');
    };

    const resetForm = () => {
        setFormData({});
        setEditMode(false);
        setSelectedContent(null);
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    // Render dynamic field
    const renderField = (field: any) => {
        const value = formData[field.name] || '';

        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setFormData((prev: any) => ({ ...prev, [field.name]: newValue }));
                            if (field.name === 'title' && !editMode) {
                                setFormData((prev: any) => ({ ...prev, slug: generateSlug(newValue) }));
                            }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={field.label}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, [field.name]: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={field.label}
                    />
                );

            case 'richtext':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, [field.name]: e.target.value }))}
                        rows={12}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder={`${field.label} (Markdown supporté)`}
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, [field.name]: parseFloat(e.target.value) || '' }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={field.label}
                    />
                );

            case 'date':
                return (
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, [field.name]: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );

            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, [field.name]: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Sélectionner...</option>
                        {field.options?.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                );

            case 'boolean':
                return (
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value || false}
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, [field.name]: e.target.checked }))}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Activer</span>
                    </label>
                );

            case 'media':
                return (
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowMediaPicker(true)}
                            className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                        >
                            <Image className="w-4 h-4 inline mr-2" />
                            Choisir un média
                        </button>
                        {value && (
                            <div className="mt-2">
                                <img src={value} alt="Preview" className="w-32 h-32 object-cover rounded border" />
                            </div>
                        )}
                    </div>
                );

            case 'json':
                return (
                    <textarea
                        value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                setFormData((prev: any) => ({ ...prev, [field.name]: parsed }));
                            } catch {
                                setFormData((prev: any) => ({ ...prev, [field.name]: e.target.value }));
                            }
                        }}
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder='{"key": "value"}'
                    />
                );

            default:
                return null;
        }
    };

    const filteredContents = contents.filter(content => {
        const matchesSearch = content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || content.contentType === filterType;
        return matchesSearch && matchesType;
    });

    const stats = {
        total: contents.length,
        published: contents.filter(c => c.published || c.status === 'published').length,
        draft: contents.filter(c => !c.published && c.status !== 'published').length,
        types: contentTypes.length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="text-gray-500 text-lg">Chargement de la base de données...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Headless CMS Pro
                                </h1>
                                <p className="text-sm text-gray-500">Système avancé avec IA + IndexedDB</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setActiveView('ai-generator')}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 shadow-md"
                            >
                                <Sparkles className="w-4 h-4 inline mr-2" />
                                IA
                            </button>
                            <button
                                onClick={() => setActiveView('media')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Image className="w-4 h-4 inline mr-2" />
                                Médias ({media.length})
                            </button>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setActiveView('editor');
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md"
                            >
                                <Plus className="w-4 h-4 inline mr-2" />
                                Nouveau
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
                    <nav className="p-4 space-y-1">
                        <button
                            onClick={() => setActiveView('dashboard')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${activeView === 'dashboard' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Layout className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </button>
                        <button
                            onClick={() => setActiveView('contents')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${activeView === 'contents' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">Contenus</span>
                        </button>
                        <button
                            onClick={() => setActiveView('types')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${activeView === 'types' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Types</span>
                        </button>
                        <button
                            onClick={() => setActiveView('media')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${activeView === 'media' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Image className="w-5 h-5" />
                            <span className="font-medium">Médias</span>
                        </button>
                        <button
                            onClick={() => setActiveView('ai-generator')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${activeView === 'ai-generator' ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 shadow-sm' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Sparkles className="w-5 h-5" />
                            <span className="font-medium">Générateur IA</span>
                        </button>
                        <button
                            onClick={() => setActiveView('api')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${activeView === 'api' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Code className="w-5 h-5" />
                            <span className="font-medium">API</span>
                        </button>
                    </nav>

                    <div className="p-4 border-t border-gray-200">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Types de contenu</h3>
                        <div className="space-y-1">
                            {contentTypes.map(type => (
                                <div key={type.id} className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-50">
                                    <span>{type.name}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {contents.filter(c => c.contentType === type.id).length}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
                    {/* Dashboard */}
                    {activeView === 'dashboard' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total', value: stats.total, icon: FileText, color: 'blue' },
                                    { label: 'Publiés', value: stats.published, icon: Eye, color: 'green' },
                                    { label: 'Brouillons', value: stats.draft, icon: Edit2, color: 'yellow' },
                                    { label: 'Types', value: stats.types, icon: Settings, color: 'purple' }
                                ].map(stat => (
                                    <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                                <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                                            </div>
                                            <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                                                <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenus récents</h3>
                                <div className="space-y-3">
                                    {contents.slice(0, 5).map(content => (
                                        <div key={content.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{content.title || content.name}</h4>
                                                <p className="text-sm text-gray-500">
                                                    {content.contentType} • {new Date(content.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => editContent(content)}
                                                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                Éditer
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contents List */}
                    {activeView === 'contents' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Contenus</h2>

                            <div className="flex items-center space-x-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tous les types</option>
                                    {contentTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-white rounded-xl border overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredContents.map(content => (
                                            <tr key={content.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{content.title || content.name}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {contentTypes.find(t => t.id === content.contentType)?.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(content.updatedAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => editContent(content)} className="text-blue-600 hover:text-blue-900 mr-3">
                                                        <Edit2 className="w-4 h-4 inline" />
                                                    </button>
                                                    <button onClick={() => deleteContent(content.id)} className="text-red-600 hover:text-red-900">
                                                        <Trash2 className="w-4 h-4 inline" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Editor */}
                    {activeView === 'editor' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">{editMode ? 'Éditer' : 'Nouveau contenu'}</h2>
                                <button onClick={() => setActiveView('contents')} className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
                                    Annuler
                                </button>
                            </div>

                            <div className="bg-white rounded-xl border p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de contenu *</label>
                                    <select
                                        value={formData.contentType || ''}
                                        onChange={(e) => setFormData({ contentType: e.target.value })}
                                        disabled={editMode}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Sélectionner...</option>
                                        {contentTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {formData.contentType && contentTypes.find(t => t.id === formData.contentType)?.fields.map((field: any) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.label} {field.required && '*'}
                                        </label>
                                        {renderField(field)}
                                    </div>
                                ))}

                                <div className="flex justify-end space-x-4 pt-4 border-t">
                                    <button onClick={() => setActiveView('contents')} className="px-6 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50">
                                        Annuler
                                    </button>
                                    <button onClick={saveContent} className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                        <Save className="w-4 h-4 inline mr-2" />
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Types List */}
                    {activeView === 'types' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Types de contenu</h2>
                                <button
                                    onClick={() => {
                                        resetTypeForm();
                                        setActiveView('type-editor');
                                    }}
                                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    <Plus className="w-4 h-4 inline mr-2" />
                                    Nouveau type
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {contentTypes.map(type => (
                                    <div key={type.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{type.fields.length} champs</p>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {type.fields.slice(0, 5).map((field: any) => (
                                                        <span key={field.name} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                                            {field.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => editContentType(type)} className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                                                    Éditer
                                                </button>
                                                <button onClick={() => deleteContentType(type.id)} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Type Editor */}
                    {activeView === 'type-editor' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">{editingType ? 'Éditer le type' : 'Nouveau type'}</h2>

                            <div className="bg-white rounded-xl border p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ID *</label>
                                        <input
                                            type="text"
                                            value={typeFormData.id}
                                            onChange={(e) => setTypeFormData((prev: any) => ({ ...prev, id: e.target.value }))}
                                            disabled={!!editingType}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="article"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                                        <input
                                            type="text"
                                            value={typeFormData.name}
                                            onChange={(e) => setTypeFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Article"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-sm font-medium text-gray-700">Champs</label>
                                        <button onClick={addField} className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                                            <Plus className="w-4 h-4 inline mr-1" />
                                            Ajouter
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {typeFormData.fields.map((field: any, index: number) => (
                                            <div key={index} className="p-4 border rounded-lg bg-gray-50">
                                                <div className="grid grid-cols-4 gap-3">
                                                    <input
                                                        type="text"
                                                        value={field.name}
                                                        onChange={(e) => updateField(index, 'name', e.target.value)}
                                                        placeholder="name"
                                                        className="px-3 py-2 border rounded"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={field.label}
                                                        onChange={(e) => updateField(index, 'label', e.target.value)}
                                                        placeholder="Label"
                                                        className="px-3 py-2 border rounded"
                                                    />
                                                    <select
                                                        value={field.type}
                                                        onChange={(e) => updateField(index, 'type', e.target.value)}
                                                        className="px-3 py-2 border rounded"
                                                    >
                                                        <option value="text">Text</option>
                                                        <option value="textarea">Textarea</option>
                                                        <option value="richtext">Rich Text</option>
                                                        <option value="number">Number</option>
                                                        <option value="date">Date</option>
                                                        <option value="select">Select</option>
                                                        <option value="boolean">Boolean</option>
                                                        <option value="media">Media</option>
                                                        <option value="json">JSON</option>
                                                    </select>
                                                    <div className="flex items-center space-x-2">
                                                        <label className="flex items-center text-sm">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.required}
                                                                onChange={(e) => updateField(index, 'required', e.target.checked)}
                                                                className="mr-1"
                                                            />
                                                            Requis
                                                        </label>
                                                        <button onClick={() => removeField(index)} className="text-red-600 hover:text-red-800">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                {field.type === 'select' && (
                                                    <input
                                                        type="text"
                                                        value={field.options?.join(', ') || ''}
                                                        onChange={(e) => updateField(index, 'options', e.target.value.split(',').map((s: string) => s.trim()))}
                                                        placeholder="Options (séparées par virgule)"
                                                        className="w-full px-3 py-2 border rounded mt-2"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-4 border-t">
                                    <button onClick={() => setActiveView('types')} className="px-6 py-2 text-sm text-gray-700 bg-white border rounded-lg">
                                        Annuler
                                    </button>
                                    <button onClick={saveContentType} className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                        <Save className="w-4 h-4 inline mr-2" />
                                        Enregistrer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Media Library */}
                    {activeView === 'media' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Bibliothèque de médias</h2>
                                <label className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">
                                    <Upload className="w-4 h-4 inline mr-2" />
                                    Uploader
                                    <input type="file" multiple accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
                                </label>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {media.map(item => (
                                    <div key={item.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition group">
                                        <div className="aspect-square bg-gray-100 relative">
                                            {item.type.startsWith('image/') ? (
                                                <img src={item.data} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <File className="w-12 h-12 text-gray-400" />
                                                </div>
                                            )}
                                            <button
                                                onClick={() => deleteMedia(item.id)}
                                                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">{(item.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Generator */}
                    {activeView === 'ai-generator' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white shadow-xl">
                                <Sparkles className="w-8 h-8 mb-4" />
                                <h2 className="text-3xl font-bold mb-2">Générateur IA</h2>
                                <p className="text-purple-100">Créez des dashboards et pages web avec l'IA</p>
                            </div>

                            <div className="bg-white rounded-xl border p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Type</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['dashboard', 'webpage'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setGenerationType(type)}
                                                className={`p-4 rounded-lg border-2 transition ${generationType === type ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                                                    }`}
                                            >
                                                {type === 'dashboard' ? <Layout className="w-8 h-8 mx-auto mb-2 text-purple-600" /> : <Globe className="w-8 h-8 mx-auto mb-2 text-purple-600" />}
                                                <div className="font-semibold">{type === 'dashboard' ? 'Dashboard' : 'Page Web'}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    rows={6}
                                    placeholder="Décrivez ce que vous voulez créer..."
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />

                                <button
                                    onClick={generateWithAI}
                                    disabled={aiGenerating || !aiPrompt.trim()}
                                    className="w-full px-6 py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                                >
                                    {aiGenerating ? 'Génération...' : 'Générer avec l\'IA'}
                                </button>
                            </div>

                            {generatedCode && (
                                <div className="bg-white rounded-xl border overflow-hidden">
                                    <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
                                        <span className="text-white font-medium">Code généré</span>
                                        <div className="flex space-x-2">
                                            <button onClick={() => navigator.clipboard.writeText(generatedCode)} className="px-3 py-2 text-sm text-white bg-gray-700 rounded hover:bg-gray-600">
                                                <Copy className="w-4 h-4 inline mr-1" />
                                                Copier
                                            </button>
                                        </div>
                                    </div>
                                    <pre className="bg-gray-900 text-green-400 p-6 overflow-x-auto text-sm max-h-96">
                                        {generatedCode}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}

                    {/* API Documentation */}
                    {activeView === 'api' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">API Locale (IndexedDB)</h2>
                            <div className="bg-white rounded-xl border p-6">
                                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                                    {`// API actuelle (pour développement local)
const contents = await api.get();
const articles = await api.get('article');
const published = await api.get('article', { status: 'published' });
const results = await api.get(null, { search: 'react' });

await api.post({ contentType: 'article', title: 'Mon article', ... });
await api.put('content_123', { title: 'Nouveau titre' });
await api.deleteContent('content_123');`}
                                </pre>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Media Picker Modal */}
            {showMediaPicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowMediaPicker(false)}>
                    <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-96 overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Choisir un média</h3>
                            <button onClick={() => setShowMediaPicker(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {media.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        const field = contentTypes
                                            .find(t => t.id === formData.contentType)
                                            ?.fields.find((f: any) => f.type === 'media');
                                        if (field) {
                                            setFormData((prev: any) => ({ ...prev, [field.name]: item.data }));
                                        }
                                        setShowMediaPicker(false);
                                    }}
                                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500"
                                >
                                    <img src={item.data} alt={item.name} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeadlessCMS;
