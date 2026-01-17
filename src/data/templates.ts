import { SiteTemplate } from '../types/template.types';

export const templates: SiteTemplate[] = [
    {
        id: 'business-professional',
        name: 'Business Professional',
        category: 'business',
        thumbnail: '/templates/business-pro.jpg',
        description: 'Perfect for consulting, agencies, and professional services',
        previewUrl: 'https://business-pro.example.com',
        colors: {
            primary: '#2563eb',
            secondary: '#1e40af',
            accent: '#f59e0b',
            background: '#ffffff',
            text: '#1f2937',
            textLight: '#6b7280',
            border: '#e5e7eb',
        },
        fonts: {
            heading: 'Inter',
            body: 'Inter',
            sizes: {
                h1: '3.75rem',
                h2: '3rem',
                h3: '2.25rem',
                body: '1rem',
                small: '0.875rem'
            }
        },
        metadata: {
            author: 'Cloud Nexus',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z',
            version: '1.0.0',
            tags: ['business', 'corporate', 'professional']
        },
        sections: [
            {
                id: 'hero-1',
                type: 'hero',
                title: 'Transform Your Business',
                order: 0,
                props: {},
                content: {
                    heading: 'Transform Your Business',
                    subheading: 'Professional solutions for modern companies',
                    cta: {
                        text: 'Get Started',
                        link: '#contact',
                        style: 'primary'
                    },
                    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
                },
            },
            {
                id: 'services-1',
                type: 'services',
                title: 'Our Services',
                order: 1,
                props: {},
                content: {
                    heading: 'Our Services',
                    subheading: 'Comprehensive solutions tailored to your needs',
                    items: [
                        {
                            icon: '💼',
                            title: 'Consulting',
                            description: 'Strategic guidance for your business growth',
                        },
                        {
                            icon: '🚀',
                            title: 'Development',
                            description: 'Custom software solutions',
                        },
                        {
                            icon: '📊',
                            title: 'Analytics',
                            description: 'Data-driven insights and reporting',
                        },
                    ],
                },
            },
            {
                id: 'testimonials-1',
                type: 'testimonials',
                title: 'What Our Clients Say',
                order: 2,
                props: {},
                content: {
                    heading: 'What Our Clients Say',
                    items: [
                        {
                            name: 'John Smith',
                            role: 'CEO, TechCorp',
                            text: 'Exceptional service and results beyond expectations.',
                            avatar: 'https://i.pravatar.cc/150?img=1',
                        },
                        {
                            name: 'Sarah Johnson',
                            role: 'Founder, StartupX',
                            text: 'Professional team that delivers on promises.',
                            avatar: 'https://i.pravatar.cc/150?img=2',
                        },
                    ],
                },
            },
            {
                id: 'contact-1',
                type: 'contact',
                title: 'Get In Touch',
                order: 3,
                props: {},
                content: {
                    heading: 'Get In Touch',
                    subheading: 'Ready to start your project?',
                    text: 'Contact us today to discuss your needs.',
                    items: [
                        { type: 'email', value: 'hello@business.com' },
                        { type: 'phone', value: '+1 (555) 123-4567' },
                        { type: 'address', value: '123 Business St, City, State 12345' }
                    ]
                },
            },
        ],
    },
    {
        id: 'creative-portfolio',
        name: 'Creative Portfolio',
        category: 'portfolio',
        thumbnail: '/templates/creative-portfolio.jpg',
        description: 'Showcase your work with style',
        previewUrl: 'https://portfolio.example.com',
        colors: {
            primary: '#8b5cf6',
            secondary: '#7c3aed',
            accent: '#ec4899',
            background: '#0f172a',
            text: '#f1f5f9',
            textLight: '#cbd5e1',
            border: '#334155',
        },
        fonts: {
            heading: 'Playfair Display',
            body: 'Lato',
            sizes: {
                h1: '4rem',
                h2: '3rem',
                h3: '2rem',
                body: '1.125rem',
                small: '0.875rem'
            }
        },
        metadata: {
            author: 'Cloud Nexus',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z',
            version: '1.0.0',
            tags: ['portfolio', 'creative', 'design']
        },
        sections: [
            {
                id: 'hero-2',
                type: 'hero',
                title: 'Creative Designer',
                order: 0,
                props: {},
                content: {
                    heading: 'Creative Designer',
                    subheading: 'Bringing ideas to life',
                    cta: {
                        text: 'View Work',
                        link: '#gallery',
                        style: 'primary'
                    }
                },
            },
            {
                id: 'gallery-1',
                type: 'gallery',
                title: 'Featured Work',
                order: 1,
                props: {},
                content: {
                    heading: 'Featured Work',
                    items: [
                        { url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5', title: 'Project 1' },
                        { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64', title: 'Project 2' },
                        { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', title: 'Project 3' },
                    ],
                },
            },
            {
                id: 'about-2',
                type: 'about',
                title: 'About Me',
                order: 2,
                props: {},
                content: {
                    heading: 'About Me',
                    text: 'With over 10 years of experience in creative design, I help brands stand out.',
                    items: ['UI/UX Design', 'Branding', 'Illustration', 'Motion Graphics'],
                },
            },
        ],
    },
    {
        id: 'landing-conversion',
        name: 'Landing Page Pro',
        category: 'landing',
        thumbnail: '/templates/landing-pro.jpg',
        description: 'High-converting landing page',
        previewUrl: 'https://landing.example.com',
        colors: {
            primary: '#10b981',
            secondary: '#059669',
            accent: '#fbbf24',
            background: '#ffffff',
            text: '#111827',
            textLight: '#6b7280',
            border: '#e5e7eb',
        },
        fonts: {
            heading: 'Poppins',
            body: 'Open Sans',
            sizes: {
                h1: '3.5rem',
                h2: '2.5rem',
                h3: '2rem',
                body: '1rem',
                small: '0.875rem'
            }
        },
        metadata: {
            author: 'Cloud Nexus',
            created: '2024-01-01T00:00:00Z',
            updated: '2024-01-01T00:00:00Z',
            version: '1.0.0',
            tags: ['landing', 'marketing', 'conversion']
        },
        sections: [
            {
                id: 'hero-3',
                type: 'hero',
                title: 'Grow Your Business 10x',
                order: 0,
                props: {},
                content: {
                    heading: 'Grow Your Business 10x',
                    subheading: 'The ultimate tool for modern entrepreneurs',
                    cta: {
                        text: 'Start Free Trial',
                        link: '#pricing',
                        style: 'primary'
                    },
                    items: ['No credit card required', '14-day free trial', 'Cancel anytime'],
                },
            },
            {
                id: 'features-1',
                type: 'features',
                title: 'Everything You Need',
                order: 1,
                props: {},
                content: {
                    heading: 'Everything You Need',
                    items: [
                        { icon: '⚡', title: 'Fast Setup', description: 'Get started in minutes' },
                        { icon: '🔒', title: 'Secure', description: 'Bank-level encryption' },
                        { icon: '📈', title: 'Analytics', description: 'Track your growth' },
                        { icon: '🎯', title: 'Targeted', description: 'Reach the right audience' },
                    ],
                },
            },
            {
                id: 'pricing-1',
                type: 'pricing',
                title: 'Simple Pricing',
                order: 2,
                props: {},
                content: {
                    heading: 'Simple Pricing',
                    items: [
                        {
                            name: 'Starter',
                            price: '$29',
                            period: '/month',
                            features: ['10 Projects', '5GB Storage', 'Email Support'],
                            cta: 'Start Free',
                        },
                        {
                            name: 'Professional',
                            price: '$79',
                            period: '/month',
                            featured: true,
                            features: ['Unlimited Projects', '50GB Storage', 'Priority Support', 'Advanced Analytics'],
                            cta: 'Start Free',
                        },
                        {
                            name: 'Enterprise',
                            price: '$199',
                            period: '/month',
                            features: ['Unlimited Everything', 'Dedicated Support', 'Custom Integration', 'SLA'],
                            cta: 'Contact Sales',
                        },
                    ],
                },
            },
        ],
    },
];
