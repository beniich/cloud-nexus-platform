import { useParams } from 'react-router-dom';
import { StoreHeader } from '@/components/storefront/StoreHeader';
import { SocialGrid } from '@/components/storefront/SocialGrid';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock Data for Demo (Simulating Backend Response)
const MOCK_VENDOR_DB: Record<string, any> = {
    'nike-official': {
        name: 'Nike Official',
        description: 'Just Do It. Découvrez les dernières innovations Nike pour le sport et le style.',
        bannerUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
        primaryColor: '#111111',
        products: [
            { id: '1', name: 'Air Max 270', price: 149.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', category: 'Sneakers' },
            { id: '2', name: 'Nike Tech Fleece', price: 99.99, image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1974&auto=format&fit=crop', category: 'Apparel' },
            { id: '3', name: 'Zoom Pegasus', price: 129.99, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop', category: 'Running' },
        ],
        socialPosts: [
            { id: 's1', platform: 'instagram', mediaUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=2070', caption: 'New drop alert! 👟 #Nike', likes: 1240 },
            { id: 's2', platform: 'tiktok', mediaUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070', caption: 'Run like never before.', likes: 8500 },
            { id: 's3', platform: 'instagram', mediaUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964', caption: 'Which color is your fav?', likes: 3300 },
            { id: 's4', platform: 'tiktok', mediaUrl: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925', caption: 'Sunday vibes.', likes: 5000 },
        ]
    }
};

export default function Storefront() {
    const { slug } = useParams<{ slug: string }>();
    const vendor = slug ? MOCK_VENDOR_DB[slug] : null;

    if (!vendor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-muted-foreground">Boutique introuvable.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Navbar />

            <StoreHeader
                vendorName={vendor.name}
                description={vendor.description}
                bannerUrl={vendor.bannerUrl}
                primaryColor={vendor.primaryColor}
            />

            <main className="container mx-auto px-4 py-12">
                {/* Social Integration */}
                <SocialGrid posts={vendor.socialPosts} />

                {/* Product Grid */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Catalogue</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {vendor.products.map((product: any) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
