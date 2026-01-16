import { Site } from '@/types/site-builder';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Globe, MoreVertical, Trash, Eye } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SiteCardProps {
    site: Site;
    onDelete: (id: string) => void;
}

export default function SiteCard({ site, onDelete }: SiteCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            {/* Thumbnail */}
            <div className="relative h-40 bg-gray-100 dark:bg-gray-800 border-b">
                <img
                    src={site.thumbnailUrl}
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className={
                        site.status === 'published'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }>
                        {site.status === 'published' ? 'En ligne' : 'Brouillon'}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <CardContent className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 truncate">
                    {site.name}
                </h3>
                <a
                    href={`https://${site.subdomain}.cloudnexus.io`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline flex items-center gap-1 mb-4"
                >
                    <Globe className="w-3 h-3" />
                    {site.subdomain}.cloudnexus.io
                </a>

                <p className="text-xs text-muted-foreground">
                    Modifié le {new Date(site.updatedAt).toLocaleDateString()}
                </p>
            </CardContent>

            {/* Actions */}
            <CardFooter className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center border-t">
                <Button variant="default" size="sm" className="w-full mr-2">
                    <Edit className="w-4 h-4 mr-2" />
                    Éditer
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Prévisualiser
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete(site.id)}>
                            <Trash className="w-4 h-4 mr-2" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}
