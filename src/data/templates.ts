import { SiteTemplate } from '../types/template.types';

export const templates: SiteTemplate[] = [
    {
        id: 'business-professional',
        name: 'Business Professional',
        description: 'Clean, corporate design optimized for service businesses and improved credibility.',
        category: 'business',
        thumbnail: '/templates/business-pro.jpg',
        colors: {
            primary: '#2563EB', // Blue 600
            secondary: '#1E40AF', // Blue 800
            accent: '#F59E0B', // Amber 500
            background: '#FFFFFF',
            text: '#1F2937', // Gray 800
            textLight: '#6B7280', // Gray 500
            border: '#E5E7EB' // Gray 200
        },
        fonts: {
            heading: 'Inter',
            body: 'Inter',
            sizes: {
                h1: '3.5rem',
                h2: '2.5rem',
                h3: '1.75rem',
                body: '1rem',
                small: '0.875rem'
            }
        },
        sections: [
            {
                id: 'hero',
                type: 'hero',
                title: 'Hero Section',
                order: 0,
                props: { layout: 'split' },
                content: {
                    heading: 'Transform Your Business with Data-Driven Solutions',
                    subheading: 'We help enterprise companies scale their operations through intelligent automation and expert consulting.',
                    text: 'Get started with a free consultation today.',
                    cta: { text: 'Start Free Trial', link: '#contact', style: 'primary' }
                }
            },
            {
                id: 'features',
                type: 'features',
                title: 'Key Features',
                order: 1,
                props: { layout: 'grid' },
                content: {
                    heading: 'Why Choose Us',
                    subheading: 'Enterprise-grade features for modern businesses',
                    items: [
                        { title: 'Real-time Analytics', description: 'Monitor performance in real-time with advanced dashboards.' },
                        { title: 'Cloud Security', description: 'Bank-grade security protocols to keep your data safe.' },
                        { title: '24/7 Support', description: 'Dedicated support team always ready to help you.' }
                    ]
                }
            },
            {
                id: 'services',
                type: 'services',
                title: 'Our Services',
                order: 2,
                props: { layout: 'cards' },
                content: {
                    heading: 'Professional Services',
                    items: [
                        { title: 'Strategic Consulting', description: 'Expert guidance for your digital transformation journey.' },
                        { title: 'Custom Development', description: 'Tailored software solutions for your specific needs.' },
                        { title: 'Cloud Migration', description: 'Seamless transition to modern cloud infrastructure.' }
                    ]
                }
            },
            {
                id: 'cta',
                type: 'newsletter',
                title: 'Call to Action',
                order: 3,
                props: { layout: 'center' },
                content: {
                    heading: 'Ready to Get Started?',
                    text: 'Join thousands of satisfied companies growing with our platform.',
                    cta: { text: 'Contact Sales', link: '#contact', style: 'primary' }
                }
            }
        ],
        metadata: {
            author: 'System',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z',
            version: '1.0.0',
            tags: ['business', 'corporate', 'clean']
        }
    },
    {
        id: 'creative-portfolio',
        name: 'Creative Portfolio',
        description: 'Minimalist and visual-focused layout perfect for designers, photographers, and artists.',
        category: 'portfolio',
        thumbnail: '/templates/portfolio-creative.jpg',
        colors: {
            primary: '#18181B', // Zinc 900
            secondary: '#27272A', // Zinc 800
            accent: '#EC4899', // Pink 500
            background: '#F8FAFC', // Slate 50
            text: '#0F172A', // Slate 900
            textLight: '#64748B', // Slate 500
            border: '#E2E8F0' // Slate 200
        },
        fonts: {
            heading: 'Playfair Display',
            body: 'Source Sans Pro',
            sizes: {
                h1: '4rem',
                h2: '3rem',
                h3: '2rem',
                body: '1.125rem',
                small: '0.9rem'
            }
        },
        sections: [
            {
                id: 'hero',
                type: 'hero',
                title: 'Introduction',
                order: 0,
                props: { layout: 'minimal' },
                content: {
                    heading: 'Creating Digital Experiences That Matter',
                    subheading: 'Award-winning visual designer & art director based in New York.',
                    cta: { text: 'View Work', link: '#gallery', style: 'outline' }
                }
            },
            {
                id: 'gallery',
                type: 'gallery',
                title: 'Selected Works',
                order: 1,
                props: { layout: 'masonry' },
                content: {
                    heading: 'Selected Works',
                    items: [
                        { title: 'Brand Identity', description: 'Rebranding for major tech startup' },
                        { title: 'Editorial Design', description: 'Magazine layout for fashion week' },
                        { title: 'Digital Campaign', description: 'Social media campaign for lifestyle brand' }
                    ]
                }
            },
            {
                id: 'about',
                type: 'about',
                title: 'About Me',
                order: 2,
                props: { layout: 'split-image-right' },
                content: {
                    heading: 'The Person Behind the Pixels',
                    text: 'With over 10 years of experience in digital design, I believe in creating products that are not only beautiful but also functional and accessible.',
                    cta: { text: 'Read More', link: '#about', style: 'secondary' }
                }
            }
        ],
        metadata: {
            author: 'System',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z',
            version: '1.0.0',
            tags: ['portfolio', 'creative', 'minimal']
        }
    },
    {
        id: 'landing-page',
        name: 'SaaS Landing Page',
        description: 'High-conversion landing page optimized for SaaS products and mobile apps.',
        category: 'landing',
        thumbnail: '/templates/saas-landing.jpg',
        colors: {
            primary: '#6366F1', // Indigo 500
            secondary: '#4F46E5', // Indigo 600
            accent: '#8B5CF6', // Violet 500
            background: '#FFFFFF',
            text: '#111827', // Gray 900
            textLight: '#4B5563', // Gray 600
            border: '#F3F4F6' // Gray 100
        },
        fonts: {
            heading: 'Plus Jakarta Sans',
            body: 'Inter',
            sizes: {
                h1: '3.75rem',
                h2: '3rem',
                h3: '2rem',
                body: '1.125rem',
                small: '1rem'
            }
        },
        sections: [
            {
                id: 'hero',
                type: 'hero',
                title: 'Hero',
                order: 0,
                props: { layout: 'center-aligned' },
                content: {
                    heading: 'All-in-one Platform for Modern Teams',
                    subheading: 'Streamline your workflow, boost productivity, and collaborate seamlessly with our integrated suite of tools.',
                    cta: { text: 'Start Free Trial', link: '#pricing', style: 'primary' }
                }
            },
            {
                id: 'features',
                type: 'features',
                title: 'Features',
                order: 1,
                props: { layout: 'cards-grid' },
                content: {
                    heading: 'Everything You Need',
                    subheading: 'Powerful features packed in a simple interface',
                    items: [
                        { title: 'Project Management', description: 'Track tasks and milestones effortlessly.' },
                        { title: 'Team Collaboration', description: 'Real-time chat and file sharing.' },
                        { title: 'Automated Reports', description: 'Get insights delivered to your inbox.' }
                    ]
                }
            },
            {
                id: 'testimonials',
                type: 'testimonials',
                title: 'Testimonials',
                order: 2,
                props: { layout: 'carousel' },
                content: {
                    heading: 'Loved by Teams Worldwide',
                    items: [
                        { author: 'Sarah J.', role: 'Product Manager', text: 'This tool has completely transformed how we work. Highly recommended!' },
                        { author: 'Mike T.', role: 'CTO', text: 'The best investment we made this year. Simple, fast, and reliable.' }
                    ]
                }
            },
            {
                id: 'pricing',
                type: 'pricing',
                title: 'Pricing',
                order: 3,
                props: { layout: 'comparison' },
                content: {
                    heading: 'Simple, Transparent Pricing',
                    subheading: 'Choose the plan that fits your needs',
                    items: [
                        { title: 'Starter', price: '$29', features: ['5 Users', 'Basic Support', '10GB Storage'] },
                        { title: 'Pro', price: '$79', features: ['Unlimited Users', 'Priority Support', '100GB Storage'] },
                        { title: 'Enterprise', price: 'Custom', features: ['Custom Solutions', 'Dedicated Manager', 'Unlimited Storage'] }
                    ]
                }
            }
        ],
        metadata: {
            author: 'System',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z',
            version: '1.0.0',
            tags: ['landing', 'saas', 'conversion']
        }
    },
    {
        id: 'blog-magazine',
        name: 'Modern Magazine',
        description: 'Content-rich layout designed for blogs, magazines, and news publications.',
        category: 'blog',
        thumbnail: '/templates/blog-magazine.jpg',
        colors: {
            primary: '#000000',
            secondary: '#333333',
            accent: '#F43F5E', // Rose 500
            background: '#FDFDFD',
            text: '#262626', // Neutral 800
            textLight: '#737373', // Neutral 500
            border: '#E5E5E5' // Neutral 200
        },
        fonts: {
            heading: 'Merriweather',
            body: 'Open Sans',
            sizes: {
                h1: '3rem',
                h2: '2.25rem',
                h3: '1.5rem',
                body: '1.125rem',
                small: '0.875rem'
            }
        },
        sections: [
            {
                id: 'hero',
                type: 'hero',
                title: 'Featured Story',
                order: 0,
                props: { layout: 'cover-story' },
                content: {
                    heading: 'The Future of Digital Journalism',
                    subheading: 'Exploring new mediums and storytelling techniques in the modern age.',
                    cta: { text: 'Read Story', link: '#read', style: 'outline' }
                }
            },
            {
                id: 'grid',
                type: 'blog-grid',
                title: 'Latest Articles',
                order: 1,
                props: { layout: 'masonry' },
                content: {
                    heading: 'Latest Stories',
                    items: [
                        { title: 'Tech Giants and AI', date: 'Oct 24, 2024', category: 'Technology' },
                        { title: 'Sustainable Living Guide', date: 'Oct 23, 2024', category: 'Lifestyle' },
                        { title: 'Modern Architecture', date: 'Oct 22, 2024', category: 'Design' },
                        { title: 'Culinary Travels', date: 'Oct 21, 2024', category: 'Travel' }
                    ]
                }
            },
            {
                id: 'newsletter',
                type: 'newsletter',
                title: 'Newsletter',
                order: 2,
                props: { layout: 'inline' },
                content: {
                    heading: 'Subscribe to Our Newsletter',
                    text: 'Get the latest stories delivered directly to your inbox.',
                    cta: { text: 'Subscribe', link: '#', style: 'primary' }
                }
            }
        ],
        metadata: {
            author: 'System',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z',
            version: '1.0.0',
            tags: ['blog', 'magazine', 'content']
        }
    },
    {
        id: 'ecommerce-minimal',
        name: 'Minimal Store',
        description: 'Clean and focus e-commerce template optimized for product showcasing.',
        category: 'ecommerce',
        thumbnail: '/templates/ecommerce-minimal.jpg',
        colors: {
            primary: '#161616',
            secondary: '#343434',
            accent: '#D97706', // Amber 600
            background: '#FFFFFF',
            text: '#171717', // Neutral 900
            textLight: '#525252', // Neutral 600
            border: '#E5E5E5'
        },
        fonts: {
            heading: 'Jost',
            body: 'Jost',
            sizes: {
                h1: '3rem',
                h2: '2.25rem',
                h3: '1.5rem',
                body: '1rem',
                small: '0.875rem'
            }
        },
        sections: [
            {
                id: 'hero',
                type: 'hero',
                title: 'Hero Promotion',
                order: 0,
                props: { layout: 'full-width' },
                content: {
                    heading: 'New Collection 2024',
                    subheading: 'Discover the latest trends in minimalist design.',
                    cta: { text: 'Shop Now', link: '#shop', style: 'primary' }
                }
            },
            {
                id: 'products',
                type: 'product-grid',
                title: 'Featured Products',
                order: 1,
                props: { layout: 'grid-4' },
                content: {
                    heading: 'Best Sellers',
                    items: [
                        { title: 'Minimal Watch', price: '$129', image: 'watch.jpg' },
                        { title: 'Leather Wallet', price: '$49', image: 'wallet.jpg' },
                        { title: 'Sunglasses', price: '$89', image: 'glasses.jpg' },
                        { title: 'Canvas Backpack', price: '$79', image: 'backpack.jpg' }
                    ]
                }
            },
            {
                id: 'categories',
                type: 'features',
                title: 'Shop by Category',
                order: 2,
                props: { layout: 'grid-3' },
                content: {
                    heading: 'Categories',
                    items: [
                        { title: 'Accessories', description: 'Everyday essentials' },
                        { title: 'Clothing', description: 'Modern apparel' },
                        { title: 'Home', description: 'Interior decor' }
                    ]
                }
            }
        ],
        metadata: {
            author: 'System',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z',
            version: '1.0.0',
            tags: ['ecommerce', 'shop', 'minimal']
        }
    }
];
