import React from 'react';
import { Cloud } from 'lucide-react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
    className = '',
    showText = true,
    size = 'md',
    variant = 'light' // background context: light = dark text, dark = white text
}) => {
    const sizeClasses = {
        sm: {
            container: 'w-8 h-8',
            icon: 'w-5 h-5',
            text: 'text-lg'
        },
        md: {
            container: 'w-10 h-10',
            icon: 'w-6 h-6',
            text: 'text-xl'
        },
        lg: {
            container: 'w-12 h-12',
            icon: 'w-7 h-7',
            text: 'text-2xl'
        },
        xl: {
            container: 'w-16 h-16',
            icon: 'w-10 h-10',
            text: 'text-4xl'
        }
    };

    const currentSize = sizeClasses[size];
    const textColor = variant === 'light' ? 'text-slate-900' : 'text-white';

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`${currentSize.container} overflow-hidden rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/10 flex-shrink-0`}>
                <img
                    src="/logo-new.jpg"
                    alt="Logo"
                    className="w-full h-full object-cover"
                />
            </div>
            {showText && (
                <span className={`${currentSize.text} font-bold ${textColor} tracking-tight`}>
                    Cloud Nexus
                </span>
            )}
        </div>
    );
};
