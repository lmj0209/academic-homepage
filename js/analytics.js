/**
 * Visitor Analytics - Track visitors and display statistics
 */

class Analytics {
    constructor() {
        this.storageKey = 'siteAnalytics';
        this.stats = {
            pageViews: 0,
            uniqueVisitors: new Set(),
            lastVisit: null,
            dailyStats: {},
            referrers: {}
        };
    }

    /**
     * Initialize analytics
     */
    init() {
        this.loadStats();
        this.trackVisit();
        this.initLocalStats();
        this.setupReferrerTracking();

        // Update display if stats element exists
        this.updateDisplay();
    }

    /**
     * Load stats from localStorage
     */
    loadStats() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Convert uniqueVisitors back to Set
                this.stats = {
                    ...parsed,
                    uniqueVisitors: new Set(parsed.uniqueVisitors || []),
                    dailyStats: parsed.dailyStats || {},
                    referrers: parsed.referrers || {}
                };
            }
        } catch (e) {
            console.error('Failed to load analytics:', e);
        }
    }

    /**
     * Save stats to localStorage
     */
    saveStats() {
        try {
            const toSave = {
                ...this.stats,
                uniqueVisitors: Array.from(this.stats.uniqueVisitors),
                dailyStats: this.stats.dailyStats,
                referrers: this.stats.referrers
            };
            localStorage.setItem(this.storageKey, JSON.stringify(toSave));
        } catch (e) {
            console.error('Failed to save analytics:', e);
        }
    }

    /**
     * Track current visit
     */
    trackVisit() {
        this.stats.pageViews++;

        // Track unique visitor
        const visitorId = this.getVisitorId();
        if (!this.stats.uniqueVisitors.has(visitorId)) {
            this.stats.uniqueVisitors.add(visitorId);
        }

        this.stats.lastVisit = new Date().toISOString();

        // Track daily stats
        const today = new Date().toISOString().split('T')[0];
        if (!this.stats.dailyStats[today]) {
            this.stats.dailyStats[today] = { views: 0, visitors: new Set() };
        }
        this.stats.dailyStats[today].views++;

        this.saveStats();
    }

    /**
     * Get unique visitor ID
     */
    getVisitorId() {
        let id = localStorage.getItem('visitorId');
        if (!id) {
            id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('visitorId', id);
        }
        return id;
    }

    /**
     * Setup referrer tracking
     */
    setupReferrerTracking() {
        const referrer = document.referrer;
        if (referrer && referrer !== window.location.href) {
            const hostname = new URL(referrer).hostname;
            this.stats.referrers[hostname] = (this.stats.referrers[hostname] || 0) + 1;
            this.saveStats();
        }
    }

    /**
     * Initialize local stats display
     */
    initLocalStats() {
        // Add stats section to footer
        const footer = this.createStatsFooter();
        document.body.appendChild(footer);
    }

    /**
     * Create stats footer
     */
    createStatsFooter() {
        const footer = document.createElement('div');
        footer.className = 'stats-footer';
        footer.innerHTML = `
            <div class="stats-container">
                <div class="stat-item">
                    <i class="fas fa-eye"></i>
                    <span class="stat-value" id="stat-views">0</span>
                    <span class="stat-label">Page Views</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-users"></i>
                    <span class="stat-value" id="stat-visitors">0</span>
                    <span class="stat-label">Visitors</span>
                </div>
                <button class="stats-toggle" id="stats-toggle" title="Toggle Details">
                    <i class="fas fa-chart-bar"></i>
                </button>
            </div>
            <div class="stats-details" id="stats-details" style="display: none;">
                <div class="stats-details-content">
                    <h4>Analytics Details</h4>
                    <div class="stats-row">
                        <span>Last Visit:</span>
                        <span id="stat-last-visit">-</span>
                    </div>
                    <div class="stats-row">
                        <span>Today's Views:</span>
                        <span id="stat-today-views">0</span>
                    </div>
                    <h4>Top Referrers</h4>
                    <div class="referrers-list" id="referrers-list">
                        <span class="no-data">No referrer data yet</span>
                    </div>
                    <button class="clear-stats-btn" id="clear-stats-btn">
                        <i class="fas fa-trash"></i> Clear Local Data
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const toggleBtn = footer.querySelector('#stats-toggle');
        const details = footer.querySelector('#stats-details');
        const clearBtn = footer.querySelector('#clear-stats-btn');

        toggleBtn.addEventListener('click', () => {
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        });

        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all local analytics data?')) {
                localStorage.removeItem(this.storageKey);
                localStorage.removeItem('visitorId');
                this.stats = {
                    pageViews: 0,
                    uniqueVisitors: new Set(),
                    lastVisit: null,
                    dailyStats: {},
                    referrers: {}
                };
                this.updateDisplay();
                showNotification('Analytics data cleared');
            }
        });

        return footer;
    }

    /**
     * Update stats display
     */
    updateDisplay() {
        // Update main stats
        const viewsEl = document.getElementById('stat-views');
        const visitorsEl = document.getElementById('stat-visitors');
        const lastVisitEl = document.getElementById('stat-last-visit');
        const todayViewsEl = document.getElementById('stat-today-views');
        const referrersList = document.getElementById('referrers-list');

        if (viewsEl) {
            viewsEl.textContent = this.stats.pageViews.toLocaleString();
        }

        if (visitorsEl) {
            visitorsEl.textContent = this.stats.uniqueVisitors.size.toLocaleString();
        }

        if (lastVisitEl && this.stats.lastVisit) {
            lastVisitEl.textContent = new Date(this.stats.lastVisit).toLocaleString();
        }

        // Today's views
        const today = new Date().toISOString().split('T')[0];
        if (todayViewsEl && this.stats.dailyStats[today]) {
            todayViewsEl.textContent = this.stats.dailyStats[today].views.toLocaleString();
        }

        // Referrers
        if (referrersList) {
            const sortedReferrers = Object.entries(this.stats.referrers)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            if (sortedReferrers.length > 0) {
                referrersList.innerHTML = sortedReferrers.map(([referrer, count]) => `
                    <div class="referrer-item">
                        <span class="referrer-name">${referrer}</span>
                        <span class="referrer-count">${count}</span>
                    </div>
                `).join('');
            } else {
                referrersList.innerHTML = '<span class="no-data">No referrer data yet</span>';
            }
        }
    }

    /**
     * Get statistics summary
     */
    getSummary() {
        return {
            totalViews: this.stats.pageViews,
            uniqueVisitors: this.stats.uniqueVisitors.size,
            lastVisit: this.stats.lastVisit,
            dailyStats: this.stats.dailyStats,
            referrers: this.stats.referrers
        };
    }

    /**
     * Export analytics data
     */
    exportData() {
        const data = {
            exportDate: new Date().toISOString(),
            summary: this.getSummary(),
            rawData: {
                pageViews: this.stats.pageViews,
                uniqueVisitors: Array.from(this.stats.uniqueVisitors),
                dailyStats: this.stats.dailyStats,
                referrers: this.stats.referrers
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Analytics data exported');
    }
}

// Global instance
const analytics = new Analytics();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    analytics.init();
});

// Export for use in other modules
window.analytics = analytics;
