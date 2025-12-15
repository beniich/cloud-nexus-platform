import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Instagram } from "lucide-react";

interface SocialPost {
    id: string;
    platform: 'instagram' | 'tiktok';
    mediaUrl: string; // Image or Video thumbnail
    caption: string;
    likes: number;
}

interface SocialGridProps {
    posts: SocialPost[];
}

export function SocialGrid({ posts }: SocialGridProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="py-8">
            <div className="flex items-center gap-2 mb-6">
                <Instagram className="w-5 h-5 text-pink-600" />
                <h3 className="text-xl font-bold">Vu sur le Social</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="group relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all"
                    >
                        <img
                            src={post.mediaUrl}
                            alt={post.caption}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                        {/* Platform Badge */}
                        <div className="absolute top-2 right-2">
                            {post.platform === 'tiktok' ? (
                                <Badge className="bg-black text-white border-0 text-[10px] px-1.5 py-0.5">TikTok</Badge>
                            ) : (
                                <Badge className="bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 border-0 text-white text-[10px] px-1.5 py-0.5">Insta</Badge>
                            )}
                        </div>

                        {/* Overlay Content */}
                        <div className="absolute bottom-0 left-0 p-3 w-full">
                            <p className="text-white text-xs line-clamp-2 mb-1">{post.caption}</p>
                            <div className="flex items-center gap-2 text-white/80 text-[10px]">
                                <span>{post.likes} likes</span>
                            </div>
                        </div>

                        {/* Play Icon Overlay for Videos */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
