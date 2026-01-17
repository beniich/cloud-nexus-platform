import { SectionType } from '../types/template.types';

export interface SectionBlueprint {
    type: SectionType;
    name: string;
    description: string;
    icon: string; // Using emoji for MVP or Lucid icon name
    defaultContent: any;
}

export const sectionLibrary: SectionBlueprint[] = [
    {
        type: 'hero',
        name: 'Hero Section',
        description: 'Large header with title, subtitle, and call to action.',
        icon: 'LayoutTemplate',
        defaultContent: {
            heading: 'Welcome to Our Site',
            subheading: 'We provide amazing solutions for your business.',
            cta: {
                text: 'Get Started',
                link: '#',
                style: 'primary'
            },
            image: '',
        }
    },
    {
        type: 'about',
        name: 'About Us',
        description: 'Introduce your company and mission.',
        icon: 'Info',
        defaultContent: {
            heading: 'About Us',
            text: 'We are a dedicated team of professionals committed to excellence.',
            items: ['Experience', 'Quality', 'Innovation']
        }
    },
    {
        type: 'services',
        name: 'Services',
        description: 'List your services with icons and descriptions.',
        icon: 'Briefcase',
        defaultContent: {
            heading: 'Our Services',
            subheading: 'What we offer',
            items: [
                { icon: '🚀', title: 'Service 1', description: 'Description of service 1' },
                { icon: '⚡', title: 'Service 2', description: 'Description of service 2' },
                { icon: '🛡️', title: 'Service 3', description: 'Description of service 3' },
            ]
        }
    },
    {
        type: 'features',
        name: 'Features',
        description: 'Highlight key features of your product.',
        icon: 'List',
        defaultContent: {
            heading: 'Key Features',
            items: [
                { icon: '✨', title: 'Feature 1', description: 'Great feature details' },
                { icon: '💎', title: 'Feature 2', description: 'Another amazing feature' },
            ]
        }
    },
    {
        type: 'gallery',
        name: 'Gallery',
        description: 'Grid of images with optional titles.',
        icon: 'Image',
        defaultContent: {
            heading: 'Our Work',
            items: [
                { url: 'https://via.placeholder.com/400', title: 'Image 1' },
                { url: 'https://via.placeholder.com/400', title: 'Image 2' },
                { url: 'https://via.placeholder.com/400', title: 'Image 3' },
            ]
        }
    },
    {
        type: 'contact',
        name: 'Contact Form',
        description: 'Get in touch form with contact info.',
        icon: 'Mail',
        defaultContent: {
            heading: 'Contact Us',
            subheading: 'We would love to hear from you',
            text: 'Fill out the form below or reach us at:',
            items: [
                { type: 'email', value: 'contact@example.com' },
                { type: 'phone', value: '+1 (555) 000-0000' }
            ]
        }
    }
];
