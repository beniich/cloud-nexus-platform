import { useTranslation } from 'react-i18next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import serviceCloud from '@/assets/service-cloud.jpg';
import serviceDigital from '@/assets/service-digital.jpg';
import serviceSecurity from '@/assets/service-security.jpg';

const servicesList = [
  { id: 'cloud-infrastructure', key: 'cloudInfrastructure', image: serviceCloud },
  { id: 'digital-transformation', key: 'digitalTransformation', image: serviceDigital },
  { id: 'cybersecurity', key: 'cybersecurity', image: serviceSecurity },
  { id: 'cloud-backup', key: 'cloudBackup', image: serviceCloud },
  { id: 'devops', key: 'devops', image: serviceDigital },
  { id: 'consulting', key: 'consulting', image: serviceSecurity },
];

export default function Services() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-primary text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display font-bold mb-6">{t('servicesPage.title')}</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              {t('servicesPage.subtitle')}
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesList.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  title={t(`servicesPage.items.${service.key}.title`)}
                  description={t(`servicesPage.items.${service.key}.desc`)}
                  image={service.image}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-3xl mb-6">
              {t('servicesPage.cta.title')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('servicesPage.cta.subtitle')}
            </p>
            <a href="/contact" className="inline-block">
              <button className="bg-primary text-primary-foreground hover:bg-primary-hover px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                {t('servicesPage.cta.button')}
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
