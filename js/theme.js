/**
 * Theme Manager - Dark mode and theme switching
 */

class ThemeManager {
    constructor() {
        this.storageKey = 'site-theme';
        this.currentTheme = 'light';
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    }

    /**
     * Initialize theme
     */
    init() {
        // Load saved theme or use system preference
        const savedTheme = localStorage.getItem(this.storageKey);
        this.currentTheme = savedTheme || (this.prefersDark.matches ? 'dark' : 'light');

        // Apply theme
        this.applyTheme(this.currentTheme);

        // Listen for system preference changes
        this.prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem(this.storageKey)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });

        // Create theme toggle button
        this.createThemeToggle();
    }

    /**
     * Apply theme
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem(this.storageKey, theme);
        this.applyTheme(theme);
    }

    /**
     * Toggle theme
     */
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        showNotification(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode enabled`);
    }

    /**
     * Create theme toggle button
     */
    createThemeToggle() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.id = 'theme-toggle';
        toggleBtn.innerHTML = this.currentTheme === 'light'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
        toggleBtn.title = 'Toggle theme';
        toggleBtn.setAttribute('aria-label', 'Toggle dark/light mode');

        toggleBtn.addEventListener('click', () => {
            this.toggle();
            // Update icon
            toggleBtn.innerHTML = this.currentTheme === 'light'
                ? '<i class="fas fa-moon"></i>'
                : '<i class="fas fa-sun"></i>';
        });

        // Add to navigation
        const nav = document.querySelector('.nav-links');
        if (nav && !nav.querySelector('.theme-toggle')) {
            nav.appendChild(toggleBtn);
        }
    }
}

// Global instance
const themeManager = new ThemeManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    themeManager.init();
});

// Export for use in other modules
window.themeManager = themeManager;
