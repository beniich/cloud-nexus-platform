import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Button } from '@/components/ui/button';
import {
    Type,
    Minus,
    Plus,
    Eye,
    Palette,
    X,
    Accessibility
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function AccessibilityToolbar() {
    const [isOpen, setIsOpen] = useState(false);
    const {
        fontSize, setFontSize,
        fontFamily, setFontFamily,
        contrastMode, setContrastMode,
        resetSettings
    } = useAccessibility();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {isOpen && (
                <Card className="w-72 shadow-2xl border-2 border-primary/20 animate-in slide-in-from-bottom-5">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-lg">Accessibilité</CardTitle>
                            <CardDescription>Personnalisez votre affichage</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* 1. Taille du texte */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Type className="w-4 h-4" />
                                Taille du texte
                            </div>
                            <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                                <Button
                                    variant={fontSize === 'normal' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setFontSize('normal')}
                                >
                                    <span className="text-xs">A</span>
                                </Button>
                                <Button
                                    variant={fontSize === 'large' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setFontSize('large')}
                                >
                                    <span className="text-base">A+</span>
                                </Button>
                                <Button
                                    variant={fontSize === 'xlarge' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setFontSize('xlarge')}
                                >
                                    <span className="text-xl font-bold">A++</span>
                                </Button>
                            </div>
                        </div>

                        {/* 2. Police & Structure */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Eye className="w-4 h-4" />
                                Police & Lecture
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant={fontFamily === 'default' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFontFamily('default')}
                                    className="text-xs"
                                >
                                    Défaut
                                </Button>
                                <Button
                                    variant={fontFamily === 'serif' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFontFamily('serif')}
                                    className="font-serif text-xs"
                                >
                                    Serif
                                </Button>
                                <Button
                                    variant={fontFamily === 'dyslexic' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFontFamily('dyslexic')}
                                    className="text-xs font-['Comic_Sans_MS']"
                                >
                                    Dyslexie
                                </Button>
                            </div>
                        </div>

                        {/* 3. Contraste & Thème */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Palette className="w-4 h-4" />
                                Contrastes
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setContrastMode('normal')}
                                    className={cn(
                                        "h-10 rounded-md border flex items-center justify-center transition-all",
                                        contrastMode === 'normal' ? "ring-2 ring-primary border-transparent" : "hover:border-primary/50"
                                    )}
                                    title="Normal"
                                >
                                    <div className="w-4 h-4 bg-foreground rounded-full" />
                                </button>
                                <button
                                    onClick={() => setContrastMode('high-contrast')}
                                    className={cn(
                                        "h-10 rounded-md border bg-black flex items-center justify-center transition-all",
                                        contrastMode === 'high-contrast' ? "ring-2 ring-primary border-transparent" : "hover:border-white"
                                    )}
                                    title="Contraste Élevé"
                                >
                                    <div className="w-4 h-4 bg-white rounded-full border border-black" />
                                </button>
                                <button
                                    onClick={() => setContrastMode('dark-yellow')}
                                    className={cn(
                                        "h-10 rounded-md border bg-[#ffffe0] flex items-center justify-center transition-all",
                                        contrastMode === 'dark-yellow' ? "ring-2 ring-primary border-transparent" : "hover:border-blue-900"
                                    )}
                                    title="Confort Visuel (Jaune/Bleu)"
                                >
                                    <div className="w-4 h-4 bg-[#00008b] rounded-full" />
                                </button>
                            </div>
                        </div>

                        <Button
                            variant="link"
                            className="w-full text-xs text-muted-foreground h-auto p-0"
                            onClick={resetSettings}
                        >
                            Réinitialiser les paramètres
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Button
                size="lg"
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110",
                    isOpen ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Accessibility className="h-6 w-6" />
            </Button>
        </div>
    );
}
