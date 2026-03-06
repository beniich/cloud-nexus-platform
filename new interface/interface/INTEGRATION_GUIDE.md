# 🎨 Guide d'Intégration - Design System ngrok pour Nexus 2030

Ce guide vous explique comment intégrer le design system inspiré de ngrok dans votre projet Nexus 2030.

## 📦 Fichiers Créés

### Configuration
- `tailwind.config.ngrok.js` - Configuration Tailwind avec thème ngrok
- `styles.ngrok.css` - Styles CSS personnalisés et animations

### Composants
- `HeroSection.tsx` - Hero avec background animé
- `FeatureCard.tsx` - Cards avec glow effects
- `TechnicalDiagram.tsx` - Diagrammes techniques animés
- `CodeBlock.tsx` - Blocs de code avec syntax highlighting
- `SectionHeader.tsx` - En-têtes de section
- `ComplianceBadges.tsx` - Badges de conformité

### Documentation
- `DESIGN_SYSTEM.md` - Documentation complète du design system
- `NexusShowcase.tsx` - Page d'exemple complète

## 🚀 Installation

### 1. Copier les Fichiers de Configuration

```bash
# Remplacer la config Tailwind existante
cp tailwind.config.ngrok.js tailwind.config.js

# Mettre à jour les styles globaux
cp styles.ngrok.css src/index.css
```

### 2. Installer les Dépendances Manquantes

```bash
npm install lucide-react
```

### 3. Copier les Composants

```bash
# Créer le dossier pour les composants ngrok
mkdir -p src/components/ngrok-inspired

# Copier tous les composants
cp components/ngrok-inspired/*.tsx src/components/ngrok-inspired/
```

## 📁 Structure Recommandée

```
src/
├── components/
│   ├── ngrok-inspired/          # Nouveaux composants
│   │   ├── HeroSection.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── TechnicalDiagram.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── SectionHeader.tsx
│   │   └── ComplianceBadges.tsx
│   │
│   ├── dashboard/              # Composants existants
│   │   ├── HologramGraph.tsx
│   │   ├── MetricsCard.tsx
│   │   └── QuickActions.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Sidebar.tsx
│
├── pages/
│   ├── NexusShowcase.tsx      # Nouvelle page showcase
│   ├── Dashboard.tsx          # Page existante
│   └── ...
│
├── index.css                   # Styles globaux (styles.ngrok.css)
└── App.tsx
```

## 🎨 Utilisation des Composants

### Hero Section

```tsx
import { HeroSection } from '@/components/ngrok-inspired/HeroSection';

function HomePage() {
  return (
    <HeroSection
      title="Votre titre accrocheur"
      subtitle="Un sous-titre engageant"
      ctaText="Commencer"
      onCtaClick={() => console.log('CTA clicked')}
    />
  );
}
```

### Feature Cards

```tsx
import { FeatureGrid } from '@/components/ngrok-inspired/FeatureCard';
import { Zap, Shield, Globe } from 'lucide-react';

const features = [
  {
    id: '1',
    icon: Zap,
    title: 'Rapide',
    description: 'Performance ultra-rapide',
    accentColor: 'cyan',
  },
  {
    id: '2',
    icon: Shield,
    title: 'Sécurisé',
    description: 'Sécurité de niveau entreprise',
    accentColor: 'green',
  },
  // ... plus de features
];

function FeaturesSection() {
  return <FeatureGrid features={features} />;
}
```

### Technical Diagram

```tsx
import { TechnicalDiagram } from '@/components/ngrok-inspired/TechnicalDiagram';
import { Globe, Server, Database } from 'lucide-react';

const nodes = [
  { id: 'client', label: 'Client', icon: Globe, x: 20, y: 50 },
  { id: 'server', label: 'Server', icon: Server, x: 50, y: 50 },
  { id: 'db', label: 'Database', icon: Database, x: 80, y: 50 },
];

const connections = [
  { from: 'client', to: 'server', animated: true },
  { from: 'server', to: 'db', label: 'SQL' },
];

function ArchitectureSection() {
  return (
    <TechnicalDiagram
      title="Architecture du système"
      nodes={nodes}
      connections={connections}
    />
  );
}
```

### Code Block

```tsx
import { CodeBlock } from '@/components/ngrok-inspired/CodeBlock';

const code = `
on_http_request:
  - expressions:
      - req.url.path.startsWith('/api')
    actions:
      - type: forward-internal
        config:
          url: https://api.internal
`;

function ConfigExample() {
  return (
    <CodeBlock
      code={code}
      language="yaml"
      filename="config.yml"
      showLineNumbers
      highlightLines={[2, 6]}
    />
  );
}
```

## 🎯 Migration des Composants Existants

### Mettre à Jour MetricsCard

```tsx
// Avant
<div className="bg-gray-800 p-4 rounded">
  <h3>{title}</h3>
  <p>{value}</p>
</div>

// Après (style ngrok)
<div className="glass rounded-xl p-6 hover:border-cyan-500/50 
                transition-all duration-300 group">
  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 
                  flex items-center justify-center mb-4
                  shadow-[0_0_20px_rgba(6,182,212,0.3)]
                  group-hover:scale-110 transition-transform">
    <Icon className="text-cyan-400" />
  </div>
  <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
  <p className="text-3xl font-black text-cyan-400">{value}</p>
</div>
```

### Mettre à Jour les Boutons

```tsx
// Avant
<button className="bg-blue-500 hover:bg-blue-600 px-4 py-2">
  Click me
</button>

// Après (style ngrok)
<button className="btn-primary group">
  <span className="relative z-10">Click me</span>
  {/* Shine effect */}
  <div className="absolute inset-0 rounded-lg bg-gradient-to-r 
                  from-transparent via-white/20 to-transparent
                  translate-x-[-200%] group-hover:translate-x-[200%]
                  transition-transform duration-700" />
</button>
```

## 🌈 Palette de Couleurs à Utiliser

### Primaires
```css
--primary-cyan: #06b6d4
--primary-purple: #a855f7
--primary-green: #10b981
--primary-orange: #f59e0b
--primary-rose: #ec4899
```

### Backgrounds
```css
--bg-primary: #0a0e27      /* Fond principal */
--bg-secondary: #1a1f3a    /* Cards */
--bg-tertiary: #2a2f4a     /* Hover states */
```

### Usage
```tsx
// Cyan pour tech/performance
<FeatureCard accentColor="cyan" />

// Purple pour IA/innovation
<FeatureCard accentColor="purple" />

// Green pour sécurité/success
<FeatureCard accentColor="green" />

// Orange pour alertes
<FeatureCard accentColor="orange" />

// Rose pour design/UX
<FeatureCard accentColor="rose" />
```

## ✨ Classes Utility Personnalisées

### Glassmorphism
```tsx
<div className="glass">Content</div>
<div className="glass-strong">Content</div>
```

### Glow Effects
```tsx
<h1 className="glow-text">Titre avec glow</h1>
<div className="glow-box">Box avec glow</div>
<div className="glow-border">Border avec glow</div>
```

### Gradients
```tsx
<div className="gradient-cyber">Background gradient</div>
<div className="gradient-cyber-animated">Animated gradient</div>
<h1 className="text-gradient">Texte gradient</h1>
```

### Backgrounds
```tsx
<div className="dots-background">Dots pattern</div>
<div className="dots-background-animated">Animated dots</div>
<div className="grid-background">Grid pattern</div>
```

## 🎭 Animations Disponibles

### Entrées
```tsx
<div className="animate-slide-up">Slides up</div>
<div className="animate-slide-down">Slides down</div>
<div className="animate-slide-left">Slides left</div>
<div className="animate-slide-right">Slides right</div>
<div className="animate-fade-in">Fades in</div>
<div className="animate-scale-in">Scales in</div>
```

### Loops
```tsx
<div className="animate-pulse-slow">Slow pulse</div>
<div className="animate-float">Floating</div>
<div className="animate-glow-pulse">Glow pulse</div>
<div className="animate-gradient-shift">Gradient shift</div>
```

### Delays
```tsx
<div className="animate-slide-up animation-delay-100">
  Delayed animation
</div>
```

## 🔧 Bonnes Pratiques

### 1. Cohérence Visuelle
- Utilisez toujours la même couleur d'accent pour un type de contenu
- Respectez les espacements (padding: 4, 6, 8, 12, 16, 24)
- Utilisez les ombres de manière cohérente

### 2. Performance
- Limitez les animations aux éléments visibles
- Utilisez `will-change` pour les animations complexes
- Préférez `transform` et `opacity` pour les animations

### 3. Accessibilité
- Respectez les contrastes de couleur (minimum 4.5:1)
- Ajoutez des labels ARIA où nécessaire
- Testez la navigation au clavier

### 4. Responsive
- Mobile-first approach
- Testez sur tous les breakpoints
- Adaptez les tailles de police

## 📱 Breakpoints

```javascript
sm: '640px'   // Petit mobile
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large
```

## 🎨 Exemples de Pages Complètes

### Page Marketing
```tsx
<HeroSection />
<Section background="gradient">
  <SectionHeader />
  <FeatureGrid />
</Section>
<Section background="dark">
  <TechnicalDiagram />
</Section>
<Section background="gradient">
  <CodeBlock />
</Section>
```

### Dashboard
```tsx
<Header />
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <FeatureCard accentColor="cyan" />
  <FeatureCard accentColor="green" />
  <FeatureCard accentColor="purple" />
  <FeatureCard accentColor="orange" />
</div>
<TechnicalDiagram />
```

## 🐛 Dépannage

### Les animations ne fonctionnent pas
- Vérifiez que `styles.ngrok.css` est importé
- Vérifiez la config Tailwind
- Clear le cache: `npm run dev -- --force`

### Les couleurs ne s'affichent pas
- Vérifiez `tailwind.config.js`
- Rebuild: `npm run build`

### Les glows ne sont pas visibles
- Vérifiez le fond (doit être sombre)
- Ajustez l'opacité dans `boxShadow`

## 📚 Ressources

- [Design System](./DESIGN_SYSTEM.md) - Documentation complète
- [Exemples](./pages/NexusShowcase.tsx) - Page showcase
- [ngrok.com](https://ngrok.com) - Inspiration originale
- [Tailwind Docs](https://tailwindcss.com) - Documentation Tailwind

---

**🎉 Vous êtes maintenant prêt à créer des interfaces magnifiques inspirées de ngrok !**

Pour toute question ou suggestion, consultez la documentation ou créez une issue.
