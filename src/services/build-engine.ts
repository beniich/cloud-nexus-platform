import type { Site, BuildResult, BuildConfig, BuildFile, OptimizedAssets } from '../types/build.types';
import type { SiteSection } from '../types/site.types';
import JSZip from 'jszip';

export class BuildEngine {
  private config: BuildConfig;

  constructor(config?: Partial<BuildConfig>) {
    this.config = {
      minify: true,
      optimizeImages: true,
      inlineCSS: false,
      generateSourceMaps: false,
      target: 'production',
      ...config
    };
  }

  /**
   * Génère le site statique complet
   */
  async generateStaticSite(site: Site): Promise<BuildResult> {
    const startTime = Date.now();
    const files: BuildFile[] = [];
    const errors: any[] = [];
    const warnings: string[] = [];

    try {
      // 1. Générer le HTML
      const htmlFile = await this.generateHTML(site);
      files.push(htmlFile);

      // 2. Générer et optimiser le CSS
      const cssFile = await this.generateCSS(site);
      files.push(cssFile);

      // 3. Générer le sitemap
      const sitemapFile = await this.generateSitemap(site);
      files.push(sitemapFile);

      // 4. Générer robots.txt
      const robotsFile = await this.generateRobotsTxt(site);
      files.push(robotsFile);

      // 5. Optimiser les assets
      const assets = await this.optimizeAssets(site);

      // 6. Calculer les tailles
      const sizes = this.calculateSizes(files, assets);

      const buildTime = Date.now() - startTime;

      return {
        success: errors.length === 0,
        outputPath: `/builds/${site.id}`,
        files,
        assets,
        errors,
        warnings,
        buildTime,
        size: sizes
      };
    } catch (error) {
      errors.push({
        type: 'fatal',
        message: error instanceof Error ? error.message : 'Unknown build error'
      });

      return {
        success: false,
        outputPath: '',
        files: [],
        assets: { images: [], css: { inline: '', external: [], minified: false }, js: { inline: '', external: [], minified: false } },
        errors,
        warnings,
        buildTime: Date.now() - startTime,
        size: { html: 0, css: 0, js: 0, images: 0, total: 0 }
      };
    }
  }

  /**
   * Génère une archive ZIP du site
   */
  async generateZip(site: Site): Promise<Blob> {
    const build = await this.generateStaticSite(site);
    const zip = new JSZip();

    // Ajouter les fichiers générés
    build.files.forEach(file => {
      zip.file(file.path, file.content);
    });

    // Simuler structure d'images (dossier assets)
    // Dans une vraie implémentation, on téléchargerait les images
    // zip.folder("assets");

    return await zip.generateAsync({ type: "blob" });
  }

  /**
   * Génère le fichier HTML principal
   */
  private async generateHTML(site: Site): Promise<BuildFile> {
    const html = `<!DOCTYPE html>
<html lang="${site.settings.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.seo.title}</title>
  <meta name="description" content="${site.seo.description}">
  ${site.seo.keywords.length > 0 ? `<meta name="keywords" content="${site.seo.keywords.join(', ')}">` : ''}
  ${site.seo.canonicalUrl ? `<link rel="canonical" href="${site.seo.canonicalUrl}">` : ''}
  ${site.seo.robotsMeta.index ? '' : '<meta name="robots" content="noindex, nofollow">'}
  
  <!-- Open Graph -->
  <meta property="og:title" content="${site.seo.title}">
  <meta property="og:description" content="${site.seo.description}">
  ${site.seo.ogImage ? `<meta property="og:image" content="${site.seo.ogImage}">` : ''}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="${site.seo.twitterCard || 'summary'}">
  
  ${site.settings.favicon ? `<link rel="icon" href="${site.settings.favicon}">` : ''}
  <link rel="stylesheet" href="styles.css">
  ${site.settings.customCss ? `<style>${site.settings.customCss}</style>` : ''}
</head>
<body>
  ${this.renderSections(site.sections)}
  
  ${site.settings.analyticsId ? this.generateAnalyticsScript(site.settings.analyticsId) : ''}
  ${site.settings.customJs ? `<script>${site.settings.customJs}</script>` : ''}
</body>
</html>`;

    const minified = this.config.minify ? this.minifyHTML(html) : html;

    return {
      path: 'index.html',
      content: minified,
      size: new Blob([minified]).size,
      hash: this.generateHash(minified)
    };
  }

  /**
   * Rend les sections du site
   */
  private renderSections(sections: SiteSection[]): string {
    return sections
      .sort((a, b) => a.order - b.order)
      .map(section => this.renderSection(section))
      .join('\n');
  }

  /**
   * Rend une section individuelle
   */
  private renderSection(section: SiteSection): string {
    const { type, content } = section;
    const style = section.props?.style || {};

    switch (type) {
      case 'hero':
        return `
    <section id="${section.id}" class="section section-hero" style="background-image: url('${content.image || ''}')">
        <div class="overlay"></div>
        <div class="container relative z-10">
            <h1>${this.escapeHtml(content.heading)}</h1>
            <p>${this.escapeHtml(content.subheading)}</p>
            ${content.cta ? `<a href="${content.cta.link}" class="btn btn-${content.cta.style || 'primary'}">${this.escapeHtml(content.cta.text)}</a>` : ''}
        </div>
    </section>`;

      case 'about':
        return `
    <section id="${section.id}" class="section section-about">
        <div class="container">
            <h2>${this.escapeHtml(content.heading)}</h2>
            <p>${this.escapeHtml(content.text)}</p>
            ${content.items ? `
            <div class="tags">
                ${content.items.map((item: string) => `<span class="tag">${this.escapeHtml(item)}</span>`).join('')}
            </div>` : ''}
        </div>
    </section>`;

      case 'services':
        return `
    <section id="${section.id}" class="section section-services">
        <div class="container">
            <div class="section-header">
                <h2>${this.escapeHtml(content.heading)}</h2>
                <p>${this.escapeHtml(content.subheading)}</p>
            </div>
            <div class="grid grid-3">
                ${content.items?.map((item: { icon: string; title: string; description: string }) => `
                <div class="card">
                    <div class="icon">${item.icon}</div>
                    <h3>${this.escapeHtml(item.title)}</h3>
                    <p>${this.escapeHtml(item.description)}</p>
                </div>`).join('') || ''}
            </div>
        </div>
    </section>`;

      case 'gallery':
        return `
    <section id="${section.id}" class="section section-gallery">
        <div class="container">
            <h2>${this.escapeHtml(content.heading)}</h2>
            <div class="grid grid-3 gallery-grid">
                ${content.items?.map((item: { url: string; title: string }) => `
                <div class="gallery-item">
                    <img src="${item.url}" alt="${this.escapeHtml(item.title)}" loading="lazy">
                    <div class="gallery-caption">${this.escapeHtml(item.title)}</div>
                </div>`).join('') || ''}
            </div>
        </div>
    </section>`;

      case 'contact':
        return `
    <section id="${section.id}" class="section section-contact">
        <div class="container">
            <h2>${this.escapeHtml(content.heading)}</h2>
            <p>${this.escapeHtml(content.subheading)}</p>
            <div class="contact-grid">
                <div class="contact-info">
                    ${content.items?.map((item: { type: string; value: string }) => `
                    <div class="info-item">
                        <strong>${item.type}:</strong> ${this.escapeHtml(item.value)}
                    </div>`).join('') || ''}
                </div>
                <form class="contact-form">
                    <input type="text" placeholder="Name" required>
                    <input type="email" placeholder="Email" required>
                    <textarea rows="4" placeholder="Message" required></textarea>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>`;

      default:
        return `<!-- Unknown section type: ${type} -->`;
    }
  }

  private escapeHtml(unsafe: string): string {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Génère le fichier CSS
   */
  private async generateCSS(site: Site): Promise<BuildFile> {
    const css = `
@import url('https://fonts.googleapis.com/css2?family=${site.theme.fonts.heading.replace(' ', '+')}:wght@400;700&family=${site.theme.fonts.body.replace(' ', '+')}:wght@400;600&display=swap');

:root {
  ${Object.entries(site.theme.colors).map(([key, value]) => `--color-${key}: ${value};`).join('\n  ')}
  --font-heading: '${site.theme.fonts.heading}', sans-serif;
  --font-body: '${site.theme.fonts.body}', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-background);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--color-text);
  margin-bottom: 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
}

.section {
  padding: 4rem 0;
}

/* Utilities */
.text-center { text-align: center; }
.grid { display: grid; gap: 2rem; }
.grid-3 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--color-primary);
  color: #fff;
}

.btn-primary:hover {
  background-color: var(--color-secondary);
}

/* Sections Specifics */
.section-hero {
  background-size: cover;
  background-position: center;
  color: #fff;
  text-align: center;
  padding: 8rem 0;
  position: relative;
}

.section-hero .overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
}

.section-hero h1 { color: #fff; font-size: 3.5rem; }

.section-services .card, .section-features .card {
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-gallery .gallery-item {
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
}

.section-gallery img {
  width: 100%;
  height: 300px;
  object-cover: cover;
  display: block;
}

.section-contact .contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-top: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .section-hero h1 { font-size: 2.5rem; }
  .section-contact .contact-grid { grid-template-columns: 1fr; gap: 2rem; }
}
    `.trim();

    const minified = this.config.minify ? this.minifyCSS(css) : css;

    return {
      path: 'styles.css',
      content: minified,
      size: new Blob([minified]).size,
      hash: this.generateHash(minified)
    };
  }

  /**
   * Génère le sitemap.xml
   */
  private async generateSitemap(site: Site): Promise<BuildFile> {
    const baseUrl = site.customDomain || site.domain || '';
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return {
      path: 'sitemap.xml',
      content: xml,
      size: new Blob([xml]).size,
      hash: this.generateHash(xml)
    };
  }

  /**
   * Génère robots.txt
   */
  private async generateRobotsTxt(site: Site): Promise<BuildFile> {
    const baseUrl = site.customDomain || site.domain || '';
    const txt = `User-agent: *
${site.seo.robotsMeta.index ? 'Allow: /' : 'Disallow: /'}

Sitemap: ${baseUrl}/sitemap.xml`;

    return {
      path: 'robots.txt',
      content: txt,
      size: new Blob([txt]).size,
      hash: this.generateHash(txt)
    };
  }

  /**
   * Optimise les assets (images, etc.)
   */
  async optimizeAssets(site: Site): Promise<OptimizedAssets> {
    // Implémentation simplifiée
    return {
      images: [],
      css: {
        inline: '',
        external: ['styles.css'],
        minified: this.config.minify
      },
      js: {
        inline: '',
        external: [],
        minified: this.config.minify
      }
    };
  }

  /**
   * Génère le script Analytics
   */
  private generateAnalyticsScript(analyticsId: string): string {
    return `
<!-- Analytics -->
<script>
  (function() {
    const analytics = {
      track: function(event, data) {
        // Implementation du tracking
        console.log('Analytics:', event, data);
      }
    };
    
    // Track pageview
    analytics.track('pageview', {
      page: window.location.pathname,
      referrer: document.referrer
    });
  })();
</script>`;
  }

  /**
   * Minifie le HTML
   */
  private minifyHTML(html: string): string {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }

  /**
   * Minifie le CSS
   */
  private minifyCSS(css: string): string {
    return css
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*;\s*/g, ';')
      .trim();
  }

  /**
   * Calcule les tailles des fichiers
   */
  private calculateSizes(files: BuildFile[], assets: OptimizedAssets): any {
    const html = files.find(f => f.path === 'index.html')?.size || 0;
    const css = files.find(f => f.path === 'styles.css')?.size || 0;
    const images = assets.images.reduce((sum, img) => sum + (img.sizes.width * img.sizes.height / 1000), 0);

    return {
      html,
      css,
      js: 0,
      images,
      total: html + css + images
    };
  }

  /**
   * Génère un hash pour un fichier
   */
  private generateHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

export default BuildEngine;
