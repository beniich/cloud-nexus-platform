class CryptoService {
    private readonly algorithm = 'AES-GCM';
    private readonly keyLength = 256;

    /**
     * Générer une clé de chiffrement
     */
    async generateKey(): Promise<CryptoKey> {
        return crypto.subtle.generateKey(
            {
                name: this.algorithm,
                length: this.keyLength,
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Chiffrer des données
     */
    async encrypt(data: string, key: CryptoKey): Promise<string> {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);

        // IV aléatoire
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encryptedBuffer = await crypto.subtle.encrypt(
            {
                name: this.algorithm,
                iv,
            },
            key,
            dataBuffer
        );

        // Combiner IV + données chiffrées
        const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encryptedBuffer), iv.length);

        // Encoder en base64
        return btoa(String.fromCharCode(...combined));
    }

    /**
     * Déchiffrer des données
     */
    async decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
        // Décoder base64
        const combined = new Uint8Array(
            atob(encryptedData).split('').map(c => c.charCodeAt(0))
        );

        // Extraire IV et données
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);

        const decryptedBuffer = await crypto.subtle.decrypt(
            {
                name: this.algorithm,
                iv,
            },
            key,
            data
        );

        const decoder = new TextDecoder();
        return decoder.decode(decryptedBuffer);
    }

    /**
     * Hash sécurisé (pour mots de passe, checksums)
     */
    async hash(data: string): Promise<string> {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
}

export const cryptoService = new CryptoService();
