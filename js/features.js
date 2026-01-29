/**
 * Enhanced Features - Multi-language, Search, Print, Copy to Clipboard
 */

// Search functionality
class Search {
    constructor() {
        this.searchIndex = this.buildSearchIndex();
        this.resultsContainer = null;
        this.queryInput = null;
    }

    /**
     * Build search index from all content
     */
    buildSearchIndex() {
        const index = [];

        // Publications
        siteData.publications.items.forEach((pub, idx) => {
            index.push({
                type: 'publication',
                id: idx,
                title: pub.title,
                authors: pub.authors,
                venue: pub.venue,
                section: 'publications',
                score: 3
            });
        });

        // News
        siteData.news.forEach((item, idx) => {
            index.push({
                type: 'news',
                id: idx,
                title: item.date,
                content: this.stripHTML(item.content),
                section: 'news',
                score: 2
            });
        });

        // Awards
        siteData.awards.forEach((award, idx) => {
            index.push({
                type: 'award',
                id: idx,
                title: award.name,
                content: award.institution,
                section: 'awards',
                score: 2
            });
        });

        // Experience
        siteData.experience.forEach((exp, idx) => {
            index.push({
                type: 'experience',
                id: idx,
                title: exp.title,
                content: exp.institution,
                section: 'experience',
                score: 2
            });
        });

        // Research Interests
        siteData.about.researchInterests.forEach((interest, idx) => {
            index.push({
                type: 'interest',
                id: idx,
                title: interest,
                section: 'about',
                score: 1
            });
        });

        return index;
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
     * Search query
     */
    search(query) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const terms = query.toLowerCase().split(/\s+/);
        const results = [];

        this.searchIndex.forEach(item => {
            let matchScore = 0;

            terms.forEach(term => {
                // Check title
                if (item.title.toLowerCase().includes(term)) {
                    matchScore += item.score * 2;
                }

                // Check content
                if (item.content && item.content.toLowerCase().includes(term)) {
                    matchScore += item.score;
                }

                // Check authors (for publications)
                if (item.authors && item.authors.toLowerCase().includes(term)) {
                    matchScore += item.score;
                }
            });

            if (matchScore > 0) {
                results.push({
                    ...item,
                    score: matchScore
                });
            }
        });

        // Sort by score descending
        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * Create search UI
     */
    createSearchUI() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-header">
                <input type="text" class="search-input" placeholder="Search publications, news, awards..." id="search-input">
                <button class="search-close" id="search-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="search-results" id="search-results">
                <div class="search-empty">Start typing to search...</div>
            </div>
        `;

        this.queryInput = searchContainer.querySelector('#search-input');
        this.resultsContainer = searchContainer.querySelector('#search-results');
        const closeBtn = searchContainer.querySelector('#search-close');

        // Event listeners
        this.queryInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.queryInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
        closeBtn.addEventListener('click', () => this.close());

        return searchContainer;
    }

    /**
     * Handle search input
     */
    handleSearch(query) {
        const results = this.search(query);

        if (results.length === 0) {
            if (query.trim().length < 2) {
                this.resultsContainer.innerHTML = '<div class="search-empty">Start typing to search...</div>';
            } else {
                this.resultsContainer.innerHTML = '<div class="search-empty">No results found</div>';
            }
            return;
        }

        this.resultsContainer.innerHTML = results.map(result => this.renderResult(result)).join('');

        // Add click handlers
        this.resultsContainer.querySelectorAll('.search-result').forEach(el => {
            el.addEventListener('click', () => {
                this.goToResult(result => result.type === el.dataset.type && result.id === parseInt(el.dataset.id));
                this.close();
            });
        });
    }

    /**
     * Render search result
     */
    renderResult(result) {
        const icon = {
            'publication': '<i class="fas fa-file-alt"></i>',
            'news': '<i class="fas fa-newspaper"></i>',
            'award': '<i class="fas fa-trophy"></i>',
            'experience': '<i class="fas fa-briefcase"></i>',
            'interest': '<i class="fas fa-tag"></i>'
        }[result.type] || '<i class="fas fa-circle"></i>';

        return `
            <div class="search-result" data-type="${result.type}" data-id="${result.id}">
                <div class="search-result-icon">${icon}</div>
                <div class="search-result-content">
                    <div class="search-result-title">${this.highlightTerms(result.title)}</div>
                    ${result.content ? `<div class="search-result-text">${this.highlightTerms(result.content)}</div>` : ''}
                    ${result.authors ? `<div class="search-result-authors">${this.highlightTerms(result.authors)}</div>` : ''}
                    <div class="search-result-meta">
                        <span class="search-result-type">${result.type}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Highlight search terms in text
     */
    highlightTerms(text) {
        const query = this.queryInput.value.trim();
        if (!query) return text;

        const terms = query.split(/\s+/).filter(t => t.length > 1);
        if (terms.length === 0) return text;

        const regex = new RegExp(`(${terms.join('|')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    /**
     * Go to result
     */
    goToResult(filterFn) {
        const result = this.searchIndex.find(filterFn);
        if (result) {
            const section = document.getElementById(result.section);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    /**
     * Open search
     */
    open() {
        if (!document.querySelector('.search-container')) {
            const searchUI = this.createSearchUI();
            document.body.appendChild(searchUI);
            this.queryInput.focus();
        }
    }

    /**
     * Close search
     */
    close() {
        const searchUI = document.querySelector('.search-container');
        if (searchUI) {
            searchUI.remove();
        }
    }
}

// Copy to clipboard functionality
const CopyToClipboard = {
    /**
     * Copy text to clipboard
     */
    copy(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!');
        }).catch(err => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showNotification('Copied to clipboard!');
            } catch (e) {
                showNotification('Failed to copy', true);
            }
            document.body.removeChild(textarea);
        });
    },

    /**
     * Copy publication as BibTeX
     */
    copyBibTeX(pub) {
        // Generate BibTeX format
        const authors = pub.authors.split(',').map(a => a.trim().split(' ').reverse().join(', ')).join(' and ');
        const year = pub.venue.match(/\d{4}/)?.[0] || new Date().getFullYear();
        const title = pub.title;
        const venue = pub.venue.replace(/\d{4}/g, '').trim();

        const bibtex = `@article{${this.generateKey(pub)},
  author = {${authors}},
  title = {${title}},
  journal = {${venue}},
  year = {${year}}
}`;

        this.copy(bibtex);
    },

    /**
     * Generate BibTeX key
     */
    generateKey(pub) {
        const firstAuthor = pub.authors.split(',')[0].trim().toLowerCase().replace(/\s+/g, '');
        const year = pub.venue.match(/\d{4}/)?.[0] || 'xxxx';
        return `${firstAuthor}${year}`;
    },

    /**
     * Add copy buttons to publications
     */
    addCopyButtons() {
        document.querySelectorAll('.publication-item').forEach((item, idx) => {
            const pub = siteData.publications.items[idx];
            if (!pub) return;

            // Check if buttons already exist
            if (item.querySelector('.copy-actions')) return;

            const actions = document.createElement('div');
            actions.className = 'copy-actions';
            actions.innerHTML = `
                <button class="copy-btn" data-type="bib" title="Copy BibTeX">
                    <i class="fas fa-quote-right"></i>
                </button>
                <button class="copy-btn" data-type="email" title="Copy Title">
                    <i class="fas fa-heading"></i>
                </button>
            `;

            // Add event listeners
            actions.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const type = btn.dataset.type;

                    if (type === 'bib') {
                        this.copyBibTeX(pub);
                    } else if (type === 'email') {
                        this.copy(pub.title);
                    }
                });
            });

            item.querySelector('.pub-links')?.after(actions);
        });

        // Add copy button to email
        const emailLink = document.querySelector('.profile-info-item a[href^="mailto:"]');
        if (emailLink && !emailLink.querySelector('.copy-email-btn')) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-email-btn';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.title = 'Copy email';
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const email = emailLink.textContent.trim();
                this.copy(email);
            });
            emailLink.parentElement.appendChild(copyBtn);
        }
    }
};

// Print functionality
const Print = {
    /**
     * Print page
     */
    print() {
        window.print();
    },

    /**
     * Add print button
     */
    addPrintButton() {
        const nav = document.querySelector('.nav-container');
        if (nav && !nav.querySelector('.print-btn')) {
            const printBtn = document.createElement('button');
            printBtn.className = 'print-btn';
            printBtn.innerHTML = '<i class="fas fa-print"></i>';
            printBtn.title = 'Print page';
            printBtn.addEventListener('click', () => this.print());
            nav.appendChild(printBtn);
        }
    }
};

// Global instances
const search = new Search();

// Initialize features
document.addEventListener('DOMContentLoaded', () => {
    // Add search shortcut (Ctrl/Cmd + K)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            search.open();
        }
    });

    // Add search button to nav
    const nav = document.querySelector('.nav-links');
    if (nav && !nav.querySelector('.search-trigger')) {
        const searchTrigger = document.createElement('button');
        searchTrigger.className = 'search-trigger';
        searchTrigger.innerHTML = '<i class="fas fa-search"></i>';
        searchTrigger.title = 'Search (Ctrl+K)';
        searchTrigger.addEventListener('click', () => search.open());
        nav.appendChild(searchTrigger);
    }

    // Add print button
    Print.addPrintButton();

    // Add copy buttons after content is rendered
    setTimeout(() => {
        CopyToClipboard.addCopyButtons();
    }, 500);

    // Re-add copy buttons when switching edit mode
    const editBtn = document.getElementById('edit-mode-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            setTimeout(() => {
                if (!document.body.classList.contains('edit-mode')) {
                    CopyToClipboard.addCopyButtons();
                }
            }, 100);
        });
    }
});

// Export for use in other modules
window.search = search;
window.CopyToClipboard = CopyToClipboard;
window.Print = Print;
