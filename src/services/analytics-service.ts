import type {
    AnalyticsData,
    AnalyticsEvent,
    DateRange,
    SiteMetrics,
    PageViewMetric,
    PageMetric,
    ReferrerMetric,
    DeviceMetric,
    GeoMetric
} from '../types/analytics.types';

export class AnalyticsService {
    private storageKey = 'site_analytics';

    /**
     * Récupère les analytics d'un site
     */
    async getAnalytics(siteId: string, dateRange: DateRange): Promise<AnalyticsData> {
        const events = this.getStoredEvents(siteId);
        const filteredEvents = this.filterEventsByDate(events, dateRange);

        return {
            siteId,
            period: dateRange,
            metrics: this.calculateMetrics(filteredEvents),
            pageViews: this.calculatePageViews(filteredEvents),
            topPages: this.calculateTopPages(filteredEvents),
            referrers: this.calculateReferrers(filteredEvents),
            devices: this.calculateDevices(filteredEvents),
            locations: this.calculateLocations(filteredEvents),
            events: []
        };
    }

    /**
     * Enregistre un événement analytics
     */
    async trackEvent(event: AnalyticsEvent): Promise<void> {
        const events = this.getStoredEvents(event.page);
        events.push(event);

        // Limiter à 10000 événements max
        if (events.length > 10000) {
            events.shift();
        }

        localStorage.setItem(
            `${this.storageKey}_${event.page}`,
            JSON.stringify(events)
        );
    }

    /**
     * Génère le script de tracking à injecter
     */
    generateTrackingScript(siteId: string): string {
        return `
<script>
(function() {
  const analytics = {
    siteId: '${siteId}',
    endpoint: '/api/analytics',
    
    track: function(eventType, data) {
      const event = {
        type: eventType,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer,
        device: this.getDeviceInfo(),
        sessionId: this.getSessionId(),
        visitorId: this.getVisitorId(),
        ...data
      };
      
      this.send(event);
    },
    
    getDeviceInfo: function() {
      const ua = navigator.userAgent;
      return {
        type: /mobile/i.test(ua) ? 'mobile' : /tablet/i.test(ua) ? 'tablet' : 'desktop',
        browser: this.getBrowser(),
        os: this.getOS()
      };
    },
    
    getBrowser: function() {
      const ua = navigator.userAgent;
      if (ua.indexOf('Firefox') > -1) return 'Firefox';
      if (ua.indexOf('Chrome') > -1) return 'Chrome';
      if (ua.indexOf('Safari') > -1) return 'Safari';
      if (ua.indexOf('Edge') > -1) return 'Edge';
      return 'Other';
    },
    
    getOS: function() {
      const ua = navigator.userAgent;
      if (ua.indexOf('Win') > -1) return 'Windows';
      if (ua.indexOf('Mac') > -1) return 'MacOS';
      if (ua.indexOf('Linux') > -1) return 'Linux';
      if (ua.indexOf('Android') > -1) return 'Android';
      if (ua.indexOf('iOS') > -1) return 'iOS';
      return 'Other';
    },
    
    getSessionId: function() {
      let id = sessionStorage.getItem('analytics_session');
      if (!id) {
        id = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2);
        sessionStorage.setItem('analytics_session', id);
      }
      return id;
    },
    
    getVisitorId: function() {
      let id = localStorage.getItem('analytics_visitor');
      if (!id) {
        id = 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2);
        localStorage.setItem('analytics_visitor', id);
      }
      return id;
    },
    
    send: function(event) {
      // En production, envoyer à votre API
      console.log('Analytics Event:', event);
      
      // Stocker localement pour la démo
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(event);
      localStorage.setItem('analytics_events', JSON.stringify(events));
    }
  };
  
  // Track pageview automatiquement
  analytics.track('pageview');
  
  // Exposer l'API
  window.analytics = analytics;
})();
</script>
    `;
    }

    /**
     * Calcule les métriques principales
     */
    private calculateMetrics(events: AnalyticsEvent[]): SiteMetrics {
        const pageViews = events.filter(e => e.type === 'pageview');
        const uniqueVisitors = new Set(pageViews.map(e => e.visitorId)).size;

        return {
            totalPageViews: pageViews.length,
            uniqueVisitors,
            avgSessionDuration: 120, // Simulé
            bounceRate: 0.45,
            conversionRate: 0.03
        };
    }

    /**
     * Calcule les vues par jour
     */
    private calculatePageViews(events: AnalyticsEvent[]): PageViewMetric[] {
        const pageViews = events.filter(e => e.type === 'pageview');
        const byDate = new Map<string, { views: number; visitors: Set<string> }>();

        pageViews.forEach(event => {
            const date = event.timestamp.split('T')[0];
            if (!byDate.has(date)) {
                byDate.set(date, { views: 0, visitors: new Set() });
            }
            const data = byDate.get(date)!;
            data.views++;
            data.visitors.add(event.visitorId);
        });

        return Array.from(byDate.entries()).map(([date, data]) => ({
            date,
            views: data.views,
            uniqueVisitors: data.visitors.size
        }));
    }

    /**
     * Calcule les pages les plus visitées
     */
    private calculateTopPages(events: AnalyticsEvent[]): PageMetric[] {
        const pageViews = events.filter(e => e.type === 'pageview');
        const byPage = new Map<string, { views: number; visitors: Set<string> }>();

        pageViews.forEach(event => {
            const page = event.page;
            if (!byPage.has(page)) {
                byPage.set(page, { views: 0, visitors: new Set() });
            }
            const data = byPage.get(page)!;
            data.views++;
            data.visitors.add(event.visitorId);
        });

        return Array.from(byPage.entries())
            .map(([path, data]) => ({
                path,
                title: path === '/' ? 'Home' : path,
                views: data.views,
                uniqueVisitors: data.visitors.size,
                avgDuration: 90,
                bounceRate: 0.4
            }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 10);
    }

    /**
     * Calcule les sources de trafic
     */
    private calculateReferrers(events: AnalyticsEvent[]): ReferrerMetric[] {
        const pageViews = events.filter(e => e.type === 'pageview');
        const total = pageViews.length;

        const bySource = new Map<string, number>();

        pageViews.forEach(event => {
            const source = this.categorizeReferrer(event.referrer || '');
            bySource.set(source, (bySource.get(source) || 0) + 1);
        });

        return Array.from(bySource.entries())
            .map(([source, visits]) => ({
                source,
                medium: this.getMedium(source),
                visits,
                percentage: (visits / total) * 100
            }))
            .sort((a, b) => b.visits - a.visits);
    }

    /**
     * Calcule la répartition par devices
     */
    private calculateDevices(events: AnalyticsEvent[]): DeviceMetric[] {
        const pageViews = events.filter(e => e.type === 'pageview');
        const total = pageViews.length;

        const byDevice = new Map<string, { count: number; browsers: Map<string, number> }>();

        pageViews.forEach(event => {
            const type = event.device.type;
            if (!byDevice.has(type)) {
                byDevice.set(type, { count: 0, browsers: new Map() });
            }
            const data = byDevice.get(type)!;
            data.count++;
            data.browsers.set(
                event.device.browser,
                (data.browsers.get(event.device.browser) || 0) + 1
            );
        });

        return Array.from(byDevice.entries()).map(([type, data]) => ({
            type: type as any,
            count: data.count,
            percentage: (data.count / total) * 100,
            browsers: Array.from(data.browsers.entries()).map(([name, count]) => ({
                name,
                count
            }))
        }));
    }

    /**
     * Calcule la répartition géographique
     */
    private calculateLocations(events: AnalyticsEvent[]): GeoMetric[] {
        // Simulé car nécessite une vraie API de géolocalisation
        return [
            { country: 'United States', countryCode: 'US', visits: 450, percentage: 45 },
            { country: 'United Kingdom', countryCode: 'GB', visits: 200, percentage: 20 },
            { country: 'Canada', countryCode: 'CA', visits: 150, percentage: 15 },
            { country: 'France', countryCode: 'FR', visits: 100, percentage: 10 },
            { country: 'Germany', countryCode: 'DE', visits: 100, percentage: 10 }
        ];
    }

    /**
     * Récupère les événements stockés
     */
    private getStoredEvents(siteId: string): AnalyticsEvent[] {
        try {
            const data = localStorage.getItem(`${this.storageKey}_${siteId}`);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    /**
     * Filtre les événements par date
     */
    private filterEventsByDate(events: AnalyticsEvent[], range: DateRange): AnalyticsEvent[] {
        const start = new Date(range.start).getTime();
        const end = new Date(range.end).getTime();

        return events.filter(event => {
            const timestamp = new Date(event.timestamp).getTime();
            return timestamp >= start && timestamp <= end;
        });
    }

    /**
     * Catégorise un referrer
     */
    private categorizeReferrer(referrer: string): string {
        if (!referrer) return 'Direct';
        if (referrer.includes('google')) return 'Google';
        if (referrer.includes('facebook')) return 'Facebook';
        if (referrer.includes('twitter')) return 'Twitter';
        if (referrer.includes('linkedin')) return 'LinkedIn';
        return new URL(referrer).hostname;
    }

    /**
     * Détermine le medium d'un source
     */
    private getMedium(source: string): 'organic' | 'direct' | 'referral' | 'social' | 'email' | 'paid' {
        if (source === 'Direct') return 'direct';
        if (['Google', 'Bing', 'Yahoo'].includes(source)) return 'organic';
        if (['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].includes(source)) return 'social';
        return 'referral';
    }
}

export default AnalyticsService;
