/**
 * Accessibility Manager - Enhance accessibility for all users
 */

class AccessibilityManager {
    constructor() {
        this.storageKey = 'site-accessibility';
        this.settings = {
            reducedMotion: false,
            highContrast: false,
            fontSize: 'normal'
        };
    }

    /**
     * Initialize accessibility
     */
    init() {
        this.loadSettings();
        this.applySettings();
        this.setupKeyboardNavigation();
        this.addSkipLinks();
        this.enhanceAriaLabels();
        this.setupFocusManagement();
    }

    /**
     * Load accessibility settings
     */
    loadSettings() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.settings = { ...this.settings, ...JSON.parse(stored) };
            }
        } catch (e) {
            console.error('Failed to load accessibility settings:', e);
        }
    }

    /**
     * Save accessibility settings
     */
    saveSettings() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    }

    /**
     * Apply accessibility settings
     */
    applySettings() {
        // Reduced motion
        document.documentElement.setAttribute('data-reduced-motion', this.settings.reducedMotion);

        // High contrast
        document.documentElement.setAttribute('data-high-contrast', this.settings.highContrast);

        // Font size
        document.documentElement.setAttribute('data-font-size', this.settings.fontSize);

        // Respect system preference for reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        }
    }

    /**
     * Toggle reduced motion
     */
    toggleReducedMotion() {
        this.settings.reducedMotion = !this.settings.reducedMotion;
        this.saveSettings();
        this.applySettings();
        showNotification(this.settings.reducedMotion ? 'Reduced motion enabled' : 'Reduced motion disabled');
    }

    /**
     * Toggle high contrast
     */
    toggleHighContrast() {
        this.settings.highContrast = !this.settings.highContrast;
        this.saveSettings();
        this.applySettings();
        showNotification(this.settings.highContrast ? 'High contrast enabled' : 'High contrast disabled');
    }

    /**
     * Set font size
     */
    setFontSize(size) {
        const sizes = ['small', 'normal', 'large', 'xlarge'];
        if (sizes.includes(size)) {
            this.settings.fontSize = size;
            this.saveSettings();
            this.applySettings();
            showNotification(`Font size: ${size}`);
        }
    }

    /**
     * Add skip links for keyboard users
     */
    addSkipLinks() {
        if (document.querySelector('.skip-links')) return;

        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#about" class="skip-link">Skip to about</a>
        `;

        document.body.prepend(skipLinks);
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        // Handle tab navigation focus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });

        // Close mobile menu on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('nav-links');
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }

                // Close modals
                document.querySelectorAll('.search-container, .export-menu, .version-modal').forEach(modal => {
                    modal.remove();
                });
            }
        });
    }

    /**
     * Enhance ARIA labels
     */
    enhanceAriaLabels() {
        // Add landmark roles
        const nav = document.querySelector('.top-nav');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }

        const main = document.querySelector('.main-content');
        if (main && !main.getAttribute('id')) {
            main.setAttribute('id', 'main-content');
            main.setAttribute('role', 'main');
            main.setAttribute('tabindex', '-1');
        }

        // Add ARIA labels to buttons
        document.querySelectorAll('button').forEach(btn => {
            if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
                const icon = btn.querySelector('i');
                if (icon) {
                    const iconClass = icon.className;
                    if (iconClass.includes('fa-edit')) {
                        btn.setAttribute('aria-label', 'Edit content');
                    } else if (iconClass.includes('fa-save')) {
                        btn.setAttribute('aria-label', 'Save changes');
                    } else if (iconClass.includes('fa-download')) {
                        btn.setAttribute('aria-label', 'Export data');
                    } else if (iconClass.includes('fa-search')) {
                        btn.setAttribute('aria-label', 'Search');
                    } else if (iconClass.includes('fa-print')) {
                        btn.setAttribute('aria-label', 'Print page');
                    } else if (iconClass.includes('fa-moon')) {
                        btn.setAttribute('aria-label', 'Enable dark mode');
                    } else if (iconClass.includes('fa-sun')) {
                        btn.setAttribute('aria-label', 'Enable light mode');
                    }
                }
            }
        });

        // Add ARIA attributes to mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.setAttribute('aria-controls', 'nav-links');
            mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');

            const navLinks = document.getElementById('nav-links');
            if (navLinks) {
                // Update aria-expanded when menu opens/closes
                const observer = new MutationObserver(() => {
                    mobileMenuBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
                });
                observer.observe(navLinks, { attributes: true, attributeFilter: ['class'] });
            }
        }

        // Add ARIA to search
        document.querySelectorAll('.search-trigger').forEach(btn => {
            btn.setAttribute('aria-label', 'Open search (Ctrl+K)');
        });
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Smooth focus scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    setTimeout(() => {
                        target.focus();
                    }, 100);
                }
            });
        });

        // Focus trap in modals (basic implementation)
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.search-container, .export-menu, .version-modal');
            if (modal && e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    }

    /**
     * Announce to screen readers
     */
    announce(message) {
        let announcer = document.getElementById('accessibility-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'accessibility-announcer';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            document.body.appendChild(announcer);
        }
        announcer.textContent = message;
    }

    /**
     * Create accessibility menu
     */
    createAccessibilityMenu() {
        const menu = document.createElement('div');
        menu.className = 'a11y-menu';
        menu.innerHTML = `
            <button class="a11y-toggle" id="a11y-toggle" aria-expanded="false" aria-label="Accessibility options">
                <i class="fas fa-universal-access"></i>
            </button>
            <div class="a11y-options" id="a11y-options" hidden>
                <h4>Accessibility</h4>
                <button onclick="a11yManager.toggleReducedMotion()">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Reduced Motion</span>
                </button>
                <button onclick="a11yManager.toggleHighContrast()">
                    <i class="fas fa-adjust"></i>
                    <span>High Contrast</span>
                </button>
                <div class="a11y-font-size">
                    <span>Font Size:</span>
                    <button onclick="a11yManager.setFontSize('small')">A-</button>
                    <button onclick="a11yManager.setFontSize('normal')">A</button>
                    <button onclick="a11yManager.setFontSize('large')">A+</button>
                </div>
            </div>
        `;

        document.body.appendChild(menu);

        const toggle = menu.querySelector('#a11y-toggle');
        const options = menu.querySelector('#a11y-options');

        toggle.addEventListener('click', () => {
            const isHidden = options.hidden;
            options.hidden = !isHidden;
            toggle.setAttribute('aria-expanded', String(!isHidden));
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target)) {
                options.hidden = true;
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Global instance
const a11yManager = new AccessibilityManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    a11yManager.init();
    a11yManager.createAccessibilityMenu();
});

// Export for use in other modules
window.a11yManager = a11yManager;
