import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        services: "Services",
        pricing: "Pricing",
        about: "About",
        blog: "Blog",
        contact: "Contact",
        careers: "Careers",
        login: "Login",
        start: "Get Started"
      },
      footer: {
        rights: "© 2025 Cloud Nexus Platform. All rights reserved.",
        products: "Products",
        company: "Company",
        legal: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        security: "Security",
        gdpr: "GDPR Compliance"
      },
      hero: {
        title_prefix: "Propel your",
        title_suffix: "business to the cloud",
        subtitle: "Powerful cloud infrastructure, intuitive developer tools, and expert support. Everything you need to succeed in the digital age.",
        cta_start: "Start for free",
        cta_demo: "View Demo",
        new_badge: "New: AI-Powered Site Builder",
        why_choose_prefix: "Why choose",
        why_choose_suffix: "Cloud Nexus?"
      },
      stats: {
        uptime: "Uptime",
        clients: "Active Clients",
        support: "Support",
        countries: "Countries"
      },
      features: {
        performance: { title: "Maximum Performance", desc: "Infrastructure optimized for ultra-fast response times" },
        security: { title: "Reinforced Security", desc: "End-to-end encryption and GDPR compliance" },
        deployment: { title: "Rapid Deployment", desc: "Launch your projects in minutes, not hours" },
        global: { title: "Global Presence", desc: "Datacenters distributed across 5 continents" },
        list: {
          availability: "High availability infrastructure",
          scaling: "Auto-scaling",
          monitoring: "Real-time monitoring",
          backups: "Daily automated backups",
          api: "Full RESTful API",
          support: "24/7 Priority Support"
        }
      },
      testimonials: {
        quote: "Cloud Nexus transformed our infrastructure. Exceptional performance and reactive support!",
        author: "Sarah L., CTO at TechStart"
      },
      cta: {
        title: "Ready to boost your business?",
        subtitle: "Join over 10,000 companies trusting Cloud Nexus",
        button_primary: "14-day free trial",
        button_secondary: "Talk to an expert"
      },
      "404": {
        title: "Page Not Found",
        message: "Oops! The page you're looking for doesn't exist.",
        submessage: "It might have been moved or deleted, or you may have mistyped the URL.",
        search_placeholder: "Search our site...",
        back_home: "Back to Home",
        contact_support: "Contact Support",
        quick_links: {
          home: "Homepage",
          services: "Services",
          docs: "Documentation",
          support: "Support"
        },
        help: {
          title: "Need help finding something?",
          text_prefix: "Check our",
          docs: "documentation",
          or: "or",
          contact: "contact our support team"
        }
      },
      common: {
        read_more: "Read more",
        subscribe: "Subscribe",
        search_placeholder: "Search...",
        apply_now: "Apply Now",
        view_offers: "View Openings",
        deploy: "Deploy"
      },
      services: {
        hero: {
          title_prefix: "Our Cloud",
          title_suffix: "Solutions",
          subtitle: "Scalable infrastructure and powerful tools to build, deploy, and scale your applications globally."
        },
        section_title: "Complete Cloud Services",
        section_subtitle: "One platform, infinite possibilities",
        cloud: { title: "Cloud Infrastructure", desc: "Deploy your infrastructure in a few clicks" },
        builder: { title: "Site Builder", desc: "Create professional websites without code" },
        data: { title: "Data Management", desc: "Manage your data securely" },
        security: { title: "Security First", desc: "Advanced protection for your resources" },
        categories: {
          all: "All Services",
          compute: "Compute",
          storage: "Storage",
          network: "Network",
          security: "Security"
        },
        items: {
          instances: { title: "Cloud Instances", desc: "Virtual machines available on demand with fully configurable CPU/RAM performance." },
          k8s: { title: "Managed Kubernetes", desc: "Orchestrate your containerized applications effortlessly with our managed K8s service." },
          block_storage: { title: "Block Storage", desc: "High-performance persistent storage volumes for your instances." },
          object_storage: { title: "Object Storage", desc: "S3-compatible scalable storage specifically for your static data and backups." },
          load_balancer: { title: "Load Balancer", desc: "Distribute traffic across your instances to ensure performance and availability." },
          private_network: { title: "Private Networks", desc: "Create isolated and secure networks between your cloud resources." },
          ddos: { title: "DDoS Protection", desc: "Advanced protection against volumetric and application-layer attacks included by default." },
          db: { title: "Managed Databases", desc: "PostgreSQL, MySQL, and Redis databases managed, secured, and backed up automatically." }
        },
        cta: {
          title: "Need a custom solution?",
          subtitle: "Our architects are here to help you design the perfect infrastructure for your needs.",
          button: "Contact Sales"
        }
      },
      contact: {
        hero: {
          title_1: "Contact",
          title_2: "Us",
          subtitle: "Our team is here to help you. Whether you have a technical question or need a personalized quote."
        },
        methods: {
          phone: { title: "Phone", action: "Call us" },
          email: { title: "Email", action: "Write to us" },
          chat: { title: "Live Chat", action: "Start chat", help: "Instant support" },
          office: { title: "Office", action: "Get directions" },
          priority: { title: "Priority Support", desc: "Enterprise customers benefit from a dedicated technical account manager and 24/7 support.", btn: "Contact Enterprise Sales" }
        },
        form: {
          title: "Send us a message",
          name: "Full Name",
          email: "Email Address",
          subject: "Subject",
          select_subject: "Select a subject...",
          subjects: { sales: "Commercial / Sales", support: "Technical Support", billing: "Billing", partnership: "Partnership", other: "Other" },
          message: "Message",
          placeholder: "How can we help you?",
          send: "Send Message",
          success_title: "Message Sent!",
          success_msg: "Thank you for contacting us. We will get back to you as soon as possible."
        }
      },
      pricing: {
        hero: {
          title_1: "Simple Pricing,",
          title_2: "No Surprises",
          subtitle: "Transparent pricing. Pay only for what you verify. No setup fees, no hidden costs."
        },
        billing: {
          monthly: "Monthly",
          yearly: "Yearly"
        },
        plans: {
          starter: { name: "Starter", desc: "Perfect for personal projects and prototypes", cta: "Start Free" },
          pro: { name: "Pro", desc: "For growing production applications", cta: "Get Started" },
          business: { name: "Business", desc: "High performance for demanding workloads", cta: "Contact Sales" }
        },
        features: {
          vcpu: "vCPU",
          ram: "RAM",
          storage: "Storage",
          transfer: "Transfer",
          support_community: "Community Support",
          support_email: "Email Support",
          support_priority: "Priority Support 24/7",
          projects_1: "1 Project",
          projects_unlimited: "Unlimited Projects",
          backups: "Automated Backups",
          ssl: "Free SSL Certificates",
          load_balancer: "Load Balancer Included",
          vpc: "VPC Peering",
          team: "Team Management",
          account_manager: "Dedicated Account Manager"
        },
        faq: {
          title: "Frequently Asked Questions",
          q1: "Can I change plans at any time?",
          a1: "Yes, you can upgrade or downgrade your resources at any time. Changes are applied instantly and billing is prorated to the second.",
          q2: "What payment methods do you accept?",
          a2: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and SEPA bank transfers for business accounts.",
          q3: "Is there a commitment period?",
          a3: "No, our services are non-binding. You can cancel your resources at any time and you will only pay for what you have used.",
          q4: "Do you offer discounts for startups / students?",
          a4: "Yes! We offer €1000 credits for eligible startups and special discounts for students. Contact us for more details."
        }
      },
      about: {
        hero: { title_1: "Building the Future", title_2: "of Cloud Computing", subtitle: "Cloud Nexus was born from a simple idea: complexity shouldn't be a barrier to innovation." },
        stats: { founded: "Founded", experts: "Experts", clients: "Clients", datacenters: "Datacenters" },
        values: {
          mission: { title: "Mission", desc: "Democratize access to a high-performance, secure, and sovereign cloud for companies of all sizes." },
          excellence: { title: "Excellence", desc: "We strive for technical perfection in every line of code and every server we deploy." },
          community: { title: "Community", desc: "We believe in open-source and active collaboration with our developer community." },
          privacy: { title: "Privacy", desc: "Your data is yours. We guarantee total sovereignty and strict compliance with GDPR." }
        },
        story: {
          title: "Our Story",
          p1: "Founded in 2018 in Paris, Cloud Nexus started as a small team of passionate developers frustrated by the complexity of existing cloud solutions.",
          p2: "We spent two years building our proprietary orchestration engine from scratch, focusing on performance, security, and developer experience.",
          p3: "Today, we are proud to serve over 10,000 customers worldwide, from solo developers to large enterprises, helping them deploy their dreams to the cloud."
        },
        team: {
          title: "Leadership Team",
          roles: { ceo: "CEO & Founder", cto: "CTO", head_product: "Head of Product", head_sales: "Head of Sales" },
          bios: {
            ceo: "Former Google Engineer, Cloud Architecture Expert.",
            cto: "Infrastructure security specialist and AI enthusiast.",
            head_product: "10 years experience in SaaS product development.",
            head_sales: "Focused on customer success and strategic partnerships."
          }
        }
      },
      careers: {
        hero: { title_1: "Join Our", title_2: "Team", subtitle: "Build the future of cloud computing with the best talents in the industry" },
        stats: { employees: "200+ Employees", offices: "5 Offices", growth: "Growing Fast" },
        benefits: {
          title: "Perks & Benefits",
          subtitle: "We take care of our teams",
          items: {
            health: { title: "Premium Health Insurance", desc: "Comprehensive health coverage for you and your family" },
            vacation: { title: "5 Weeks Vacation", desc: "Plus bank holidays for a great work/life balance" },
            remote: { title: "Remote Flexible", desc: "Work from anywhere, anytime" },
            learning: { title: "Continuous Learning", desc: "€3000 annual budget for your development" },
            gym: { title: "Gym Access", desc: "Free access to our partner gyms" },
            stock: { title: "Stock Options", desc: "Share in the growth of the company" }
          }
        },
        values: {
          title: "Our Values",
          innovation: { title: "Innovation", desc: "We encourage experimentation and calculated risk-taking" },
          collaboration: { title: "Collaboration", desc: "Teamwork is at the heart of our success" },
          excellence: { title: "Excellence", desc: "We aim for excellence in everything we do" },
          diversity: { title: "Diversity", desc: "We celebrate diversity and inclusion" }
        },
        positions: {
          title: "Open Positions",
          count_suffix: "opportunities available",
          no_match: "No positions match your criteria.",
          search_placeholder: "Search a job...",
          all_dept: "All Departments",
          all_loc: "All Locations",
          apply: "Apply Now"
        },
        jobs: {
          job1: { title: "Senior Backend Engineer", desc: "We are looking for a senior backend developer to join our cloud infrastructure team." },
          job2: { title: "Frontend Developer React", desc: "Build exceptional user interfaces for our cloud platform." },
          job3: { title: "DevOps Engineer", desc: "Optimize our cloud infrastructure and deployment pipelines." },
          job4: { title: "Product Manager", desc: "Define product vision and drive development of new features." },
          job5: { title: "UX/UI Designer", desc: "Design intuitive and visually stunning user experiences." },
          job6: { title: "Sales Account Executive", desc: "Grow our client portfolio and exceed sales targets." },
          job7: { title: "Customer Success Manager", desc: "Ensure satisfaction and retention of our enterprise clients." },
          job8: { title: "Data Scientist", desc: "Leverage our data to improve our products and services." }
        },
        cta: {
          title: "Can't find the perfect role?",
          subtitle: "Send us a spontaneous application. We are always looking for exceptional talent!",
          button: "Spontaneous Application"
        }
      },
      blog: {
        hero: {
          title_prefix: "The Cloud Nexus",
          title_suffix: "Blog",
          subtitle: "News, tutorials, and insights on cloud computing, web development, and security."
        },
        search_placeholder: "Search an article...",
        categories: {
          all: "All Articles",
          cloud: "Cloud Computing",
          development: "Development",
          security: "Security",
          performance: "Performance"
        },
        featured: "Featured Articles",
        read_more: "Read Article",
        no_results: "No articles match your search.",
        newsletter: {
          title: "Stay updated with the latest news",
          subtitle: "Receive our best articles directly in your inbox",
          placeholder: "your@email.com",
          button: "Subscribe",
          disclaimer: "No spam, unsubscribe in 1 click"
        }
      },
      legal: {
        hero: {
          title_prefix: "Legal",
          title_suffix: "Information",
          subtitle: "Transparency and compliance: discover our commitments and your rights"
        },
        tabs: {
          privacy: "Privacy",
          terms: "Terms",
          security: "Security",
          gdpr: "GDPR"
        },
        last_updated: "Last updated:",
        questions: {
          title: "Any questions?",
          subtitle: "For any questions regarding this policy, contact us:"
        }
      },
      auth: {
        welcome_title: "Welcome",
        welcome_subtitle: "Sign in or create an account",
        auth_title: "Authentication",
        auth_subtitle: "Access your Cloud Industrie space",
        or_continue: "OR CONTINUE WITH",
        terms: {
          prefix: "By creating an account, you agree to our",
          service: "Terms of Service",
          and: "and",
          privacy: "Privacy Policy"
        },
        login: {
          tab: "Sign In",
          title: "Login",
          subtitle: "Access your Cloud Nexus account",
          submit: "Sign In",
          forgot_password: "Forgot password?"
        },
        signup: {
          tab: "Sign Up",
          title: "Create an account",
          subtitle: "Join Cloud Nexus today",
          submit: "Create my account"
        },
        fields: {
          email: "Email",
          password: "Password",
          first_name: "First Name",
          last_name: "Last Name",
          confirm_password: "Confirm Password",
          full_name: "Full Name",
          placeholder_email: "you@example.com",
          placeholder_name: "John Doe",
          placeholder_first_name: "John",
          placeholder_last_name: "Doe",
          placeholder_password: "••••••••"
        },
        back_home: "Back to home",
        errors: {
          fill_all: "Please fill in all fields",
          password_mismatch: "Passwords do not match"
        },
        success: {
          login: "Login successful!",
          signup: "Account created successfully!"
        }
      },
      products: {
        title: "Product Management",
        add_btn: "Add Product",
        table: {
          name: "Name",
          price: "Price",
          stock: "Stock",
          category: "Category",
          actions: "Actions"
        },
        modal: {
          add_title: "Add Product",
          edit_title: "Edit Product",
          add_submit: "Add",
          update_submit: "Update"
        },
        toast: {
          updated: "Product updated!",
          added: "Product added!",
          deleted: "Product deleted!"
        }
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        services: "Services",
        pricing: "Tarifs",
        about: "À propos",
        blog: "Blog",
        contact: "Contact",
        careers: "Carrières",
        login: "Connexion",
        start: "Démarrer"
      },
      footer: {
        rights: "© 2025 Cloud Nexus Platform. Tous droits réservés.",
        products: "Produits",
        company: "Entreprise",
        legal: "Légal",
        privacy: "Confidentialité",
        terms: "Conditions",
        security: "Sécurité",
        gdpr: "RGPD"
      },
      hero: {
        title_prefix: "Propulsez votre",
        title_suffix: "entreprise vers le cloud",
        subtitle: "Infrastructure cloud puissante, outils de développement intuitifs et support expert. Tout ce dont vous avez besoin pour réussir dans le digital.",
        cta_start: "Commencer gratuitement",
        cta_demo: "Voir la démo",
        new_badge: "Nouveau : Site Builder avec IA intégrée",
        why_choose_prefix: "Pourquoi choisir",
        why_choose_suffix: "Cloud Nexus ?"
      },
      stats: {
        uptime: "Disponibilité",
        clients: "Clients Actifs",
        support: "Support",
        countries: "Pays"
      },
      features: {
        performance: { title: "Performance Maximale", desc: "Infrastructure optimisée pour des temps de réponse ultra-rapides" },
        security: { title: "Sécurité Renforcée", desc: "Chiffrement de bout en bout et conformité RGPD" },
        deployment: { title: "Déploiement Rapide", desc: "Lancez vos projets en quelques minutes, pas en heures" },
        global: { title: "Présence Mondiale", desc: "Datacenters répartis sur 5 continents" },
        list: {
          availability: "Infrastructure haute disponibilité",
          scaling: "Mise à l'échelle automatique",
          monitoring: "Surveillance en temps réel",
          backups: "Sauvegardes automatiques quotidiennes",
          api: "API RESTful complète",
          support: "Support prioritaire 24/7"
        }
      },
      testimonials: {
        quote: "Cloud Nexus a transformé notre infrastructure. Une performance exceptionnelle et un support réactif !",
        author: "Sarah L., CTO chez TechStart"
      },
      cta: {
        title: "Prêt à booster votre entreprise ?",
        subtitle: "Rejoignez plus de 10 000 entreprises qui font confiance à Cloud Nexus",
        button_primary: "Essai gratuit de 14 jours",
        button_secondary: "Parler à un expert"
      },
      "404": {
        title: "Page Non Trouvée",
        message: "Oups ! La page que vous recherchez n'existe pas.",
        submessage: "Elle a peut-être été déplacée ou supprimée, ou vous avez peut-être fait une faute de frappe dans l'URL.",
        search_placeholder: "Rechercher sur notre site...",
        back_home: "Retour à l'accueil",
        contact_support: "Contacter le Support",
        quick_links: {
          home: "Accueil",
          services: "Services",
          docs: "Documentation",
          support: "Support"
        },
        help: {
          title: "Besoin d'aide pour trouver quelque chose ?",
          text_prefix: "Consultez notre",
          docs: "documentation",
          or: "ou",
          contact: "contactez notre support"
        }
      },
      common: {
        read_more: "En savoir plus",
        subscribe: "S'abonner",
        search_placeholder: "Rechercher...",
        apply_now: "Postuler",
        view_offers: "Voir nos offres",
        deploy: "Déployer"
      },
      services: {
        hero: {
          title_prefix: "Nos Solutions",
          title_suffix: "Cloud",
          subtitle: "Une infrastructure évolutive et des outils puissants pour construire, déployer et faire évoluer vos applications mondialement."
        },
        section_title: "Services Cloud Complets",
        section_subtitle: "Une plateforme, des possibilités infinies",
        cloud: { title: "Infrastructure Cloud", desc: "Déployez votre infrastructure en quelques clics" },
        builder: { title: "Site Builder", desc: "Créez des sites web professionnels sans code" },
        data: { title: "Gestion de Données", desc: "Gérez vos données en toute sécurité" },
        security: { title: "Sécurité en Priorité", desc: "Protection avancée pour vos ressources" },
        categories: {
          all: "Tous les services",
          compute: "Calcul",
          storage: "Stockage",
          network: "Réseau",
          security: "Sécurité"
        },
        items: {
          instances: { title: "Instances Cloud", desc: "Machines virtuelles disponibles à la demande avec des performances CPU/RAM entièrement configurables." },
          k8s: { title: "Kubernetes Managé", desc: "Orchestrez vos applications conteneurisées sans effort grâce à notre service K8s géré." },
          block_storage: { title: "Stockage Bloc", desc: "Volumes de stockage persistant haute performance pour vos instances." },
          object_storage: { title: "Stockage Objet", desc: "Stockage évolutif compatible S3 spécifique pour vos données statiques et sauvegardes." },
          load_balancer: { title: "Load Balancer", desc: "Répartissez le trafic entre vos instances pour garantir performance et disponibilité." },
          private_network: { title: "Réseaux Privés", desc: "Créez des réseaux isolés et sécurisés entre vos ressources cloud." },
          ddos: { title: "Protection DDoS", desc: "Protection avancée contre les attaques volumétriques et applicatives incluse par défaut." },
          db: { title: "Bases de Données", desc: "Bases PostgreSQL, MySQL et Redis gérées, sécurisées et sauvegardées automatiquement." }
        },
        cta: {
          title: "Besoin d'une solution sur mesure ?",
          subtitle: "Nos architectes sont là pour vous aider à concevoir l'infrastructure parfaite pour vos besoins.",
          button: "Contacter les ventes"
        }
      },
      contact: {
        hero: {
          title_1: "Contactez",
          title_2: "Nous",
          subtitle: "Notre équipe est là pour vous aider. Que vous ayez une question technique ou besoin d'un devis personnalisé."
        },
        methods: {
          phone: { title: "Téléphone", action: "Appelez-nous" },
          email: { title: "Email", action: "Écrivez-nous" },
          chat: { title: "Live Chat", action: "Démarrer un chat", help: "Support instantané" },
          office: { title: "Bureau", action: "Itinéraire" },
          priority: { title: "Support Prioritaire", desc: "Les clients Entreprise bénéficient d'un responsable technique dédié et d'un support 24/7.", btn: "Contacter les ventes Entreprise" }
        },
        form: {
          title: "Envoyez-nous un message",
          name: "Nom Complet",
          email: "Adresse Email",
          subject: "Sujet",
          select_subject: "Sélectionnez un sujet...",
          subjects: { sales: "Commercial / Ventes", support: "Support Technique", billing: "Facturation", partnership: "Partenariat", other: "Autre" },
          message: "Message",
          placeholder: "Comment pouvons-nous vous aider ?",
          send: "Envoyer le message",
          success_title: "Message Envoyé !",
          success_msg: "Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais."
        }
      },
      pricing: {
        hero: {
          title_1: "Tarification Simple,",
          title_2: "Sans Surprise",
          subtitle: "Tarification transparente. Payez uniquement ce que vous utilisez. Pas de frais d'installation, pas de coûts cachés."
        },
        billing: {
          monthly: "Mensuel",
          yearly: "Annuel"
        },
        plans: {
          starter: { name: "Starter", desc: "Parfait pour les projets personnels et prototypes", cta: "Commencer Gratuitement" },
          pro: { name: "Pro", desc: "Pour les applications en production en croissance", cta: "Commencer" },
          business: { name: "Business", desc: "Haute performance pour les charges de travail exigeantes", cta: "Contacter les Ventes" }
        },
        features: {
          vcpu: "vCPU",
          ram: "RAM",
          storage: "Stockage",
          transfer: "Transfert",
          support_community: "Support Communautaire",
          support_email: "Support Email",
          support_priority: "Support Prioritaire 24/7",
          projects_1: "1 Projet",
          projects_unlimited: "Projets Illimités",
          backups: "Sauvegardes Automatiques",
          ssl: "Certificats SSL Gratuits",
          load_balancer: "Load Balancer Inclus",
          vpc: "Peering VPC",
          team: "Gestion d'Équipe",
          account_manager: "Account Manager Dédié"
        },
        faq: {
          title: "Questions Fréquemment Posées",
          q1: "Puis-je changer de forfait à tout moment ?",
          a1: "Oui, vous pouvez upgrader ou downgrader vos ressources à tout moment. Les changements sont appliqués instantanément et la facturation est proratisée à la seconde.",
          q2: "Quels moyens de paiement acceptez-vous ?",
          a2: "Nous acceptons toutes les cartes de crédit majeures (Visa, Mastercard, Amex), PayPal et les virements SEPA pour les comptes entreprise.",
          q3: "Y a-t-il une période d'engagement ?",
          a3: "Non, nos services sont sans engagement. Vous pouvez annuler vos ressources à tout moment et vous ne paierez que ce que vous avez consommé.",
          q4: "Proposez-vous des réductions pour startups / étudiants ?",
          a4: "Oui ! Nous offrons 1000€ de crédits pour les startups éligibles et des réductions spéciales pour les étudiants. Contactez-nous pour plus de détails."
        }
      },
      about: {
        hero: { title_1: "Construire le Futur", title_2: "du Cloud Computing", subtitle: "Cloud Nexus est né d'une idée simple : la complexité ne devrait pas être un obstacle à l'innovation." },
        stats: { founded: "Fondé en", experts: "Experts", clients: "Clients", datacenters: "Datacenters" },
        values: {
          mission: { title: "Mission", desc: "Démocratiser l'accès à un cloud performant, sécurisé et souverain pour les entreprises de toutes tailles." },
          excellence: { title: "Excellence", desc: "Nous visons la perfection technique dans chaque ligne de code et chaque serveur que nous déployons." },
          community: { title: "Communauté", desc: "Nous croyons en l'open-source et à la collaboration active avec notre communauté de développeurs." },
          privacy: { title: "Confidentialité", desc: "Vos données vous appartiennent. Nous garantissons une souveraineté totale et un respect strict du RGPD." }
        },
        story: {
          title: "Notre Histoire",
          p1: "Fondée en 2018 à Paris, Cloud Nexus a commencé comme une petite équipe de développeurs passionnés frustrés par la complexité des solutions cloud existantes.",
          p2: "Nous avons passé deux ans à construire notre propre moteur d'orchestration à partir de zéro, en nous concentrant sur la performance, la sécurité et l'expérience développeur.",
          p3: "Aujourd'hui, nous sommes fiers de servir plus de 10 000 clients dans le monde, des développeurs indépendants aux grandes entreprises, en les aidant à déployer leurs rêves dans le cloud."
        },
        team: {
          title: "Équipe de Direction",
          roles: { ceo: "PDG & Fondateur", cto: "Directrice Technique (CTO)", head_product: "Directeur Produit", head_sales: "Directrice des Ventes" },
          bios: {
            ceo: "Ancien ingénieur Google, expert en architecture Cloud.",
            cto: "Spécialiste en sécurité infrastructure et passionnée d'IA.",
            head_product: "10 ans d'expérience dans le développement de produits SaaS.",
            head_sales: "Focalisée sur le succès client et les partenariats stratégiques."
          }
        }
      },
      careers: {
        hero: { title_1: "Rejoignez Notre", title_2: "Équipe", subtitle: "Construisez le futur du cloud computing avec les meilleurs talents de l'industrie" },
        stats: { employees: "200+ Employés", offices: "5 Bureaux", growth: "Croissance Rapide" },
        benefits: {
          title: "Avantages",
          subtitle: "Nous prenons soin de nos équipes",
          items: {
            health: { title: "Mutuelle Premium", desc: "Couverture santé complète pour vous et votre famille" },
            vacation: { title: "5 Semaines de Congés", desc: "Plus les jours fériés pour un excellent équilibre vie pro/vie perso" },
            remote: { title: "Remote Flexible", desc: "Travaillez d'où vous voulez, quand vous voulez" },
            learning: { title: "Formation Continue", desc: "Budget annuel de 3000€ pour votre développement" },
            gym: { title: "Accès Salle de Sport", desc: "Accès gratuit à nos salles partenaires" },
            stock: { title: "Stock Options", desc: "Participez à la croissance de l'entreprise" }
          }
        },
        values: {
          title: "Nos Valeurs",
          innovation: { title: "Innovation", desc: "Nous encourageons l'expérimentation et la prise de risque calculée" },
          collaboration: { title: "Collaboration", desc: "Le travail d'équipe est au cœur de notre succès" },
          excellence: { title: "Excellence", desc: "Nous visons l'excellence dans tout ce que nous faisons" },
          diversity: { title: "Diversité", desc: "Nous célébrons la diversité et l'inclusion" }
        },
        positions: {
          title: "Postes Ouverts",
          count_suffix: "opportunités disponibles",
          no_match: "Aucun poste ne correspond à vos critères.",
          search_placeholder: "Rechercher un poste...",
          all_dept: "Tous les départements",
          all_loc: "Toutes les localisations",
          apply: "Postuler"
        },
        jobs: {
          job1: { title: "Senior Backend Engineer", desc: "Nous recherchons un développeur backend senior pour rejoindre notre équipe infrastructure cloud." },
          job2: { title: "Frontend Developer React", desc: "Créez des interfaces utilisateur exceptionnelles pour notre plateforme cloud." },
          job3: { title: "DevOps Engineer", desc: "Optimisez notre infrastructure cloud et nos pipelines de déploiement." },
          job4: { title: "Product Manager", desc: "Définissez la vision produit et pilotez le développement de nouvelles fonctionnalités." },
          job5: { title: "UX/UI Designer", desc: "Concevez des expériences utilisateur intuitives et visuellement époustouflantes." },
          job6: { title: "Sales Account Executive", desc: "Développez notre portefeuille clients et dépassez les objectifs de vente." },
          job7: { title: "Customer Success Manager", desc: "Assurez la satisfaction et la fidélisation de nos clients entreprise." },
          job8: { title: "Data Scientist", desc: "Exploitez nos données pour améliorer nos produits et services." }
        },
        cta: {
          title: "Vous ne trouvez pas le poste idéal ?",
          subtitle: "Envoyez-nous une candidature spontanée. Nous sommes toujours à la recherche de talents exceptionnels !",
          button: "Candidature Spontanée"
        }
      },
      blog: {
        hero: {
          title_prefix: "Le Blog",
          title_suffix: "Cloud Nexus",
          subtitle: "Actualités, tutoriels et insights sur le cloud computing, le développement web et la sécurité."
        },
        search_placeholder: "Rechercher un article...",
        categories: {
          all: "Tous les articles",
          cloud: "Cloud Computing",
          development: "Développement",
          security: "Sécurité",
          performance: "Performance"
        },
        featured: "Articles à la une",
        read_more: "Lire l'article",
        no_results: "Aucun article ne correspond à votre recherche.",
        newsletter: {
          title: "Restez informé des dernières nouvelles",
          subtitle: "Recevez nos meilleurs articles directement dans votre boîte de réception",
          placeholder: "votre@email.com",
          button: "S'abonner",
          disclaimer: "Pas de spam, désabonnement en 1 clic"
        }
      },
      legal: {
        hero: {
          title_prefix: "Informations",
          title_suffix: "Légales",
          subtitle: "Transparence et conformité : découvrez nos engagements et vos droits"
        },
        tabs: {
          privacy: "Confidentialité",
          terms: "Conditions",
          security: "Sécurité",
          gdpr: "RGPD"
        },
        last_updated: "Dernière mise à jour :",
        questions: {
          title: "Des questions ?",
          subtitle: "Pour toute question concernant cette politique, contactez-nous :"
        }
      },
      auth: {
        welcome_title: "Bienvenue",
        welcome_subtitle: "Connectez-vous ou créez un compte",
        auth_title: "Authentification",
        auth_subtitle: "Accédez à votre espace Cloud Industrie",
        or_continue: "OU CONTINUER AVEC",
        terms: {
          prefix: "En créant un compte, vous acceptez nos",
          service: "Conditions d'utilisation",
          and: "et",
          privacy: "Politique de confidentialité"
        },
        login: {
          tab: "Se connecter",
          title: "Connexion",
          subtitle: "Accédez à votre compte Cloud Nexus",
          submit: "Se connecter",
          forgot_password: "Mot de passe oublié ?"
        },
        signup: {
          tab: "S'inscrire",
          title: "Créer un compte",
          subtitle: "Rejoignez Cloud Nexus dès aujourd'hui",
          submit: "Créer mon compte"
        },
        fields: {
          email: "Email",
          password: "Mot de passe",
          first_name: "Prénom",
          last_name: "Nom",
          confirm_password: "Confirmer le mot de passe",
          full_name: "Nom complet",
          placeholder_email: "vous@exemple.com",
          placeholder_name: "Jean Dupont",
          placeholder_first_name: "Jean",
          placeholder_last_name: "Dupont",
          placeholder_password: "••••••••"
        },
        back_home: "Retour à l'accueil",
        errors: {
          fill_all: "Veuillez remplir tous les champs",
          password_mismatch: "Les mots de passe ne correspondent pas"
        },
        success: {
          login: "Connexion réussie !",
          signup: "Compte créé avec succès !"
        }
      },
      products: {
        title: "Gestion des Produits",
        add_btn: "Ajouter Produit",
        table: {
          name: "Nom",
          price: "Prix",
          stock: "Stock",
          category: "Catégorie",
          actions: "Actions"
        },
        modal: {
          add_title: "Ajouter Produit",
          edit_title: "Modifier Produit",
          add_submit: "Ajouter",
          update_submit: "Mettre à jour"
        },
        toast: {
          updated: "Produit mis à jour !",
          added: "Produit ajouté !",
          deleted: "Produit supprimé !"
        }
      }
    }
  },
  es: {
    translation: {
      nav: { home: "Inicio", services: "Servicios", pricing: "Precios", about: "Nosotros", blog: "Blog", contact: "Contacto", careers: "Carreras", login: "Acceso", start: "Empezar" }
    }
  },
  de: {
    translation: {
      nav: { home: "Startseite", services: "Dienstleistungen", pricing: "Preise", about: "Über uns", blog: "Blog", contact: "Kontakt", careers: "Karriere", login: "Anmelden", start: "Starten" }
    }
  },
  it: {
    translation: {
      nav: { home: "Home", services: "Servizi", pricing: "Prezzi", about: "Chi siamo", blog: "Blog", contact: "Contatti", careers: "Carriere", login: "Accedi", start: "Inizia" }
    }
  },
  pt: {
    translation: {
      nav: { home: "Início", services: "Serviços", pricing: "Preços", about: "Sobre", blog: "Blog", contact: "Contato", careers: "Carreiras", login: "Entrar", start: "Começar" }
    }
  },
  zh: {
    translation: {
      nav: { home: "首页", services: "服务", pricing: "价格", about: "关于我们", blog: "博客", contact: "联系我们", careers: "招聘", login: "登录", start: "开始" }
    }
  },
  ar: {
    translation: {
      nav: { home: "الرئيسية", services: "خدمات", pricing: "الأسعار", about: "من نحن", blog: "مدونة", contact: "اتصل بنا", careers: "وظائف", login: "تسجيل الدخول", start: "البدء" }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // lng: 'en', // Removed to allow detection
    fallbackLng: 'fr', // Fallback to French if detection fails
    supportedLngs: ['en', 'fr', 'es', 'de', 'it', 'pt', 'zh', 'ar'], // Explicitly supported languages
    nonExplicitSupportedLngs: true, // Allow fr-FR to match fr, etc.
    load: 'languageOnly', // Load 'fr' instead of 'fr-FR'
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
