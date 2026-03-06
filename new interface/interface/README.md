# 🚀 Nexus 2030 - Guide Complet

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-70%25-yellow.svg)

Application React moderne avec TypeScript, Vite, Tailwind CSS et architecture professionnelle.

## 📚 Table des Matières

- [Installation Rapide](#-installation-rapide)
- [Scripts Disponibles](#-scripts-disponibles)
- [Structure du Projet](#-structure-du-projet)
- [Technologies](#-technologies)
- [Configuration](#-configuration)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)

## ⚡ Installation Rapide

### Méthode 1 : Script automatique (recommandé)

```bash
# Rendre le script exécutable
chmod +x setup.sh

# Lancer l'installation complète
./setup.sh --full

# OU installation rapide (sans tests)
./setup.sh --quick
```

### Méthode 2 : Installation manuelle

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/nexus-2030.git
cd nexus-2030

# 2. Installer les dépendances
npm install

# 3. Configurer les hooks Git
npm run prepare

# 4. Créer le fichier .env
cp .env.example .env
# Éditer .env avec vos clés API

# 5. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📜 Scripts Disponibles

### Développement

```bash
npm run dev              # Serveur de développement (HMR)
npm run build            # Build de production
npm run preview          # Prévisualiser le build
```

### Tests

```bash
npm run test             # Tests en mode watch
npm run test:ui          # Interface UI des tests (Vitest UI)
npm run test:coverage    # Rapport de couverture
```

### Qualité du Code

```bash
npm run lint             # Vérifier avec ESLint
npm run lint:fix         # Corriger automatiquement
npm run format           # Formater avec Prettier
npm run format:check     # Vérifier le formatage
npm run type-check       # Vérifier les types TypeScript
```

## 🏗️ Structure du Projet

```
nexus-2030/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── dashboard/       # Composants du dashboard
│   │   └── layout/          # Composants de mise en page
│   │
│   ├── pages/               # Pages de l'application
│   │   ├── Dashboard.tsx
│   │   ├── Auth.tsx
│   │   └── ...
│   │
│   ├── services/            # Services et API
│   │   └── geminiService.ts
│   │
│   ├── tests/               # Configuration et utilitaires de test
│   │   ├── setup.ts
│   │   ├── utils.tsx
│   │   ├── components/      # Tests des composants
│   │   ├── pages/           # Tests des pages
│   │   └── services/        # Tests des services
│   │
│   ├── App.tsx              # Composant racine
│   ├── index.tsx            # Point d'entrée
│   ├── types.ts             # Types TypeScript globaux
│   └── index.css            # Styles globaux
│
├── .vscode/                 # Configuration VSCode
├── .husky/                  # Hooks Git
├── .eslintrc.cjs           # Configuration ESLint
├── .prettierrc.json        # Configuration Prettier
├── vitest.config.ts        # Configuration Vitest
├── vite.config.mts         # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind
└── package.json            # Dépendances et scripts
```

## 🛠️ Technologies

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool ultra-rapide
- **React Router** - Routing

### Styling
- **Tailwind CSS** - Utility-first CSS
- **PostCSS** - CSS processing

### Testing
- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **@testing-library/jest-dom** - Custom matchers

### Code Quality
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

### API & Services
- **Google Gemini AI** - AI integration

## ⚙️ Configuration

### Variables d'Environnement

Créez un fichier `.env` à la racine :

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=votre_cle_api_gemini

# Environment
VITE_ENVIRONMENT=development

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# Monitoring (optionnel)
VITE_SENTRY_DSN=votre_sentry_dsn
```

### ESLint

Le projet utilise ESLint avec :
- Plugin React
- Plugin TypeScript
- Plugin Accessibility (jsx-a11y)
- Plugin React Hooks
- Plugin Import

Configuration dans `.eslintrc.cjs`

### Prettier

Configuration dans `.prettierrc.json` :
- Single quotes
- Semi-colons
- 2 spaces indentation
- Tailwind plugin pour l'ordre des classes

### Git Hooks

Les hooks Husky sont configurés pour :
- **pre-commit** : Lint et format automatiques
- **pre-push** : Tests et vérification de types

## 🧪 Tests

### Écrire des Tests

Exemple de test de composant :

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@tests/utils';
import { MyComponent } from '@components/MyComponent';

describe('MyComponent', () => {
  it('should render with title', () => {
    render(<MyComponent title="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

### Couverture de Code

Objectifs de couverture :
- **Lines** : > 70%
- **Functions** : > 70%
- **Branches** : > 70%
- **Statements** : > 70%

Voir le rapport : `open coverage/index.html`

### Tests E2E (à venir)

Playwright sera ajouté pour les tests end-to-end.

## 🚀 Déploiement

### Build de Production

```bash
# 1. Vérifier la qualité
npm run type-check
npm run lint
npm run test:coverage

# 2. Build
npm run build

# 3. Tester le build localement
npm run preview
```

### Plateformes Supportées

- **Vercel** (recommandé)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

### Configuration Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install"
}
```

### Checklist de Déploiement

Voir [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) pour la liste complète.

Points essentiels :
- ✅ Variables d'environnement configurées
- ✅ Tests passent (> 70% couverture)
- ✅ Lighthouse Score > 90
- ✅ HTTPS activé
- ✅ Monitoring configuré

## 🤝 Contribution

### Workflow

1. **Fork** le projet
2. **Créer** une branche (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'feat: add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### Convention de Commits

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactoring
test: ajout de tests
chore: tâches de maintenance
```

### Standards de Code

- ✅ ESLint doit passer sans erreurs
- ✅ Prettier doit être appliqué
- ✅ Tests doivent être inclus
- ✅ TypeScript strict mode
- ✅ Coverage > 70%

## 📖 Documentation Complète

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Guide d'installation détaillé
- [ROADMAP_AMELIORATIONS.md](./ROADMAP_AMELIORATIONS.md) - Roadmap des améliorations
- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Checklist de déploiement
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentation de l'architecture

## 🐛 Problèmes Courants

### Port 5173 déjà utilisé

```bash
# Changer le port dans vite.config.mts
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Tests qui échouent

```bash
# Nettoyer le cache
npm run test -- --clearCache

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### ESLint ne trouve pas les imports

```bash
# Vérifier tsconfig.json
# Réinstaller eslint-import-resolver-typescript
npm install --save-dev eslint-import-resolver-typescript
```

## 📊 Métriques du Projet

- **Lignes de code** : ~5,000
- **Composants** : 25+
- **Pages** : 8
- **Tests** : 50+
- **Coverage** : 70%+

## 🔗 Liens Utiles

- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation Tailwind](https://tailwindcss.com/)
- [Documentation Vitest](https://vitest.dev/)

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](./LICENSE) pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - *Développeur Principal* - [@votre-username](https://github.com/votre-username)

## 🙏 Remerciements

- Design inspiré par les interfaces futuristes
- Communauté React & TypeScript
- Tous les contributeurs

---

**⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile !**

**🐛 Trouvé un bug ? Ouvrez une [issue](https://github.com/votre-username/nexus-2030/issues)**

**💡 Une idée d'amélioration ? Ouvrez une [discussion](https://github.com/votre-username/nexus-2030/discussions)**
