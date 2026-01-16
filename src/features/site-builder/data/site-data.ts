import { Smartphone, Layout, Monitor } from 'lucide-react';

export const USER_DATA = {
    plan: 'pro',
    sitesCreated: 2,
    limits: { basic: 1, pro: 5, enterprise: Infinity }
};

export const COMPONENT_LIBRARY = [
    {
        id: 'hero-gradient',
        name: 'Hero Gradient',
        category: 'hero',
        thumbnail: '🌅',
        component: {
            type: 'hero',
            content: { title: 'Titre Accrocheur', subtitle: 'Sous-titre percutant', cta: 'Commencer' },
            style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '500px' }
        }
    },
    {
        id: 'hero-image',
        name: 'Hero Image',
        category: 'hero',
        thumbnail: '🖼️',
        component: {
            type: 'hero',
            content: { title: 'Votre Titre', subtitle: 'Description', cta: 'En savoir plus', backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926' },
            style: { minHeight: '600px', backgroundSize: 'cover' }
        }
    },
    {
        id: 'features-3col',
        name: 'Features 3 Colonnes',
        category: 'features',
        thumbnail: '📋',
        component: {
            type: 'grid',
            content: {
                title: 'Nos Services',
                columns: 3,
                items: [
                    { icon: '⚡', title: 'Rapide', text: 'Performance optimale' },
                    { icon: '🎨', title: 'Design', text: 'Interface moderne' },
                    { icon: '🔒', title: 'Sécurisé', text: 'Protection totale' }
                ]
            }
        }
    },
    {
        id: 'cta-centered',
        name: 'CTA Centré',
        category: 'cta',
        thumbnail: '🎯',
        component: {
            type: 'cta',
            content: { title: 'Prêt à commencer ?', text: 'Rejoignez des milliers d\'utilisateurs', cta: 'S\'inscrire gratuitement' },
            style: { background: '#3b82f6', color: 'white', padding: '80px 20px' }
        }
    },
    {
        id: 'gallery-masonry',
        name: 'Galerie Masonry',
        category: 'gallery',
        thumbnail: '🖼️',
        component: {
            type: 'gallery',
            content: {
                title: 'Portfolio',
                layout: 'masonry',
                images: [
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
                    'https://images.unsplash.com/photo-1557683316-973673baf926',
                    'https://images.unsplash.com/photo-1559827260-dc66d52bef19'
                ]
            }
        }
    },
    {
        id: 'testimonials-slider',
        name: 'Témoignages',
        category: 'social-proof',
        thumbnail: '💬',
        component: {
            type: 'testimonials',
            content: {
                title: 'Ce qu\'ils disent',
                items: [
                    { text: 'Excellent produit !', author: 'Marie D.', role: 'CEO' },
                    { text: 'Service impeccable', author: 'Thomas L.', role: 'Designer' }
                ]
            }
        }
    }
];

export const TEMPLATES = [
    {
        id: 'restaurant',
        name: 'Restaurant',
        description: 'Parfait pour restaurants et cafés',
        thumbnail: '🍽️',
        sections: [
            { type: 'hero', id: 'hero-1', content: { title: 'Restaurant Le Gourmet', subtitle: 'Une expérience culinaire unique', cta: 'Réserver' }, animations: { entrance: 'fade', duration: 800 } },
            { type: 'about', id: 'about-1', content: { title: 'Notre Histoire', text: 'Depuis 1990, nous créons des expériences gastronomiques inoubliables.' }, animations: { entrance: 'slide-up', duration: 600 } }
        ]
    },
    {
        id: 'portfolio',
        name: 'Portfolio',
        description: 'Pour designers et développeurs',
        thumbnail: '💼',
        sections: [
            { type: 'hero', id: 'hero-1', content: { title: 'Nina Design', subtitle: 'Designer UI/UX basée à Paris', cta: 'Voir mon travail' } }
        ]
    }
];

export const DEFAULT_BREAKPOINTS = [
    { id: 'mobile', name: 'Mobile', width: 375, icon: Smartphone },
    { id: 'tablet', name: 'Tablet', width: 768, icon: Layout },
    { id: 'ipad-pro', name: 'iPad Pro', width: 1024, icon: Monitor },
    { id: 'desktop', name: 'Desktop', width: 1440, icon: Monitor },
    { id: 'large', name: 'Large', width: 1920, icon: Monitor }
];

export const AI_RESPONSES = {
    'creer site': 'Pour créer un site, cliquez sur "Créer un Site" puis choisissez un template. Je vous recommande le template Restaurant si vous êtes dans la restauration, ou Portfolio pour présenter vos projets.',
    'ajouter section': 'Utilisez la barre latérale gauche pour ajouter des sections. Cliquez sur le type de section souhaité (Hero, Galerie, CTA...) et elle sera ajoutée à votre page.',
    'changer couleur': 'Dans la barre latérale, section "Thème", vous pouvez modifier la couleur principale. Cliquez sur le sélecteur de couleur pour choisir votre palette.',
    'responsive': 'Utilisez les icônes en haut (ordinateur, tablette, mobile) pour prévisualiser votre site sur différents appareils. Vous pouvez ajuster le design pour chaque taille.',
    'exporter': 'Cliquez sur le bouton "Export" en haut à droite. Vous pourrez télécharger votre site en HTML/CSS prêt à être hébergé.',
    'animations': 'Sélectionnez une section, puis dans le panneau de propriétés, activez les animations d\'entrée (fade, slide, scale) avec la durée souhaitée.',
    'images': 'Double-cliquez sur un placeholder d\'image pour télécharger votre propre image ou choisir depuis Unsplash.',
    'grille': 'Utilisez la section "Grid" pour créer des mises en page en colonnes. Vous pouvez drag-to-resize les colonnes directement dans l\'éditeur.',
    'composants': 'La bibliothèque de composants (panneau gauche) contient des blocs pré-conçus que vous pouvez réutiliser : hero, features, CTA, galeries...',
    'default': 'Je peux vous aider avec :\n• Créer et gérer votre site\n• Ajouter des sections et composants\n• Personnaliser le design et les couleurs\n• Rendre votre site responsive\n• Exporter votre code HTML/CSS\n• Configurer les animations\n\nQue voulez-vous faire ?'
};
