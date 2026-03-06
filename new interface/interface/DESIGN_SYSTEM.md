# 🎨 Design System Nexus 2030 - Inspiré par ngrok.com

Ce document définit le système de design complet pour Nexus 2030, inspiré de l'interface moderne et futuriste de ngrok.

## 🎯 Principes de Design

### Vision
- **Futuriste & High-tech** : Interface qui évoque la technologie avancée
- **Clarté & Lisibilité** : Information complexe présentée simplement
- **Interactivité** : Animations fluides et micro-interactions
- **Minimalisme technique** : Épuré mais riche en détails

---

## 🌈 Palette de Couleurs

### Couleurs Primaires
```css
/* Cyan électrique (accent principal) */
--primary: #06b6d4;
--primary-light: #22d3ee;
--primary-dark: #0891b2;
--primary-glow: rgba(6, 182, 212, 0.4);

/* Vert néon (succès/actif) */
--success: #10b981;
--success-glow: rgba(16, 185, 129, 0.3);

/* Violet (passerelle IA) */
--ai-purple: #a855f7;
--ai-purple-glow: rgba(168, 85, 247, 0.3);

/* Orange (alerte/warning) */
--warning: #f59e0b;
--warning-glow: rgba(245, 158, 11, 0.3);

/* Rose/Rouge (périphérique/danger) */
--danger: #ef4444;
--danger-rose: #ec4899;
```

### Couleurs de Fond
```css
/* Arrière-plans sombres */
--bg-primary: #0a0e27;        /* Fond principal ultra-sombre */
--bg-secondary: #1a1f3a;      /* Cards et sections */
--bg-tertiary: #2a2f4a;       /* Hover states */
--bg-elevated: #1e2642;       /* Éléments au-dessus */

/* Glassmorphism */
--glass-bg: rgba(26, 31, 58, 0.7);
--glass-border: rgba(255, 255, 255, 0.1);
```

### Couleurs de Texte
```css
--text-primary: #ffffff;
--text-secondary: #94a3b8;
--text-tertiary: #64748b;
--text-muted: #475569;
```

---

## 🔤 Typographie

### Familles de Polices
```css
/* Headlines & Titres */
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
font-weight: 700-900;

/* Body Text */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
font-weight: 400-600;

/* Code & Monospace */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Échelle Typographique
```css
/* Display - Très gros titres */
--text-display: 4rem;        /* 64px */
--text-display-sm: 3rem;     /* 48px */

/* Headings */
--text-h1: 2.5rem;           /* 40px */
--text-h2: 2rem;             /* 32px */
--text-h3: 1.5rem;           /* 24px */
--text-h4: 1.25rem;          /* 20px */

/* Body */
--text-lg: 1.125rem;         /* 18px */
--text-base: 1rem;           /* 16px */
--text-sm: 0.875rem;         /* 14px */
--text-xs: 0.75rem;          /* 12px */
```

---

## 🧩 Composants Clés (Style ngrok)

### 1. Hero Section avec Points Animés
```jsx
// Background avec pattern de points
<div className="relative min-h-screen bg-[#0a0e27] overflow-hidden">
  {/* Pattern de points animés */}
  <div className="absolute inset-0 opacity-30">
    <div className="absolute inset-0" 
         style={{
           backgroundImage: `radial-gradient(circle, rgba(6,182,212,0.3) 1px, transparent 1px)`,
           backgroundSize: '50px 50px'
         }}
    />
  </div>
  
  {/* Contenu */}
  <div className="relative z-10">
    <h1 className="text-6xl font-black text-white mb-6">
      Acheminez, sécurisez et transformez le trafic
    </h1>
  </div>
</div>
```

### 2. Cards Glassmorphiques
```jsx
<div className="group relative">
  {/* Glow effect */}
  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 
                  rounded-xl opacity-0 group-hover:opacity-30 blur-lg transition duration-500" />
  
  {/* Card principale */}
  <div className="relative bg-[#1a1f3a] backdrop-blur-xl bg-opacity-70 
                  border border-white/10 rounded-xl p-8 
                  hover:border-cyan-500/50 transition duration-300">
    {/* Icon avec glow */}
    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4
                    shadow-[0_0_20px_rgba(6,182,212,0.3)]">
      <Icon className="text-cyan-400" />
    </div>
    
    {/* Titre */}
    <h3 className="text-xl font-bold text-white mb-2">
      Titre de la carte
    </h3>
    
    {/* Description */}
    <p className="text-gray-400 leading-relaxed">
      Description avec texte secondaire
    </p>
  </div>
</div>
```

### 3. Diagrammes Techniques Animés
```jsx
<div className="relative py-16 px-8 bg-gradient-to-b from-transparent to-[#1a1f3a]/50">
  {/* Titre du diagramme */}
  <p className="text-cyan-400 text-sm font-mono uppercase tracking-wider mb-8">
    Figure 1 - Architecture du système
  </p>
  
  {/* Container du diagramme */}
  <div className="flex items-center justify-between gap-8">
    {/* Nœud Internet */}
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-600 
                      flex items-center justify-center mb-2">
        <Globe className="text-gray-400" />
      </div>
      <span className="text-gray-400 text-sm">the internet</span>
    </div>
    
    {/* Connexions animées */}
    <svg className="flex-1 h-2">
      <line x1="0" y1="1" x2="100%" y2="1" 
            stroke="url(#gradient)" strokeWidth="2"
            strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" 
                 from="0" to="10" dur="1s" repeatCount="indefinite" />
      </line>
      <defs>
        <linearGradient id="gradient">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
    
    {/* Nœud Central (ngrok/nexus) */}
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-gray-900 border-2 border-cyan-500
                      flex items-center justify-center
                      shadow-[0_0_40px_rgba(6,182,212,0.5)]">
        <span className="text-3xl font-bold text-white">n</span>
      </div>
      
      {/* Pulse effect */}
      <div className="absolute inset-0 rounded-full border-2 border-cyan-500
                      animate-ping opacity-20" />
    </div>
  </div>
</div>
```

### 4. Code Blocks avec Syntax Highlighting
```jsx
<div className="bg-[#1a1f3a] rounded-lg border border-gray-700 overflow-hidden">
  {/* Header */}
  <div className="px-4 py-2 bg-[#0a0e27] border-b border-gray-700 
                  flex items-center justify-between">
    <span className="text-gray-400 text-sm font-mono">config.yaml</span>
    <button className="text-cyan-400 hover:text-cyan-300 text-sm">
      Copy
    </button>
  </div>
  
  {/* Code content */}
  <pre className="p-4 overflow-x-auto">
    <code className="text-sm font-mono">
      <span className="text-purple-400">on_http_request:</span>
      <span className="text-gray-400"> # comments</span>
      <span className="text-cyan-400">  - expressions:</span>
      <span className="text-green-400">      - req.url.path.startsWith('/api')</span>
    </code>
  </pre>
</div>
```

### 5. Badges avec Checkmarks
```jsx
<div className="flex flex-wrap gap-4">
  {['SOC2 Type II', 'RGPD', 'HIPAA', 'CCPA'].map((badge) => (
    <div key={badge} 
         className="flex items-center gap-2 px-4 py-2 rounded-full
                    bg-green-500/10 border border-green-500/30">
      <Check className="w-4 h-4 text-green-400" />
      <span className="text-green-300 text-sm font-medium">{badge}</span>
    </div>
  ))}
</div>
```

### 6. Feature Grid (Style ngrok)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {features.map((feature) => (
    <div key={feature.id} 
         className="group relative bg-[#1a1f3a] rounded-xl p-6
                    border border-gray-700 hover:border-cyan-500/50
                    transition-all duration-300 cursor-pointer">
      {/* Icon avec couleur dynamique */}
      <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center
                      ${feature.colorClass} shadow-lg`}>
        <feature.icon className="w-6 h-6 text-white" />
      </div>
      
      {/* Titre */}
      <h3 className="text-lg font-bold text-white mb-2 
                     group-hover:text-cyan-400 transition-colors">
        {feature.title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed">
        {feature.description}
      </p>
      
      {/* Arrow indicator */}
      <ArrowRight className="absolute top-6 right-6 w-5 h-5 text-gray-600
                            group-hover:text-cyan-400 group-hover:translate-x-1
                            transition-all duration-300" />
    </div>
  ))}
</div>
```

---

## ✨ Animations & Effets

### 1. Glow Effects
```css
/* Text glow */
.glow-text {
  text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
}

/* Box glow */
.glow-box {
  box-shadow: 
    0 0 20px rgba(6, 182, 212, 0.3),
    0 0 40px rgba(6, 182, 212, 0.2),
    inset 0 0 20px rgba(6, 182, 212, 0.1);
}

/* Border glow on hover */
.glow-border:hover {
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.4);
  border-color: #06b6d4;
}
```

### 2. Gradient Animations
```css
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animated-gradient {
  background: linear-gradient(
    -45deg,
    #06b6d4,
    #a855f7,
    #ec4899,
    #06b6d4
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

### 3. Pulse Animations
```css
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

### 4. Slide & Fade Entrances
```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}
```

---

## 🎭 Micro-interactions

### Hover States
```jsx
// Card hover avec scale subtil
className="transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"

// Button avec glow
className="relative overflow-hidden group
           hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]
           transition-all duration-300"

// Icon rotation
className="transform group-hover:rotate-12 transition-transform duration-300"
```

### Active States
```jsx
// Button press effect
className="active:scale-95 transition-transform duration-150"

// Ripple effect (custom implementation)
const [ripples, setRipples] = useState([]);

const addRipple = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const ripple = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    id: Date.now()
  };
  setRipples([...ripples, ripple]);
};
```

---

## 📐 Layout Patterns

### 1. Section Headers (Style ngrok)
```jsx
<div className="mb-12">
  <div className="flex items-center gap-3 mb-4">
    <Icon className="text-cyan-400" />
    <span className="text-cyan-400 uppercase text-sm font-mono tracking-wider">
      Passerelle API
    </span>
  </div>
  <h2 className="text-4xl font-black text-white mb-4">
    Fournir et sécuriser les API
  </h2>
  <p className="text-xl text-gray-400 max-w-3xl">
    Description engageante qui explique le concept
  </p>
</div>
```

### 2. Two-Column Layout
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
  {/* Texte */}
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">
      Titre de la fonctionnalité
    </h2>
    <ul className="space-y-4">
      {features.map(f => (
        <li className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
          <span className="text-gray-300">{f.text}</span>
        </li>
      ))}
    </ul>
  </div>
  
  {/* Visuel/Diagramme */}
  <div className="relative">
    <TechnicalDiagram />
  </div>
</div>
```

---

## 🔧 Utilitaires Tailwind Personnalisés

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfeff',
          500: '#06b6d4',
          900: '#164e63',
        },
        glass: 'rgba(26, 31, 58, 0.7)',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(6, 182, 212, 0.3)',
        'glow': '0 0 20px rgba(6, 182, 212, 0.4)',
        'glow-lg': '0 0 40px rgba(6, 182, 212, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient-shift 15s ease infinite',
      },
    },
  },
}
```

---

## 📱 Responsive Design

### Breakpoints Strategy
```jsx
// Mobile-first avec progressive enhancement
<div className="
  px-4 py-8           /* Mobile */
  md:px-8 md:py-12   /* Tablet */
  lg:px-16 lg:py-20  /* Desktop */
  xl:px-24 xl:py-24  /* Large desktop */
">
```

### Navigation Adaptative
```jsx
// Desktop: Sidebar fixe
// Mobile: Bottom navigation + Burger menu
const isMobile = useMediaQuery('(max-width: 768px)');

{isMobile ? <BottomNav /> : <Sidebar />}
```

---

## 🎨 Exemples Complets

Voir les composants créés dans le dossier `/components/ngrok-inspired/`:
- `HeroSection.tsx` - Hero avec background animé
- `FeatureCard.tsx` - Card avec glow effect
- `TechnicalDiagram.tsx` - Diagrammes animés
- `CodeBlock.tsx` - Blocs de code stylisés
- `ComplianceBadges.tsx` - Badges de conformité
- `SectionHeader.tsx` - En-têtes de section

---

**🎯 Objectif**: Créer une interface qui combine l'esthétique futuriste de ngrok avec la fonctionnalité de Nexus 2030, tout en restant accessible et performante.
