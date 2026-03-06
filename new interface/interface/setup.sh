#!/bin/bash

# 🚀 Script d'installation automatique - Nexus 2030
# Ce script configure l'environnement complet de développement

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_step() {
    echo -e "\n${BLUE}===================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================${NC}\n"
}

# Vérifier Node.js
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        print_info "Installez Node.js depuis: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_warning "Node.js version $NODE_VERSION détectée. Version 18+ recommandée."
    else
        print_success "Node.js $(node -v) détecté"
    fi
}

# Vérifier npm
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    print_success "npm $(npm -v) détecté"
}

# Installer les dépendances
install_dependencies() {
    print_step "Installation des dépendances"
    
    print_info "Installation des packages npm..."
    npm install
    
    print_success "Dépendances installées"
}

# Configurer Git hooks
setup_git_hooks() {
    print_step "Configuration des Git hooks"
    
    if [ -d ".git" ]; then
        print_info "Installation de Husky..."
        npm run prepare
        
        # Rendre les hooks exécutables
        if [ -f ".husky/pre-commit" ]; then
            chmod +x .husky/pre-commit
            print_success "Hook pre-commit configuré"
        fi
        
        if [ -f ".husky/pre-push" ]; then
            chmod +x .husky/pre-push
            print_success "Hook pre-push configuré"
        fi
    else
        print_warning "Pas de dépôt Git détecté. Hooks non configurés."
    fi
}

# Créer le fichier .env
setup_env_file() {
    print_step "Configuration des variables d'environnement"
    
    if [ ! -f ".env" ]; then
        print_info "Création du fichier .env..."
        cat > .env << EOF
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Environment
VITE_ENVIRONMENT=development

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# Sentry (optionnel)
# VITE_SENTRY_DSN=your_sentry_dsn_here
EOF
        print_success "Fichier .env créé"
        print_warning "N'oubliez pas de configurer vos clés API dans le fichier .env"
    else
        print_info "Le fichier .env existe déjà"
    fi
}

# Vérifier ESLint
check_eslint() {
    print_step "Vérification ESLint"
    
    print_info "Lancement de ESLint..."
    if npm run lint; then
        print_success "Aucune erreur ESLint détectée"
    else
        print_warning "Des erreurs ESLint ont été détectées"
        print_info "Lancez 'npm run lint:fix' pour corriger automatiquement"
    fi
}

# Lancer les tests
run_tests() {
    print_step "Lancement des tests"
    
    print_info "Exécution des tests..."
    if npm run test -- --run; then
        print_success "Tous les tests passent"
    else
        print_error "Certains tests ont échoué"
        exit 1
    fi
}

# Vérifier TypeScript
check_typescript() {
    print_step "Vérification TypeScript"
    
    print_info "Vérification des types..."
    if npm run type-check; then
        print_success "Aucune erreur de type détectée"
    else
        print_error "Des erreurs TypeScript ont été détectées"
        exit 1
    fi
}

# Générer le rapport de couverture
generate_coverage() {
    print_step "Génération du rapport de couverture"
    
    print_info "Génération de la couverture des tests..."
    npm run test:coverage
    
    if [ -d "coverage" ]; then
        print_success "Rapport de couverture généré dans ./coverage"
        print_info "Ouvrez ./coverage/index.html pour voir le rapport détaillé"
    fi
}

# Build du projet
build_project() {
    print_step "Build du projet"
    
    print_info "Compilation du projet..."
    if npm run build; then
        print_success "Build réussi"
        
        # Afficher la taille du bundle
        if [ -d "dist" ]; then
            BUNDLE_SIZE=$(du -sh dist | cut -f1)
            print_info "Taille du bundle: $BUNDLE_SIZE"
        fi
    else
        print_error "Le build a échoué"
        exit 1
    fi
}

# Afficher le résumé
show_summary() {
    print_step "Résumé de l'installation"
    
    echo ""
    print_success "Configuration terminée avec succès !"
    echo ""
    print_info "Commandes disponibles:"
    echo "  npm run dev              - Démarrer le serveur de développement"
    echo "  npm run build            - Build de production"
    echo "  npm run test             - Lancer les tests"
    echo "  npm run test:ui          - Interface UI des tests"
    echo "  npm run test:coverage    - Rapport de couverture"
    echo "  npm run lint             - Vérifier le code"
    echo "  npm run lint:fix         - Corriger automatiquement"
    echo "  npm run format           - Formater le code"
    echo "  npm run type-check       - Vérifier les types TypeScript"
    echo ""
    print_info "Prochaines étapes:"
    echo "  1. Configurer vos clés API dans .env"
    echo "  2. Lancer le serveur: npm run dev"
    echo "  3. Ouvrir http://localhost:5173"
    echo ""
    print_warning "N'oubliez pas de lire SETUP_GUIDE.md pour plus de détails"
    echo ""
}

# Menu principal
main_menu() {
    clear
    echo -e "${BLUE}"
    echo "  ╔═══════════════════════════════════════╗"
    echo "  ║                                       ║"
    echo "  ║     🚀 Nexus 2030 - Installation     ║"
    echo "  ║                                       ║"
    echo "  ╚═══════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    echo "Que souhaitez-vous faire ?"
    echo ""
    echo "  1) Installation complète (recommandé)"
    echo "  2) Installation rapide (sans tests)"
    echo "  3) Installation minimale (dépendances uniquement)"
    echo "  4) Vérification de l'environnement"
    echo "  5) Quitter"
    echo ""
    read -p "Votre choix [1-5]: " choice
    
    case $choice in
        1)
            full_installation
            ;;
        2)
            quick_installation
            ;;
        3)
            minimal_installation
            ;;
        4)
            environment_check
            ;;
        5)
            print_info "Au revoir !"
            exit 0
            ;;
        *)
            print_error "Choix invalide"
            sleep 2
            main_menu
            ;;
    esac
}

# Installation complète
full_installation() {
    print_step "🚀 Installation complète"
    
    check_node
    check_npm
    install_dependencies
    setup_env_file
    setup_git_hooks
    check_typescript
    check_eslint
    run_tests
    generate_coverage
    build_project
    show_summary
}

# Installation rapide
quick_installation() {
    print_step "⚡ Installation rapide"
    
    check_node
    check_npm
    install_dependencies
    setup_env_file
    setup_git_hooks
    check_typescript
    check_eslint
    show_summary
}

# Installation minimale
minimal_installation() {
    print_step "📦 Installation minimale"
    
    check_node
    check_npm
    install_dependencies
    setup_env_file
    show_summary
}

# Vérification de l'environnement
environment_check() {
    print_step "🔍 Vérification de l'environnement"
    
    check_node
    check_npm
    
    # Vérifier Git
    if command -v git &> /dev/null; then
        print_success "Git $(git --version | cut -d' ' -f3) détecté"
    else
        print_warning "Git n'est pas installé"
    fi
    
    # Vérifier les dépendances
    if [ -d "node_modules" ]; then
        print_success "Dépendances installées"
    else
        print_warning "Dépendances non installées (lancez 'npm install')"
    fi
    
    # Vérifier .env
    if [ -f ".env" ]; then
        print_success "Fichier .env présent"
    else
        print_warning "Fichier .env manquant"
    fi
    
    echo ""
    read -p "Appuyez sur Entrée pour revenir au menu..."
    main_menu
}

# Point d'entrée
if [ "$1" == "--full" ]; then
    full_installation
elif [ "$1" == "--quick" ]; then
    quick_installation
elif [ "$1" == "--minimal" ]; then
    minimal_installation
elif [ "$1" == "--check" ]; then
    environment_check
else
    main_menu
fi
