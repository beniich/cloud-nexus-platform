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
        type: 'form',
        name: 'Contact Form (Advanced)',
        description: 'Customizable contact form with multiple fields and validation.',
        icon: 'Mail',
        defaultContent: {
            heading: 'Get in Touch',
            subheading: 'We would love to hear from you',
            form: {
                id: 'new-form',
                siteId: '',
                name: 'Contact Form',
                fields: [
                    { id: 'f1', type: 'text', label: 'Name', name: 'name', required: true, order: 0, width: 'half', placeholder: 'Your Name' },
                    { id: 'f2', type: 'email', label: 'Email', name: 'email', required: true, order: 1, width: 'half', placeholder: 'your@email.com' },
                    { id: 'f3', type: 'textarea', label: 'Message', name: 'message', required: true, order: 2, width: 'full', placeholder: 'How can we help?' }
                ],
                settings: {
                    submitButtonText: 'Send Message',
                    submitButtonStyle: 'primary',
                    successMessage: 'Thank you! We received your message and will get back to you soon.',
                    errorMessage: 'Something went wrong. Please try again.',
                    emailNotifications: {
                        enabled: true,
                        recipients: [],
                        subject: 'New Contact Form Submission'
                    },
                    antiSpam: {
                        honeypot: true
                    },
                    saveToDatabase: true,
                    allowMultipleSubmissions: true
                },
                submissionCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        }
    }
];
