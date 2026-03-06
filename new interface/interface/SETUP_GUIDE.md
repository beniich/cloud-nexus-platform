# 🚀 Guide de Configuration - Nexus 2030

Ce guide vous accompagne dans la mise en place complète de l'environnement de développement avec tests, linting et formatage automatique.

## 📦 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Husky (hooks Git)

```bash
npm run prepare
```

Cela va installer les hooks Git qui s'exécuteront automatiquement :
- **pre-commit** : Lint et format du code
- **pre-push** : Vérification des types et tests

### 3. Rendre les hooks exécutables (Linux/Mac)

```bash
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

## 🧪 Tests avec Vitest

### Commandes disponibles

```bash
# Lancer les tests en mode watch
npm run test

# Lancer les tests avec l'UI
npm run test:ui

# Générer le rapport de couverture
npm run test:coverage
```

### Structure des tests

```
src/
├── tests/
│   ├── setup.ts              # Configuration globale
│   ├── utils.tsx             # Utilitaires de test
│   ├── components/           # Tests des composants
│   ├── pages/                # Tests des pages
│   └── services/             # Tests des services
```

### Exemple de test simple

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@tests/utils';
import { MyComponent } from '@components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Bonnes pratiques

✅ **DO:**
- Tester le comportement, pas l'implémentation
- Utiliser `screen.getByRole()` pour l'accessibilité
- Mocker les dépendances externes
- Viser 70%+ de couverture

❌ **DON'T:**
- Tester les détails d'implémentation
- Tester les librairies externes
- Dupliquer les tests
- Ignorer les erreurs de tests

## 🎨 ESLint & Prettier

### Commandes disponibles

```bash
# Vérifier le code
npm run lint

# Corriger automatiquement
npm run lint:fix

# Formater le code
npm run format

# Vérifier le formatage
npm run format:check

# Vérifier les types TypeScript
npm run type-check
```

### Configuration automatique

Les fichiers sont automatiquement formatés :
- **Lors de la sauvegarde** dans VSCode
- **Avant chaque commit** via Husky
- **Lors du build** en production

### Règles importantes

#### ESLint
- ✅ Pas de `console.log` (utilisez `console.warn` ou `console.error`)
- ✅ Imports organisés automatiquement
- ✅ Hooks React respectés
- ✅ Accessibilité (jsx-a11y)

#### Prettier
- Semi-colons obligatoires
- Guillemets simples pour JS/TS
- Guillemets doubles pour JSX
- 80 caractères par ligne
- 2 espaces d'indentation

### Désactiver une règle (rare)

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = fetchData();
```

## 🔧 Configuration VSCode

### Extensions requises

Installez les extensions recommandées (VSCode vous proposera automatiquement) :
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Vitest Explorer
- Error Lens

### Paramètres automatiques

Le fichier `.vscode/settings.json` configure automatiquement :
- ✅ Formatage à la sauvegarde
- ✅ Correction ESLint automatique
- ✅ IntelliSense Tailwind
- ✅ Support TypeScript

## 🏗️ Workflow de développement

### 1. Créer une branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

### 2. Développer

- Écrire le code
- Écrire les tests
- Vérifier que tout passe

```bash
npm run test
npm run lint
npm run type-check
```

### 3. Commit

```bash
git add .
git commit -m "feat: ajout de la nouvelle fonctionnalité"
```

**Les hooks vont automatiquement :**
- ✅ Formater votre code
- ✅ Corriger les erreurs ESLint
- ✅ Organiser les imports

### 4. Push

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

**Le hook pre-push va :**
- ✅ Vérifier les types TypeScript
- ✅ Lancer tous les tests
- ✅ Générer le rapport de couverture

Si quelque chose échoue, le push est annulé.

## 🎯 Objectifs de qualité

### Couverture de tests
- **Minimum** : 70%
- **Objectif** : 80%+
- **Critique** : Components, Services

### ESLint
- **0 erreurs** avant chaque commit
- **0 warnings** avant chaque push

### TypeScript
- **Strict mode** activé
- **0 erreurs** de type

## 🐛 Résolution de problèmes

### Les tests ne passent pas

```bash
# Nettoyer le cache
npm run test -- --clearCache

# Relancer en mode debug
npm run test -- --reporter=verbose
```

### ESLint ne fonctionne pas

```bash
# Réinstaller ESLint
npm install eslint --save-dev

# Vérifier la config
npx eslint --print-config src/App.tsx
```

### Prettier ne formate pas

1. Vérifier l'extension VSCode
2. Vérifier les paramètres VSCode
3. Formater manuellement : `npm run format`

### Husky ne se lance pas

```bash
# Réinstaller Husky
npm run prepare

# Vérifier les permissions
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

## 📊 CI/CD (à venir)

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage
```

## 🚀 Prochaines étapes

### Court terme
- [ ] Ajouter Storybook pour les composants
- [ ] Configurer les tests E2E (Playwright)
- [ ] Mettre en place Renovate pour les dépendances

### Moyen terme
- [ ] Ajouter les tests de performance (Lighthouse CI)
- [ ] Configurer les tests de régression visuelle
- [ ] Mettre en place le bundle analysis

## 📚 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Husky Documentation](https://typicode.github.io/husky/)

## 💡 Tips & Tricks

### Exécuter uniquement certains tests

```bash
# Par fichier
npm run test Dashboard

# Par description
npm run test -t "should render"

# En mode watch
npm run test -- --watch
```

### Déboguer les tests

```typescript
import { screen } from '@testing-library/react';

// Voir le HTML actuel
screen.debug();

// Voir un élément spécifique
screen.debug(screen.getByRole('button'));
```

### Performance des tests

```bash
# Parallélisation
npm run test -- --threads

# Cache
npm run test -- --cache
```

---

**✨ Votre environnement est maintenant prêt pour un développement de qualité professionnelle !**

Pour toute question, consultez la documentation ou créez une issue sur GitHub.
