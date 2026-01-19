import React, { useState } from 'react';
import { Cloud, Shield, FileText, Lock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LegalPages = () => {
    const [activeTab, setActiveTab] = useState('privacy');

    const tabs = [
        { id: 'privacy', label: 'Confidentialité', icon: <Shield className="w-5 h-5" /> },
        { id: 'terms', label: 'Conditions', icon: <FileText className="w-5 h-5" /> },
        { id: 'security', label: 'Sécurité', icon: <Lock className="w-5 h-5" /> },
        { id: 'gdpr', label: 'RGPD', icon: <CheckCircle className="w-5 h-5" /> }
    ];

    const content: Record<string, { title: string; lastUpdate: string; sections: { title: string; content: string; list?: string[] }[] }> = {
        privacy: {
            title: "Politique de Confidentialité",
            lastUpdate: "Dernière mise à jour : 15 janvier 2025",
            sections: [
                {
                    title: "1. Introduction",
                    content: "Chez Cloud Nexus, la protection de vos données personnelles est notre priorité. Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations personnelles lorsque vous utilisez nos services cloud."
                },
                {
                    title: "2. Données collectées",
                    content: "Nous collectons les informations suivantes :",
                    list: [
                        "Informations d'identification : nom, prénom, adresse email, numéro de téléphone",
                        "Données de facturation : adresse, informations de paiement (via nos processeurs sécurisés)",
                        "Données d'utilisation : logs de connexion, adresse IP, données de navigation",
                        "Données techniques : configuration système, type de navigateur, performances"
                    ]
                },
                {
                    title: "3. Utilisation des données",
                    content: "Vos données sont utilisées pour :",
                    list: [
                        "Fournir et améliorer nos services cloud",
                        "Gérer votre compte et vos abonnements",
                        "Traiter vos paiements et facturation",
                        "Vous contacter concernant nos services",
                        "Assurer la sécurité et prévenir la fraude",
                        "Respecter nos obligations légales"
                    ]
                },
                {
                    title: "4. Partage des données",
                    content: "Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations uniquement avec :",
                    list: [
                        "Nos sous-traitants techniques (hébergement, paiement) sous accord strict de confidentialité",
                        "Les autorités légales si requis par la loi",
                        "Nos partenaires avec votre consentement explicite"
                    ]
                },
                {
                    title: "5. Conservation des données",
                    content: "Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. Les données de compte actif sont conservées pendant toute la durée de votre abonnement. Après résiliation, vos données sont archivées pendant 3 ans conformément aux obligations fiscales, puis supprimées définitivement."
                },
                {
                    title: "6. Vos droits",
                    content: "Conformément au RGPD, vous disposez des droits suivants :",
                    list: [
                        "Droit d'accès : obtenir une copie de vos données",
                        "Droit de rectification : corriger vos informations",
                        "Droit à l'effacement : supprimer vos données (sous conditions)",
                        "Droit à la portabilité : transférer vos données",
                        "Droit d'opposition : refuser certains traitements",
                        "Droit de limitation : restreindre le traitement"
                    ]
                },
                {
                    title: "7. Cookies",
                    content: "Nous utilisons des cookies essentiels pour le fonctionnement du site et des cookies analytiques pour améliorer l'expérience utilisateur. Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur."
                },
                {
                    title: "8. Contact",
                    content: "Pour toute question concernant la confidentialité de vos données, contactez notre Délégué à la Protection des Données (DPO) à : dpo@cloudnexus.com"
                }
            ]
        },
        terms: {
            title: "Conditions Générales d'Utilisation",
            lastUpdate: "Dernière mise à jour : 15 janvier 2025",
            sections: [
                {
                    title: "1. Acceptation des conditions",
                    content: "En utilisant les services Cloud Nexus, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services."
                },
                {
                    title: "2. Description des services",
                    content: "Cloud Nexus fournit des services d'infrastructure cloud incluant :",
                    list: [
                        "Hébergement cloud et serveurs dédiés",
                        "Solutions de bases de données managées",
                        "Services de développement (Site Builder, API Management)",
                        "Solutions de sécurité et monitoring",
                        "Support technique et accompagnement"
                    ]
                },
                {
                    title: "3. Création de compte",
                    content: "Pour utiliser nos services, vous devez créer un compte en fournissant des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées sous votre compte. Vous devez avoir au moins 18 ans ou l'âge de la majorité dans votre juridiction."
                },
                {
                    title: "4. Tarification et facturation",
                    content: "Les tarifs de nos services sont indiqués sur notre site web et peuvent être modifiés avec un préavis de 30 jours. La facturation s'effectue selon la périodicité choisie (mensuelle ou annuelle). Le paiement est dû à la date de facturation. En cas de retard de paiement, nous nous réservons le droit de suspendre vos services après notification."
                },
                {
                    title: "5. Utilisation acceptable",
                    content: "Vous vous engagez à ne pas utiliser nos services pour :",
                    list: [
                        "Violer des lois ou réglementations applicables",
                        "Distribuer du contenu illégal, malveillant ou inapproprié",
                        "Mener des activités de hacking ou de compromission de sécurité",
                        "Envoyer du spam ou du contenu non sollicité",
                        "Porter atteinte aux droits de propriété intellectuelle",
                        "Surcharger ou perturber nos infrastructures"
                    ]
                },
                {
                    title: "6. Garanties et SLA",
                    content: "Nous garantissons une disponibilité de 99.9% pour nos services d'infrastructure (hors maintenance planifiée). En cas de non-respect de notre SLA, vous pouvez bénéficier de crédits de service selon notre politique de compensation. Nos services sont fournis 'en l'état' sans garantie implicite de résultats spécifiques."
                },
                {
                    title: "7. Limitation de responsabilité",
                    content: "Cloud Nexus ne pourra être tenu responsable des dommages indirects, accessoires, spéciaux ou consécutifs. Notre responsabilité totale est limitée au montant payé pour les services au cours des 12 derniers mois. Vous êtes responsable de la sauvegarde de vos données."
                },
                {
                    title: "8. Résiliation",
                    content: "Vous pouvez résilier votre compte à tout moment depuis votre tableau de bord. Nous pouvons résilier votre compte en cas de violation des CGU après notification. Les données sont conservées 30 jours après résiliation pour permettre une récupération, puis supprimées définitivement."
                },
                {
                    title: "9. Modifications des CGU",
                    content: "Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications importantes seront notifiées par email 30 jours avant leur entrée en vigueur. L'utilisation continue de nos services après modification constitue votre acceptation des nouvelles conditions."
                },
                {
                    title: "10. Droit applicable",
                    content: "Ces CGU sont régies par le droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Paris, France, sauf disposition légale contraire."
                }
            ]
        },
        security: {
            title: "Politique de Sécurité",
            lastUpdate: "Dernière mise à jour : 15 janvier 2025",
            sections: [
                {
                    title: "1. Notre engagement sécurité",
                    content: "La sécurité est au cœur de notre infrastructure Cloud Nexus. Nous mettons en œuvre les meilleures pratiques de l'industrie pour protéger vos données et assurer la continuité de vos services."
                },
                {
                    title: "2. Sécurité de l'infrastructure",
                    content: "Notre infrastructure repose sur :",
                    list: [
                        "Datacenters certifiés Tier III+ avec contrôle d'accès biométrique",
                        "Redondance N+1 sur tous les composants critiques (alimentations, climatisation, réseau)",
                        "Pare-feu nouvelle génération et détection d'intrusion (IDS/IPS)",
                        "Segmentation réseau et isolation des environnements clients",
                        "Mises à jour de sécurité automatiques et patches critiques sous 24h"
                    ]
                },
                {
                    title: "3. Chiffrement des données",
                    content: "Protection multicouche de vos données :",
                    list: [
                        "Chiffrement en transit : TLS 1.3 minimum pour toutes les communications",
                        "Chiffrement au repos : AES-256 pour les données stockées",
                        "Gestion sécurisée des clés via HSM (Hardware Security Modules)",
                        "Certificats SSL/TLS gratuits et renouvelés automatiquement",
                        "Support du chiffrement client avec clés gérées par le client (BYOK)"
                    ]
                },
                {
                    title: "4. Contrôle d'accès",
                    content: "Gestion rigoureuse des accès :",
                    list: [
                        "Authentification multi-facteurs (MFA) obligatoire pour les comptes admin",
                        "Gestion des accès basée sur les rôles (RBAC) avec principe du moindre privilège",
                        "Logs d'audit complets de toutes les actions administratives",
                        "Révocation automatique des accès inactifs après 90 jours",
                        "Sessions chiffrées avec timeout automatique"
                    ]
                },
                {
                    title: "5. Surveillance et détection",
                    content: "Monitoring 24/7 de la sécurité :",
                    list: [
                        "Centre de Sécurité Opérationnel (SOC) actif en permanence",
                        "Détection d'anomalies par intelligence artificielle",
                        "Analyse comportementale des utilisateurs (UEBA)",
                        "Scanning de vulnérabilités hebdomadaire automatisé",
                        "Tests de pénétration par des experts externes trimestriels"
                    ]
                },
                {
                    title: "6. Conformité et certifications",
                    content: "Nous maintenons les certifications suivantes :",
                    list: [
                        "ISO 27001 - Management de la sécurité de l'information",
                        "SOC 2 Type II - Contrôles de sécurité et disponibilité",
                        "PCI DSS - Sécurité des données de cartes bancaires",
                        "Certification HDS - Hébergement de données de santé (France)",
                        "Conformité RGPD complète"
                    ]
                },
                {
                    title: "7. Gestion des incidents",
                    content: "En cas d'incident de sécurité :",
                    list: [
                        "Équipe d'intervention disponible 24/7/365",
                        "Procédure de réponse aux incidents documentée et testée",
                        "Notification des clients affectés sous 72h conformément au RGPD",
                        "Analyse post-incident et mesures correctives",
                        "Transparence totale dans notre communication"
                    ]
                },
                {
                    title: "8. Sauvegardes",
                    content: "Protection de vos données :",
                    list: [
                        "Sauvegardes automatiques quotidiennes avec rétention de 30 jours",
                        "Réplication géographique sur 3 zones de disponibilité minimum",
                        "Tests de restauration mensuels pour garantir l'intégrité",
                        "Snapshots à la demande disponibles instantanément",
                        "Stockage des backups chiffrés dans des emplacements séparés"
                    ]
                },
                {
                    title: "9. Formation et sensibilisation",
                    content: "Notre équipe est notre première ligne de défense :",
                    list: [
                        "Formation sécurité obligatoire pour tous les employés",
                        "Simulations de phishing et exercices de sécurité réguliers",
                        "Certification des équipes techniques aux meilleures pratiques",
                        "Culture de sécurité encouragée à tous les niveaux"
                    ]
                },
                {
                    title: "10. Programme de divulgation responsable",
                    content: "Nous encourageons la recherche de sécurité responsable. Si vous découvrez une vulnérabilité, contactez security@cloudnexus.com. Nous nous engageons à répondre sous 48h et à travailler avec vous pour résoudre le problème rapidement."
                }
            ]
        },
        gdpr: {
            title: "Conformité RGPD",
            lastUpdate: "Dernière mise à jour : 15 janvier 2025",
            sections: [
                {
                    title: "1. Notre engagement RGPD",
                    content: "Cloud Nexus est pleinement conforme au Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne. Nous nous engageons à traiter vos données personnelles de manière légale, équitable et transparente."
                },
                {
                    title: "2. Base légale du traitement",
                    content: "Nous traitons vos données personnelles sur les bases légales suivantes :",
                    list: [
                        "Exécution du contrat : pour fournir nos services cloud",
                        "Obligation légale : pour respecter nos obligations fiscales et comptables",
                        "Intérêt légitime : pour améliorer nos services et assurer la sécurité",
                        "Consentement : pour les communications marketing (révocable à tout moment)"
                    ]
                },
                {
                    title: "3. Principes de protection des données",
                    content: "Nous respectons les principes fondamentaux du RGPD :",
                    list: [
                        "Licéité, loyauté et transparence dans le traitement",
                        "Limitation des finalités : données utilisées uniquement pour les objectifs déclarés",
                        "Minimisation des données : collecte uniquement des informations nécessaires",
                        "Exactitude : maintien de données à jour et correctes",
                        "Limitation de conservation : suppression après expiration de la finalité",
                        "Intégrité et confidentialité : sécurité appropriée des données"
                    ]
                },
                {
                    title: "4. Vos droits en tant que personne concernée",
                    content: "Le RGPD vous accorde les droits suivants que nous honorons pleinement :",
                    list: [
                        "Droit d'accès : obtenez confirmation du traitement et copie de vos données (délai : 1 mois)",
                        "Droit de rectification : corrigez vos données inexactes ou incomplètes (immédiat via dashboard)",
                        "Droit à l'effacement ('droit à l'oubli') : supprimez vos données sous conditions (délai : 48h)",
                        "Droit à la limitation : restreignez le traitement dans certains cas",
                        "Droit à la portabilité : recevez vos données dans un format structuré (JSON/CSV)",
                        "Droit d'opposition : refusez un traitement basé sur l'intérêt légitime",
                        "Droit de ne pas faire l'objet d'une décision automatisée"
                    ]
                },
                {
                    title: "5. Exercice de vos droits",
                    content: "Pour exercer vos droits RGPD :",
                    list: [
                        "Via votre tableau de bord : fonctionnalités en libre-service pour accès, rectification, export",
                        "Par email : dpo@cloudnexus.com avec justificatif d'identité",
                        "Par courrier : Cloud Nexus - DPO, 123 Avenue des Champs-Élysées, 75008 Paris",
                        "Délai de réponse : maximum 1 mois (extensible à 3 mois pour demandes complexes)",
                        "Gratuit sauf demandes manifestement infondées ou excessives"
                    ]
                },
                {
                    title: "6. Transferts de données hors UE",
                    content: "Vos données sont hébergées exclusivement dans l'Union Européenne. Si nous devons transférer des données hors UE (ex: support client), nous utilisons :",
                    list: [
                        "Clauses contractuelles types approuvées par la Commission Européenne",
                        "Décisions d'adéquation pour pays reconnus sûrs",
                        "Mesures de protection supplémentaires (chiffrement, pseudonymisation)",
                        "Votre consentement explicite si requis"
                    ]
                },
                {
                    title: "7. Sous-traitants",
                    content: "Nous travaillons uniquement avec des sous-traitants conformes RGPD :",
                    list: [
                        "Contrats de sous-traitance conformes à l'article 28 du RGPD",
                        "Audits réguliers de conformité de nos partenaires",
                        "Liste des sous-traitants disponible sur demande",
                        "Notification préalable en cas de changement de sous-traitant"
                    ]
                },
                {
                    title: "8. Violations de données",
                    content: "En cas de violation de données personnelles :",
                    list: [
                        "Notification à la CNIL sous 72h si risque pour vos droits",
                        "Notification directe aux personnes concernées si risque élevé",
                        "Documentation détaillée de l'incident et mesures prises",
                        "Mise en œuvre immédiate de mesures correctives",
                        "Communication transparente sur notre blog sécurité"
                    ]
                },
                {
                    title: "9. Analyse d'impact (DPIA)",
                    content: "Nous réalisons des analyses d'impact sur la protection des données (DPIA) pour tout nouveau traitement susceptible d'engendrer un risque élevé. Les DPIA sont documentées et mises à jour régulièrement."
                },
                {
                    title: "10. Délégué à la Protection des Données",
                    content: "Notre DPO est votre interlocuteur privilégié pour toute question RGPD :",
                    list: [
                        "Email : dpo@cloudnexus.com",
                        "Disponible pour répondre à vos questions sous 48h",
                        "Supervise la conformité RGPD de Cloud Nexus",
                        "Point de contact avec la CNIL et autres autorités de contrôle"
                    ]
                },
                {
                    title: "11. Droit de réclamation",
                    content: "Si vous estimez que vos droits RGPD ne sont pas respectés, vous pouvez :",
                    list: [
                        "Nous contacter d'abord pour résoudre le problème à l'amiable",
                        "Déposer une réclamation auprès de la CNIL (autorité française) : www.cnil.fr",
                        "Saisir l'autorité de protection des données de votre pays de résidence"
                    ]
                }
            ]
        }
    };

    const activeContent = content[activeTab];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            {/* Navigation */}
            <nav className="border-b border-orange-200 backdrop-blur-xl bg-white/80 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-300/50">
                                <Cloud className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                Cloud Nexus
                            </span>
                        </Link>
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Accueil</Link>
                            <Link to="/services" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Services</Link>
                            <Link to="/about" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">À propos</Link>
                            <Link to="/contact" className="text-slate-600 hover:text-orange-600 transition-colors font-medium">Contact</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Informations
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                            Légales
                        </span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Transparence et conformité : découvrez nos engagements et vos droits
                    </p>
                </div>
            </section>

            {/* Tabs */}
            <section className="px-6 pb-12">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-400/50'
                                        : 'bg-white/80 border border-orange-200 text-slate-700 hover:bg-orange-50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="px-6 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-3xl p-12 shadow-xl">
                        <h2 className="text-4xl font-bold text-slate-800 mb-3">{activeContent.title}</h2>
                        <p className="text-slate-600 mb-8 text-sm">{activeContent.lastUpdate}</p>

                        <div className="space-y-8">
                            {activeContent.sections.map((section, idx) => (
                                <div key={idx} className="pb-8 border-b border-orange-200 last:border-0">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4">{section.title}</h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">{section.content}</p>
                                    {section.list && (
                                        <ul className="space-y-3 ml-6">
                                            {section.list.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-2"></div>
                                                    <span className="text-slate-600 leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-orange-50 border border-orange-200 rounded-2xl">
                            <h4 className="font-bold text-slate-800 mb-2">Des questions ?</h4>
                            <p className="text-slate-600 mb-4">
                                Pour toute question concernant cette politique, contactez-nous :
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="mailto:legal@cloudnexus.com" className="text-orange-600 font-semibold hover:underline">
                                    legal@cloudnexus.com
                                </a>
                                <span className="text-slate-400">•</span>
                                <Link to="/contact" className="text-orange-600 font-semibold hover:underline">
                                    Formulaire de contact
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-orange-200 py-12 px-6 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto text-center text-slate-600">
                    <p>© 2025 Cloud Nexus Platform. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
};

export default LegalPages;
