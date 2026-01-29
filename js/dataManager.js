/**
 * Data Manager - Export, Import, Version Management
 */

// Data Manager class
class DataManager {
    constructor() {
        this.storageKey = 'siteData';
        this.versionsKey = 'siteDataVersions';
        this.maxVersions = 10;
        this.versions = [];
    }

    /**
     * Export data as JSON file
     */
    exportJSON() {
        const content = JSON.stringify(siteData, null, 4);
        this.downloadFile(content, 'site-data.json', 'application/json');
    }

    /**
     * Export data as data.js file
     */
    exportDataJS() {
        const content = `/**
 * Site Data - JSON structure for academic homepage
 * Edit this file to update the website content
 * Generated: ${new Date().toISOString()}
 */

const siteData = ${JSON.stringify(siteData, null, 4)};
`;
        this.downloadFile(content, 'data.js', 'application/javascript');
    }

    /**
     * Export data as Markdown
     */
    exportMarkdown() {
        let md = '# Academic Homepage Data\n\n';
        md += `Generated: ${new Date().toISOString()}\n\n`;

        // Profile
        md += '## Profile\n\n';
        md += `- Name: ${siteData.profile.name.en}\n`;
        md += `- Title: ${siteData.profile.title}\n`;
        md += `- Institution: ${siteData.profile.institution.name}\n`;
        md += `- Email: ${siteData.profile.email}\n`;
        md += `- Location: ${siteData.profile.location}\n\n`;

        // About
        md += '## About\n\n';
        md += siteData.about.description.map(p => p).join('\n\n');
        md += '\n\n';
        md += '### Research Interests\n\n';
        md += siteData.about.researchInterests.join(', ');
        md += '\n\n';

        // Publications
        md += '## Publications\n\n';
        siteData.publications.items.forEach((pub, idx) => {
            md += `### ${idx + 1}. ${pub.title}\n\n`;
            md += `**Authors:** ${pub.authors}\n\n`;
            md += `**Venue:** ${pub.venue}\n\n`;
            if (pub.badges && pub.badges.length > 0) {
                md += `**Badges:** ${pub.badges.join(', ')}\n\n`;
            }
            if (pub.links && pub.links.length > 0) {
                md += `**Links:** ${pub.links.map(l => `[${l.label}](${l.url})`).join(' | ')}\n\n`;
            }
            md += '---\n\n';
        });

        // Awards
        md += '## Awards\n\n';
        siteData.awards.forEach(award => {
            md += `- **${award.date}** - ${award.name} (${award.institution})\n`;
        });
        md += '\n\n';

        // Experience
        md += '## Experience\n\n';
        siteData.experience.forEach(exp => {
            md += `### ${exp.date}\n\n`;
            md += `**${exp.title}**\n\n`;
            md += `${exp.institution}\n\n`;
            if (exp.supervisor) {
                md += `*${exp.supervisor}*\n\n`;
            }
            md += '---\n\n';
        });

        // News
        md += '## News\n\n';
        siteData.news.forEach(item => {
            md += `- **${item.date}** ${item.icon} ${this.stripHTML(item.content)}\n`;
        });
        md += '\n\n';

        // Services
        md += '## Services\n\n';
        md += '### Reviewer\n\n';
        siteData.services.reviewer.forEach(r => {
            md += `- ${r}\n`;
        });
        md += '\n\n';
        if (siteData.services.pcMember.length > 0) {
            md += '### PC Member\n\n';
            siteData.services.pcMember.forEach(p => {
                md += `- ${p}\n`;
            });
        }

        this.downloadFile(md, 'site-data.md', 'text/markdown');
    }

    /**
     * Import data from JSON file
     */
    importJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (this.validateData(data)) {
                        resolve(data);
                    } else {
                        reject(new Error('Invalid data format'));
                    }
                } catch (err) {
                    reject(new Error('Failed to parse JSON'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    /**
     * Validate data structure
     */
    validateData(data) {
        const requiredFields = [
            'profile.name.en',
            'profile.title',
            'profile.email',
            'about.description',
            'about.researchInterests',
            'news',
            'publications.myName',
            'publications.items',
            'awards',
            'experience',
            'services'
        ];

        for (const field of requiredFields) {
            const parts = field.split('.');
            let current = data;
            for (const part of parts) {
                if (!current || current[part] === undefined) {
                    console.error(`Missing required field: ${field}`);
                    return false;
                }
                current = current[part];
            }
        }

        // Validate arrays
        if (!Array.isArray(data.about.description)) {
            console.error('about.description must be an array');
            return false;
        }
        if (!Array.isArray(data.about.researchInterests)) {
            console.error('about.researchInterests must be an array');
            return false;
        }
        if (!Array.isArray(data.news)) {
            console.error('news must be an array');
            return false;
        }
        if (!Array.isArray(data.publications.items)) {
            console.error('publications.items must be an array');
            return false;
        }
        if (!Array.isArray(data.awards)) {
            console.error('awards must be an array');
            return false;
        }
        if (!Array.isArray(data.experience)) {
            console.error('experience must be an array');
            return false;
        }

        // Validate URLs if present
        const urlFields = [
            'profile.institution.url',
            'profile.avatar',
            'profile.social.github',
            'profile.social.googleScholar',
            'profile.social.linkedin',
            'profile.social.twitter',
            'profile.social.orcid'
        ];

        for (const field of urlFields) {
            const parts = field.split('.');
            let current = data;
            for (let i = 0; i < parts.length; i++) {
                if (!current) break;
                if (i === parts.length - 1 && current[parts[i]]) {
                    if (!this.isValidURL(current[parts[i]])) {
                        console.warn(`Invalid URL: ${field} = ${current[parts[i]]}`);
                    }
                }
                current = current[parts[i]];
            }
        }

        // Validate email
        if (data.profile.email && !this.isValidEmail(data.profile.email)) {
            console.warn('Invalid email format');
            return false;
        }

        return true;
    }

    /**
     * Create version snapshot
     */
    createSnapshot() {
        const version = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            data: JSON.parse(JSON.stringify(siteData)),
            label: this.generateSnapshotLabel()
        };

        this.versions = this.loadVersions();
        this.versions.unshift(version);

        // Keep only max versions
        if (this.versions.length > this.maxVersions) {
            this.versions = this.versions.slice(0, this.maxVersions);
        }

        this.saveVersions();
        return version;
    }

    /**
     * Generate snapshot label
     */
    generateSnapshotLabel() {
        const date = new Date();
        return `Snapshot - ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }

    /**
     * Load versions from localStorage
     */
    loadVersions() {
        try {
            const stored = localStorage.getItem(this.versionsKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load versions:', e);
            return [];
        }
    }

    /**
     * Save versions to localStorage
     */
    saveVersions() {
        try {
            localStorage.setItem(this.versionsKey, JSON.stringify(this.versions));
        } catch (e) {
            console.error('Failed to save versions:', e);
        }
    }

    /**
     * Restore from snapshot
     */
    restoreSnapshot(versionId) {
        this.versions = this.loadVersions();
        const version = this.versions.find(v => v.id === versionId);

        if (version) {
            if (confirm(`Restore from "${version.label}"?\n\nThis will replace all current data.`)) {
                // Apply restored data
                Object.assign(siteData, version.data);

                // Create snapshot before restore
                this.createSnapshot();

                // Re-render
                init();
                showNotification('Data restored successfully!');
                return true;
            }
        }

        return false;
    }

    /**
     * Delete snapshot
     */
    deleteSnapshot(versionId) {
        if (confirm('Are you sure you want to delete this snapshot?')) {
            this.versions = this.versions.filter(v => v.id !== versionId);
            this.saveVersions();
            showNotification('Snapshot deleted');
            return true;
        }
        return false;
    }

    /**
     * Get all versions
     */
    getVersions() {
        this.versions = this.loadVersions();
        return this.versions;
    }

    /**
     * Clear all versions
     */
    clearVersions() {
        if (confirm('Are you sure you want to delete all saved versions?')) {
            this.versions = [];
            this.saveVersions();
            showNotification('All versions cleared');
            return true;
        }
        return false;
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

    /**
     * Validate URL
     */
    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Validate email
     */
    isValidEmail(string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(string);
    }

    /**
     * Strip HTML tags
     */
    stripHTML(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    /**
     * Get data statistics
     */
    getStatistics() {
        return {
            profile: {
                name: siteData.profile.name.en,
                email: siteData.profile.email,
                institution: siteData.profile.institution.name
            },
            content: {
                newsCount: siteData.news.length,
                publicationsCount: siteData.publications.items.length,
                awardsCount: siteData.awards.length,
                experienceCount: siteData.experience.length,
                researchInterestsCount: siteData.about.researchInterests.length
            },
            versions: this.loadVersions().length,
            lastUpdated: new Date().toISOString()
        };
    }
}

// Global instance
const dataManager = new DataManager();

// Export functions for use in other modules
window.dataManager = dataManager;
