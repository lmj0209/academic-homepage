// Main JavaScript functionality

// Smooth scroll to sections
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize intersection observer for scroll animations
    initScrollAnimations();

    // Initialize active section highlighting
    initActiveSection();
});

// Navigation functionality
function initNavigation() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navbarLinks = document.querySelectorAll('.navbar-link');
        navbarLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar')) {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            }
        });
    }

    // Add shadow to navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// Smooth scroll functionality
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just #
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
}

// Add animation class
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Highlight active section in navigation
function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navbarLinks = document.querySelectorAll('.navbar-link[href^="#"]');

    function highlightSection() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navbarLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightSection);
    highlightSection(); // Initial call
}

// Utility function to copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text)
            .then(() => true)
            .catch(() => false);
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return Promise.resolve(true);
    } catch (err) {
        document.body.removeChild(textArea);
        return Promise.resolve(false);
    }
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttle to scroll events
const originalScroll = window.onscroll;
window.onscroll = throttle(function() {
    if (typeof originalScroll === 'function') {
        originalScroll();
    }
}, 100);

// Dynamic content loading (optional - used with data.js)
function loadDynamicContent(sectionId, data) {
    const section = document.getElementById(sectionId);
    if (!section || !data) return;

    const contentContainer = section.querySelector('.dynamic-content');
    if (!contentContainer) return;

    // Clear existing content
    contentContainer.innerHTML = '';

    // Load new content based on data
    data.forEach(item => {
        const element = createContentElement(item);
        contentContainer.appendChild(element);
    });
}

// Create content element from data object
function createContentElement(data) {
    const div = document.createElement('div');
    div.className = data.className || '';

    if (data.title) {
        const title = document.createElement(data.titleTag || 'h3');
        title.textContent = data.title;
        div.appendChild(title);
    }

    if (data.content) {
        const content = document.createElement(data.contentTag || 'p');
        content.innerHTML = data.content;
        div.appendChild(content);
    }

    if (data.links) {
        const linksContainer = document.createElement('div');
        linksContainer.className = 'content-links';

        data.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.text;
            a.className = link.className || '';
            if (link.target) a.target = link.target;
            linksContainer.appendChild(a);
        });

        div.appendChild(linksContainer);
    }

    return div;
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Check for dynamic data
        if (window.siteData) {
            Object.keys(window.siteData).forEach(sectionId => {
                loadDynamicContent(sectionId, window.siteData[sectionId]);
            });
        }
    });
} else {
    // DOM already loaded
    if (window.siteData) {
        Object.keys(window.siteData).forEach(sectionId => {
            loadDynamicContent(sectionId, window.siteData[sectionId]);
        });
    }
}
