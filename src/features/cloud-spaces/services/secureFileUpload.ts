import { api } from '../../lib/api/secureAxios';

interface FileValidationResult {
    valid: boolean;
    error?: string;
}

class SecureFileUploadService {
    private readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    private readonly ALLOWED_TYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/zip',
        'text/plain',
        'application/json',
    ];

    private readonly ALLOWED_EXTENSIONS = [
        'jpg', 'jpeg', 'png', 'gif', 'webp',
        'pdf', 'zip', 'txt', 'json',
    ];

    private onProgress?: (percent: number) => void;

    /**
     * Validation complète d'un fichier
     */
    async validateFile(file: File): Promise<FileValidationResult> {
        // 1. Vérifier la taille
        if (file.size > this.MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `Fichier trop volumineux. Max: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
            };
        }

        // 2. Vérifier le type MIME
        if (!this.ALLOWED_TYPES.includes(file.type)) {
            return {
                valid: false,
                error: `Type de fichier non autorisé: ${file.type}`
            };
        }

        // 3. Vérifier l'extension
        const extension = this.getFileExtension(file.name).toLowerCase();
        if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
            return {
                valid: false,
                error: `Extension non autorisée: .${extension}`
            };
        }

        // 4. Vérifier le Magic Number (signature du fichier)
        const isValidMagicNumber = await this.validateMagicNumber(file);
        if (!isValidMagicNumber) {
            return {
                valid: false,
                error: 'Le contenu du fichier ne correspond pas à son extension'
            };
        }

        // 5. Scanner pour des contenus malveillants basiques
        const isSafe = await this.scanForMaliciousContent(file);
        if (!isSafe) {
            return {
                valid: false,
                error: 'Fichier potentiellement dangereux détecté'
            };
        }

        return { valid: true };
    }

    /**
     * Upload sécurisé
     */
    async uploadFile(file: File, path: string): Promise<string> {
        // 1. Validation
        const validation = await this.validateFile(file);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        // 2. Générer un nom sécurisé
        const secureName = this.generateSecureFileName(file.name);

        // 3. Créer FormData
        const formData = new FormData();
        formData.append('file', file, secureName);
        formData.append('path', this.sanitizePath(path));
        formData.append('checksum', await this.calculateChecksum(file));

        try {
            // 4. Upload avec progression
            const response = await api.post<{ url: string }>('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent: any) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    this.onProgress?.(percentCompleted);
                },
            });

            return response.data.url;
        } catch (error: any) {
            this.logSecurityEvent('upload_failed', {
                fileName: secureName,
                error: error.message,
            });
            throw error;
        }
    }

    /**
     * Valider le Magic Number du fichier
     */
    private async validateMagicNumber(file: File): Promise<boolean> {
        const buffer = await file.slice(0, 4).arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const hex = Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        // Signatures de fichiers courants
        const signatures: Record<string, string[]> = {
            'image/jpeg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2'],
            'image/png': ['89504e47'],
            'image/gif': ['47494638'],
            'application/pdf': ['25504446'],
            'application/zip': ['504b0304', '504b0506'],
        };

        const expectedSignatures = signatures[file.type];
        if (!expectedSignatures) return true; // Pas de validation pour ce type

        return expectedSignatures.some(sig => hex.startsWith(sig));
    }

    /**
     * Scanner basique pour contenu malveillant
     */
    private async scanForMaliciousContent(file: File): Promise<boolean> {
        // Pour les fichiers texte, vérifier le contenu
        if (file.type.startsWith('text/')) {
            const text = await file.text();

            // Patterns malveillants
            const maliciousPatterns = [
                /<script/i,
                /javascript:/i,
                /<iframe/i,
                /eval\(/i,
                /onclick=/i,
            ];

            return !maliciousPatterns.some(pattern => pattern.test(text));
        }

        return true;
    }

    /**
     * Générer un nom de fichier sécurisé
     */
    private generateSecureFileName(originalName: string): string {
        const extension = this.getFileExtension(originalName);
        const timestamp = Date.now();
        const random = crypto.randomUUID().substring(0, 8);

        return `${timestamp}_${random}.${extension}`;
    }

    /**
     * Nettoyer le chemin
     */
    private sanitizePath(path: string): string {
        // Supprimer les tentatives de path traversal
        return path
            .replace(/\.\./g, '')
            .replace(/[^a-zA-Z0-9/_-]/g, '_')
            .replace(/\/+/g, '/');
    }

    /**
     * Calculer le checksum
     */
    private async calculateChecksum(file: File): Promise<string> {
        const buffer = await file.arrayBuffer();
        const hash = await crypto.subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    private getFileExtension(filename: string): string {
        return filename.split('.').pop() || '';
    }

    setProgressCallback(callback: (percent: number) => void): void {
        this.onProgress = callback;
    }

    private logSecurityEvent(type: string, details: any): void {
        fetch('/api/security/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, timestamp: new Date(), ...details })
        }).catch(() => { });
    }
}

export const secureFileUpload = new SecureFileUploadService();
