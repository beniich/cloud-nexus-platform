import DOMPurify from 'isomorphic-dompurify';

export class XSSProtection {
    /**
     * Nettoyer HTML de manière stricte
     */
    static sanitizeHTML(dirty: string, options?: {
        allowedTags?: string[];
        allowedAttributes?: string[];
    }): string {
        const config = {
            ALLOWED_TAGS: options?.allowedTags || ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
            ALLOWED_ATTR: options?.allowedAttributes || ['class'],
            KEEP_CONTENT: true,
            RETURN_TRUSTED_TYPE: false,
        };

        return DOMPurify.sanitize(dirty, config);
    }

    /**
     * Nettoyer texte simple (pas de HTML)
     */
    static sanitizeText(text: string): string {
        return text
            .replace(/[<>'"]/g, (char) => {
                const entities: Record<string, string> = {
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#x27;',
                    '"': '&quot;',
                };
                return entities[char] || char;
            });
    }

    /**
     * Nettoyer les URLs
     */
    static sanitizeURL(url: string): string {
        try {
            const parsed = new URL(url);

            // Autoriser seulement http et https
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                throw new Error('Protocole non autorisé');
            }

            return parsed.toString();
        } catch {
            return '#';
        }
    }
}
