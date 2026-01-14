import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Store, Share2, Star } from "lucide-react";

interface StoreHeaderProps {
    vendorName: string;
    description: string;
    bannerUrl: string;
    logoUrl?: string; // Optional if they use text logo
    primaryColor: string;
    rating?: number;
}

export function StoreHeader({ vendorName, description, bannerUrl, logoUrl, primaryColor, rating = 4.8 }: StoreHeaderProps) {
    return (
        <div className="w-full bg-background border-b relative">
            {/* Banner Area */}
            <div
                className="h-48 md:h-64 w-full bg-cover bg-center relative"
                style={{
                    backgroundImage: `url(${bannerUrl})`,
                    backgroundColor: primaryColor // Fallback
                }}
            >
                <div className="absolute inset-0 bg-black/20" /> {/* Overlay for text readability */}
            </div>

            {/* Profile Bar */}
            <div className="container mx-auto px-4 -mt-12 relative z-10 pb-6">
                <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
                    {/* Logo */}
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-background bg-white shadow-lg overflow-hidden flex items-center justify-center">
                        {logoUrl ? (
                            <img src={logoUrl} alt={vendorName} className="w-full h-full object-cover" />
                        ) : (
                            <Store className="w-12 h-12 text-muted-foreground" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left pt-2 md:pt-12">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <h1 className="text-3xl font-bold tracking-tight">{vendorName}</h1>
                            {rating && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    {rating}
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground max-w-2xl">{description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-12">
                        <Button className="flex-1 md:flex-none" style={{ backgroundColor: primaryColor }}>Suivre</Button>
                        <Button variant="outline" size="icon">
                            <Share2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
