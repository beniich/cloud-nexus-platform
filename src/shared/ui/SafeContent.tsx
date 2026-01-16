import React from 'react';
import { XSSProtection } from '@/lib/security/xssProtection';

export const SafeContent: React.FC<{
    content: string; // Renamed from html to content to matching new usage
    className?: string;
    allowedTags?: string[];
}> = ({ content, className, allowedTags }) => {
    const sanitized = XSSProtection.sanitizeHTML(content, {
        allowedTags,
    });

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitized }}
        />
    );
};
