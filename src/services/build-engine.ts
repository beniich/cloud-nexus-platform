import type { Site, BuildResult, BuildConfig, BuildFile, OptimizedAssets } from '../types/build.types';
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
    const errors: string[] = [];
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

      return {
        success: true,
        outputPath: '/dist',
        files,
        assets,
        errors,
        warnings,
        buildTime: Date.now() - startTime,
        size: sizes
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown build error');
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

    return await zip.generateAsync({ type: "blob" });
  }

  /**
   * Génère le fichier HTML principal
   */
  async generateHTML(site: Site): Promise<BuildFile> {
    const pageContent = this.renderSections(site.sections);

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(site.name)}</title>
    <meta name="description" content="${this.escapeHtml(site.settings?.seo?.description || site.name)}">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    ${pageContent}
    <script src="app.js"></script>
</body>
</html>`;

    const minified = this.config.minify ? this.minifyHTML(html) : html;

    return {
      path: 'index.html',
      content: minified,
      size: minified.length,
      hash: this.generateHash(minified)
    };
  }

  /**
   * Génère le fichier CSS
   */
  async generateCSS(site: Site): Promise<BuildFile> {
    const css = `
:root {
  --primary: ${site.theme.colors.primary};
  --secondary: ${site.theme.colors.secondary};
  --background: ${site.theme.colors.background};
  --text: ${site.theme.colors.text};
}

body {
  margin: 0;
  padding: 0;
  font-family: ${site.theme.fonts.body}, sans-serif;
  color: var(--text);
  background-color: var(--background);
}

h1, h2, h3, h4, h5, h6 {
  font-family: ${site.theme.fonts.heading}, sans-serif;
}

section {
  padding: 4rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}
`;

    const minified = this.config.minify ? this.minifyCSS(css) : css;

    return {
      path: 'styles.css',
      content: minified,
      size: minified.length,
      hash: this.generateHash(minified)
    };
  }

  /**
   * Génère le sitemap.xml
   */
  async generateSitemap(site: Site): Promise<BuildFile> {
    const baseUrl = site.domain || `https://${site.name}.example.com`;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return {
      path: 'sitemap.xml',
      content: xml,
      size: xml.length,
      hash: this.generateHash(xml)
    };
  }

  /**
   * Génère le robots.txt
   */
  async generateRobotsTxt(site: Site): Promise<BuildFile> {
    const baseUrl = site.domain || `https://${site.name}.example.com`;
    const txt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

    return {
      path: 'robots.txt',
      content: txt,
      size: txt.length,
      hash: this.generateHash(txt)
    };
  }

  /**
   * Optimise les assets
   */
  async optimizeAssets(site: Site): Promise<OptimizedAssets> {
    return {
      images: [],
      css: {
        inline: '',
        external: [],
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
   * Rendu des sections
   */
  private renderSections(sections: any[]): string {
    return sections.map(section => {
      const { type, content } = section;

      switch (type) {
        case 'hero':
          return `
<section id="${section.id || 'hero'}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
  <div class="container">
    <h1>${this.escapeHtml(content.heading)}</h1>
    <p>${this.escapeHtml(content.subheading)}</p>
    ${content.cta ? `<a href="${content.cta.link}" class="btn">${this.escapeHtml(content.cta.text)}</a>` : ''}
  </div>
</section>`;

        case 'features':
          return `
<section id="${section.id || 'features'}">
  <div class="container">
    <h2>${this.escapeHtml(content.heading)}</h2>
    <p>${this.escapeHtml(content.subheading)}</p>
    ${content.items ? content.items.map((item: any) => `
      <div class="feature">
        <h3>${this.escapeHtml(item.title)}</h3>
        <p>${this.escapeHtml(item.description)}</p>
      </div>
    `).join('') : ''}
  </div>
</section>`;

        case 'about':
          return `
<section id="${section.id || 'about'}">
  <div class="container">
    <h2>${this.escapeHtml(content.heading)}</h2>
    <p>${this.escapeHtml(content.subheading)}</p>
    <div>${content.body || ''}</div>
  </div>
</section>`;

        case 'contact':
          return `
<section id="${section.id || 'contact'}">
  <div class="container">
    <h2>${this.escapeHtml(content.heading)}</h2>
    <p>${this.escapeHtml(content.subheading)}</p>
    <form>
      <input type="text" name="name" placeholder="Nom" required>
      <input type="email" name="email" placeholder="Email" required>
      <textarea name="message" placeholder="Message" required></textarea>
      <button type="submit">Envoyer</button>
    </form>
  </div>
</section>`;

        case 'cta':
          return `
<section id="${section.id || 'cta'}" style="background: #f7fafc;">
  <div class="container">
    <h2>${this.escapeHtml(content.heading)}</h2>
    <p>${this.escapeHtml(content.subheading)}</p>
    <a href="${content.cta?.link || '#'}" class="btn">${this.escapeHtml(content.cta?.text || 'En savoir plus')}</a>
  </div>
</section>`;

        case 'form':
          return `
<section id="${section.id || 'form'}">
  <div class="container">
    <h2>${content.heading || 'Formulaire'}</h2>
    <p>${content.subheading || ''}</p>
    ${content.form?.fields?.map((field: any) => `
      <div class="form-field">
        <label>${this.escapeHtml(field.label)}</label>
        <input type="${field.type}" name="${field.name}" ${field.required ? 'required' : ''}>
      </div>
    `).join('') || ''}
    <button type="submit">Soumettre</button>
  </div>
</section>`;

        default:
          return `<section id="${section.id}" class="${type}">${content.body || ''}</section>`;
      }
    }).join('\n');
  }

  /**
   * Échappe le HTML
   */
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
   * Calcule les tailles
   */
  private calculateSizes(files: BuildFile[], assets: OptimizedAssets): any {
    const htmlSize = files.find(f => f.path.endsWith('.html'))?.size || 0;
    const cssSize = files.find(f => f.path.endsWith('.css'))?.size || 0;

    return {
      html: htmlSize,
      css: cssSize,
      js: 0,
      images: 0,
      total: htmlSize + cssSize
    };
  }

  /**
   * Génère un hash
   */
  private generateHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
}

export default BuildEngine;
