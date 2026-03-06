import {
  Zap, Globe, Shield, Cpu, Database, Lock,
  Workflow, Code, Gauge, Server
} from 'lucide-react';
import { HeroSection } from '../components/ngrok-inspired/HeroSection';
import { FeatureGrid } from '../components/ngrok-inspired/FeatureCard';
import { TechnicalDiagram } from '../components/ngrok-inspired/TechnicalDiagram';
import { CodeBlock } from '../components/ngrok-inspired/CodeBlock';
import { SectionHeader, Section, Container } from '../components/ngrok-inspired/SectionHeader';
import { ComplianceSection } from '../components/ngrok-inspired/ComplianceBadges';
import { Link } from 'react-router-dom';

export function NexusShowcasePage() {
  const features = [
    {
      id: '1',
      icon: Globe,
      title: 'Opérateur Kubernetes',
      description: "Utilisez vos manifestes Kubernetes existants. L'opérateur récupère les ressources API standardisées d'Ingress et de Gateway.",
      accentColor: 'cyan' as const,
    },
    {
      id: '2',
      icon: Zap,
      title: 'API et Intégrations',
      description: 'Entièrement programmable. Chaque fonctionnalité dispose d\'une API pour créer rapidement vos propres intégrations.',
      accentColor: 'purple' as const,
    },
    {
      id: '3',
      icon: Shield,
      title: 'Protection DDoS',
      description: 'Protégez vos serveurs d\'origine contre les attaques DDoS sans effort supplémentaire.',
      accentColor: 'green' as const,
    },
    {
      id: '4',
      icon: Code,
      title: 'Webhooks sécurisés',
      description: 'Gérez les webhooks avec des URL sécurisées et des tests d\'intégration continue.',
      accentColor: 'orange' as const,
    },
    {
      id: '5',
      icon: Cpu,
      title: 'Passerelle IA',
      description: "Acheminez, sécurisez et transformez le trafic vers n'importe quel modèle d'IA.",
      accentColor: 'purple' as const,
    },
    {
      id: '6',
      icon: Server,
      title: 'Clusters K8s distants',
      description: "Accédez aux clusters K8s distants depuis l'environnement de développement.",
      accentColor: 'cyan' as const,
    },
  ];

  const complianceBadges = [
    { id: '1', label: 'SOC2 Type II' },
    { id: '2', label: 'RGPD' },
    { id: '3', label: 'HIPAA et BAA' },
    { id: '4', label: 'CCPA' },
    { id: '5', label: 'RBAC' },
    { id: '6', label: 'SSO et SCIM' },
    { id: '7', label: 'Résidence des données' },
    { id: '8', label: "Journaux d'audit" },
    { id: '9', label: 'Marque blanche' },
  ];

  const diagramNodes = [
    {
      id: 'internet',
      label: 'Internet',
      sublabel: 'Public Traffic',
      icon: Globe,
      x: 15,
      y: 50,
    },
    {
      id: 'nexus',
      label: 'Cloud Nexus',
      sublabel: 'Cloud Gateway',
      icon: Zap,
      x: 50,
      y: 50,
    },
    {
      id: 'api',
      label: 'API Service',
      sublabel: 'https://api.internal',
      icon: Server,
      x: 85,
      y: 30,
    },
    {
      id: 'database',
      label: 'Database',
      sublabel: 'Customer Network',
      icon: Database,
      x: 85,
      y: 70,
    },
  ];

  const diagramConnections = [
    { from: 'internet', to: 'nexus', animated: true, color: 'cyan-gradient' },
    { from: 'nexus', to: 'api', label: 'HTTPS', color: 'green-gradient' },
    { from: 'nexus', to: 'database', label: 'Secure', color: 'green-gradient' },
  ];

  const configCode = `on_http_request:
  # Envoyer les requêtes /api vers le service API
  - expressions:
      - req.url.path.startsWith('/api')
    actions:
      - type: forward-internal
        config:
          url: https://api.internal

  # Routage dynamique basé sur un header
  - actions:
      - type: forward-internal
        config:
          url: https://\${req.headers('X-Custom-Header')}.internal`;

  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-hidden">
      {/* Lien retour */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-white/5 border border-white/10 text-white text-sm
                     hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
        >
          ← Retour
        </Link>
      </div>

      {/* Hero Section */}
      <HeroSection
        title="Acheminez, sécurisez et transformez le trafic vers n'importe quel modèle d'IA"
        subtitle="Plateforme cloud de nouvelle génération pour les applications modernes. Déployez, sécurisez et scalez en un clic."
        ctaText="Commencer gratuitement"
        onCtaClick={() => window.location.href = '/login'}
      />

      {/* Features Section */}
      <Section background="gradient">
        <Container>
          <SectionHeader
            icon={Workflow}
            label="Fonctionnalités"
            title="Une plateforme complète pour tous vos besoins"
            description="Des outils puissants conçus pour les développeurs modernes"
            align="center"
          />
          <FeatureGrid features={features} />
        </Container>
      </Section>

      {/* Architecture Diagram Section */}
      <Section background="dark">
        <Container>
          <SectionHeader
            label="Architecture"
            title="Flux de trafic intelligent"
            description="Comprenez comment Cloud Nexus achemine et sécurise votre trafic"
            align="center"
          />
          <TechnicalDiagram
            title="Figure 1 — Flux de trafic à travers les points de terminaison"
            nodes={diagramNodes}
            connections={diagramConnections}
          />
        </Container>
      </Section>

      {/* Configuration Section */}
      <Section background="gradient">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text column */}
            <div>
              <SectionHeader
                icon={Code}
                label="Configuration"
                title="Routage à la demande"
                description="Configuration simple et puissante basée sur YAML"
              />
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <span>Syntaxe intuitive et déclarative</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <span>Expressions CEL pour la logique complexe</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-cyan-400 text-sm">✓</span>
                  </div>
                  <span>Reload à chaud sans interruption</span>
                </li>
              </ul>
            </div>

            {/* Code column */}
            <div>
              <CodeBlock
                code={configCode}
                language="yaml"
                filename="nexus.yml"
                showLineNumbers
                highlightLines={[5, 11]}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Compliance Section */}
      <Section background="dark">
        <Container size="lg">
          <ComplianceSection
            title="Toutes les cases à cocher"
            subtitle="Sécurité et conformité de niveau entreprise intégrées"
            badges={complianceBadges}
          />
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="gradient">
        <Container>
          <div className="text-center py-16">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500
                            flex items-center justify-center
                            shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                <Gauge className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Prêt à commencer ?
            </h2>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'équipes qui font confiance à Cloud Nexus pour leurs applications critiques.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600
                               hover:from-cyan-400 hover:to-cyan-500
                               text-white font-bold text-lg
                               shadow-[0_0_30px_rgba(6,182,212,0.5)]
                               hover:shadow-[0_0_50px_rgba(6,182,212,0.7)]
                               transition-all duration-300"
              >
                Commencer gratuitement
              </Link>

              <Link
                to="/contact"
                className="px-8 py-4 rounded-lg
                               bg-white/5 border border-white/10
                               hover:bg-white/10 hover:border-white/20
                               text-white font-bold text-lg
                               transition-all duration-300"
              >
                Contacter l'équipe
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

export default NexusShowcasePage;
