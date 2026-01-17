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
  const pageContent = this.renderSections(site.sections);

    // Logic for Password Protection
    let bodyContent = pageContent;
let headScripts = '';

if (site.settings.access?.isPrivate && site.settings.access.password) {
  try {
    // We need to encrypt the content. Since this is an async operation using Web Crypto,
    // we'll handle it here. Note: In a real environment, we should ensure this matches
    // the decryption logic exactly.

    // For build simplicity here, we will return a "Gate" implementation that relies on
    // the browser's crypto API at runtime. Ideally, we pre-encrypt here.

    // APPROACH: Hybrid. We encrypt the content NOW using a simulated delay or sync logic if possible, 
    // but WebCrypto is Async. BuildEngine.generateHTML is async, so we are good.

    const password = site.settings.access.password;
    const contentToEncrypt = pageContent; // Check if we want to encrypt just sections or full body

    // 1. Generate Salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 2. Derive Key
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    // 3. Encrypt
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      enc.encode(contentToEncrypt)
    );

    // 4. Convert to Base64 strings for storage
    const encryptedBase64 = this.arrayBufferToBase64(encryptedBuffer);
    const saltBase64 = this.arrayBufferToBase64(salt.buffer);
    const ivBase64 = this.arrayBufferToBase64(iv.buffer);

    // 5. Replace Body with Lock Screen
    bodyContent = this.generateLockScreen(encryptedBase64, saltBase64, ivBase64);

  } catch (e) {
    console.error("Encryption failed", e);
    // Fallback or error? For now, we might leak if we fail, but ideally we should fail the build
    // Throwing error to stop build
    throw new Error("Failed to encrypt private site content");
  }
}

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
  ${bodyContent}
  
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
  
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

  private generateLockScreen(encryptedContent: string, salt: string, iv: string): string {
  return `
      <div id="lock-screen" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #f8fafc; font-family: system-ui, sans-serif;">
          <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px;">
              <div style="text-align: center; margin-bottom: 1.5rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #3b82f6; margin-bottom: 1rem;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <h1 style="font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0;">Private Content</h1>
                  <p style="color: #64748b; margin-top: 0.5rem;">Please enter the password to view this site.</p>
              </div>
              <form id="unlock-form" onsubmit="unlockSite(event)">
                  <div style="margin-bottom: 1rem;">
                      <input type="password" id="password-input" placeholder="Password" style="width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box;" required autofocus>
                  </div>
                  <button type="submit" style="width: 100%; background-color: #3b82f6; color: white; padding: 0.75rem; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 1rem; cursor: pointer;">Unlock Site</button>
                  <p id="error-msg" style="color: #ef4444; font-size: 0.875rem; margin-top: 1rem; text-align: center; display: none;">Incorrect password</p>
              </form>
          </div>
      </div>
      <div id="site-content" style="display: none;"></div>
      <script>
          const encryptedData = "${encryptedContent}";
          const saltBase64 = "${salt}";
          const ivBase64 = "${iv}";
          
          async function unlockSite(e) {
              e.preventDefault();
              const password = document.getElementById('password-input').value;
              const btn = e.target.querySelector('button');
              const errorMsg = document.getElementById('error-msg');
              
              btn.disabled = true;
              btn.textContent = 'Decrypting...';
              errorMsg.style.display = 'none';
              
              try {
                  const enc = new TextEncoder();
                  
                  // Decode Base64
                  const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
                  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
                  const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
                  
                  const keyMaterial = await window.crypto.subtle.importKey(
                      "raw", 
                      enc.encode(password), 
                      { name: "PBKDF2" }, 
                      false, 
                      ["deriveKey"]
                  );
                  
                  const key = await window.crypto.subtle.deriveKey(
                      {
                          name: "PBKDF2",
                          salt: salt,
                          iterations: 100000,
                          hash: "SHA-256"
                      },
                      keyMaterial,
                      { name: "AES-GCM", length: 256 },
                      false,
                      ["decrypt"]
                  );
                  
                  const decrypted = await window.crypto.subtle.decrypt(
                      {
                          name: "AES-GCM",
                          iv: iv
                      },
                      key,
                      data
                  );
                  
                  const dec = new TextDecoder();
                  const htmlContent = dec.decode(decrypted);
                  
                  document.getElementById('lock-screen').remove();
                  const contentDiv = document.getElementById('site-content');
                  contentDiv.innerHTML = htmlContent;
                  contentDiv.style.display = 'block';
                  
                  // Re-execute scripts if any (innerHTML doesn't execute scripts by default)
                  Array.from(contentDiv.querySelectorAll('script')).forEach(oldScript => {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                  });
                  
              } catch (err) {
                  console.error(err);
                  btn.textContent = 'Unlock Site';
                  btn.disabled = false;
                  errorMsg.style.display = 'block';
              }
          }
      </script>

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
    < section id = "${section.id}" class="section section-hero" style = "background-image: url('${content.image || ''}')" >
      <div class="overlay" > </div>
        < div class="container relative z-10" >
          <h1>${ this.escapeHtml(content.heading) } </h1>
            < p > ${ this.escapeHtml(content.subheading) } </p>
            ${ content.cta ? `<a href="${content.cta.link}" class="btn btn-${content.cta.style || 'primary'}">${this.escapeHtml(content.cta.text)}</a>` : '' }
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

      case 'form':
  const form = content.form;
  if (!form) return '';

  return `
    <section id="${section.id}" class="section section-form bg-white">
        <div class="container max-w-3xl">
            <div class="section-header text-center mb-10">
                 ${content.heading ? `<h2>${this.escapeHtml(content.heading)}</h2>` : ''}
                 ${content.subheading ? `<p>${this.escapeHtml(content.subheading)}</p>` : ''}
            </div>
            <form id="${form.id || 'form-' + section.id}" class="space-y-6">
                <div class="form-grid" style="display: flex; flex-wrap: wrap; gap: 1rem;">
                ${form.fields
      .sort((a: any, b: any) => a.order - b.order)
      .map((field: any) => {
        const widthStyle = field.width === 'half' ? 'width: calc(50% - 0.5rem);' :
          field.width === 'third' ? 'width: calc(33.33% - 0.66rem);' : 'width: 100%;';

        let inputHtml = '';
        const requiredAttr = field.required ? 'required' : '';

        switch (field.type) {
          case 'textarea':
            inputHtml = `<textarea name="${field.name}" placeholder="${this.escapeHtml(field.placeholder)}" ${requiredAttr} rows="4" class="form-input"></textarea>`;
            break;
          case 'select':
            inputHtml = `<select name="${field.name}" ${requiredAttr} class="form-select">
                                    <option value="">${this.escapeHtml(field.placeholder || 'Select...')}</option>
                                    ${field.options?.map((o: any) => `<option value="${o.value}">${this.escapeHtml(o.label)}</option>`).join('')}
                                </select>`;
            break;
          default: // text, email, etc.
            inputHtml = `<input type="${field.type}" name="${field.name}" placeholder="${this.escapeHtml(field.placeholder)}" ${requiredAttr} class="form-input">`;
        }

        return `
                        <div class="form-group" style="${widthStyle}">
                            <label class="form-label">${this.escapeHtml(field.label)} ${field.required ? '<span class="text-red-500">*</span>' : ''}</label>
                            ${inputHtml}
                        </div>`;
      }).join('')}
                </div>
                <div class="form-actions" style="margin-top: 2rem; text-align: ${form.settings?.submitButtonStyle === 'outline' ? 'center' : form.settings?.submitButtonStyle === 'secondary' ? 'right' : 'left'}">
                    <button type="submit" class="btn btn-${form.settings?.submitButtonStyle || 'primary'}">
                        ${this.escapeHtml(form.settings?.submitButtonText || 'Send Message')}
                    </button>
                </div>
            </form>
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
  private async generateCSS(site: Site): Promise < BuildFile > {
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

/* Generated Forms */
.form-input, .form-select, textarea.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1; /* slate-300 */
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #334155; /* slate-700 */
}

.form-group {
  margin-bottom: 1rem;
}

.text-red-500 { color: #ef4444; }

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
  private async generateSitemap(site: Site): Promise < BuildFile > {
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
  private async generateRobotsTxt(site: Site): Promise < BuildFile > {
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
  async optimizeAssets(site: Site): Promise < OptimizedAssets > {
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
