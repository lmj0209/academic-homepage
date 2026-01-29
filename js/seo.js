/**
 * SEO Manager - Enhance search engine optimization
 */

class SEOManager {
    constructor() {
        this.siteConfig = {
            title: siteData.profile.name.en + ' - Academic Homepage',
            description: `Personal academic homepage of ${siteData.profile.name.en}, ${siteData.profile.title} at ${siteData.profile.institution.name}. Research interests include ${siteData.about.researchInterests.join(', ')}.`,
            keywords: [
                'academic',
                'research',
                'publications',
                ...siteData.about.researchInterests
            ].join(', '),
            author: siteData.profile.name.en,
            image: window.location.origin + '/' + siteData.profile.avatar,
            url: window.location.href,
            type: 'website',
            locale: 'en_US'
        };
    }

    /**
     * Initialize SEO
     */
    init() {
        this.updateMetaTags();
        this.addStructuredData();
        this.updateDocumentTitle();
    }

    /**
     * Update document title
     */
    updateDocumentTitle() {
        document.title = this.siteConfig.title;
    }

    /**
     * Update meta tags
     */
    updateMetaTags() {
        const head = document.head;

        // Update or create description
        this.updateOrCreateMeta('name', 'description', this.siteConfig.description);

        // Update or create keywords
        this.updateOrCreateMeta('name', 'keywords', this.siteConfig.keywords);

        // Update or create author
        this.updateOrCreateMeta('name', 'author', this.siteConfig.author);

        // Open Graph tags
        this.updateOrCreateMeta('property', 'og:title', this.siteConfig.title);
        this.updateOrCreateMeta('property', 'og:description', this.siteConfig.description);
        this.updateOrCreateMeta('property', 'og:image', this.siteConfig.image);
        this.updateOrCreateMeta('property', 'og:url', this.siteConfig.url);
        this.updateOrCreateMeta('property', 'og:type', this.siteConfig.type);
        this.updateOrCreateMeta('property', 'og:locale', this.siteConfig.locale);

        // Twitter Card tags
        this.updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
        this.updateOrCreateMeta('name', 'twitter:title', this.siteConfig.title);
        this.updateOrCreateMeta('name', 'twitter:description', this.siteConfig.description);
        this.updateOrCreateMeta('name', 'twitter:image', this.siteConfig.image);

        // Additional meta tags
        this.updateOrCreateMeta('name', 'robots', 'index, follow');
        this.updateOrCreateMeta('name', 'googlebot', 'index, follow');

        // Viewport and theme color
        this.updateOrCreateMeta('name', 'viewport', 'width=device-width, initial-scale=1.0');
        this.updateOrCreateMeta('name', 'theme-color', '#2c5282');

        // Canonical URL
        let canonical = head.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            head.appendChild(canonical);
        }
        canonical.href = this.siteConfig.url;
    }

    /**
     * Update or create meta tag
     */
    updateOrCreateMeta(attrName, attrValue, content) {
        const head = document.head;
        let meta = head.querySelector(`meta[${attrName}="${attrValue}"]`);

        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attrName, attrValue);
            head.appendChild(meta);
        }

        meta.content = content;
    }

    /**
     * Add structured data (JSON-LD)
     */
    addStructuredData() {
        const head = document.head;

        // Remove existing structured data if any
        const existingScript = head.querySelector('#structured-data');
        if (existingScript) {
            existingScript.remove();
        }

        // Person schema
        const personSchema = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: siteData.profile.name.en,
            jobTitle: siteData.profile.title,
            worksFor: {
                '@type': 'Organization',
                name: siteData.profile.institution.name,
                url: siteData.profile.institution.url
            },
            email: siteData.profile.email,
            url: this.siteConfig.url,
            image: this.siteConfig.image,
            knowsAbout: siteData.about.researchInterests,
            description: siteData.about.description.join(' ')
        };

        // Add publications
        const publicationSchemas = siteData.publications.items.map(pub => ({
            '@context': 'https://schema.org',
            '@type': 'ScholarlyArticle',
            name: pub.title,
            author: pub.authors.split(',').map(a => ({
                '@type': 'Person',
                name: a.trim()
            })),
            publication: pub.venue,
            datePublished: pub.venue.match(/\d{4}/)?.[0] || new Date().getFullYear()
        }));

        // Create script element
        const script = document.createElement('script');
        script.id = 'structured-data';
        script.type = 'application/ld+json';

        script.textContent = JSON.stringify(personSchema, null, 2);

        head.appendChild(script);
    }

    /**
     * Generate sitemap XML
     */
    generateSitemap() {
        const baseUrl = window.location.origin;
        const lastMod = new Date().toISOString();

        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Add homepage
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${baseUrl}/</loc>\n`;
        sitemap += `    <lastmod>${lastMod}</lastmod>\n`;
        sitemap += `    <changefreq>weekly</changefreq>\n`;
        sitemap += `    <priority>1.0</priority>\n`;
        sitemap += `  </url>\n`;

        // Add section pages (if they were separate pages)
        const sections = ['about', 'news', 'publications', 'awards', 'experience', 'services'];
        sections.forEach(section => {
            sitemap += `  <url>\n`;
            sitemap += `    <loc>${baseUrl}/#${section}</loc>\n`;
            sitemap += `    <lastmod>${lastMod}</lastmod>\n`;
            sitemap += `    <changefreq>monthly</changefreq>\n`;
            sitemap += `    <priority>0.8</priority>\n`;
            sitemap += `  </url>\n`;
        });

        sitemap += '</urlset>';

        return sitemap;
    }

    /**
     * Generate robots.txt
     */
    generateRobotsTxt() {
        const baseUrl = new URL(window.location.href).origin;

        let robots = 'User-agent: *\n';
        robots += 'Allow: /\n';
        robots += '\n';
        robots += `Sitemap: ${baseUrl}/sitemap.xml\n`;

        return robots;
    }

    /**
     * Download sitemap
     */
    downloadSitemap() {
        const content = this.generateSitemap();
        this.downloadFile(content, 'sitemap.xml', 'application/xml');
    }

    /**
     * Download robots.txt
     */
    downloadRobotsTxt() {
        const content = this.generateRobotsTxt();
        this.downloadFile(content, 'robots.txt', 'text/plain');
    }

    /**
     * Download file
     */
    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Global instance
const seoManager = new SEOManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    seoManager.init();
});

// Export for use in other modules
window.seoManager = seoManager;
