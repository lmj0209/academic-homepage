/**
 * Main JavaScript - Rendering logic for academic homepage
 */

// Make init function global for editor to call
let isInitialized = false;

// Render profile sidebar
function renderProfile() {
    const profile = siteData.profile;
    const container = document.getElementById('profile-container');

    const socialLinksHTML = Object.entries(profile.social)
        .filter(([_, url]) => url && url !== 'https://github.com/yourusername')
        .map(([platform, url]) => {
            const icons = {
                github: '<i class="fab fa-github"></i>',
                googleScholar: '<i class="fas fa-graduation-cap"></i>',
                linkedin: '<i class="fab fa-linkedin-in"></i>',
                twitter: '<i class="fab fa-twitter"></i>',
                orcid: '<i class="fab fa-orcid"></i>'
            };
            return `<a href="${url}" class="social-link" target="_blank" rel="noopener noreferrer">
                ${icons[platform] || ''}
            </a>`;
        }).join('');

    container.innerHTML = `
        <div class="profile-card">
            <img src="${profile.avatar}" alt="${profile.name.en}" class="profile-avatar">
            <h2 class="profile-name">${profile.name.en}</h2>
            <p class="profile-title">${profile.title}</p>
            <p class="profile-institution">
                <a href="${profile.institution.url}" target="_blank">${profile.institution.name}</a>
            </p>
            <p class="profile-quote">"${profile.quote}"</p>
            <div class="profile-info">
                <div class="profile-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${profile.location}</span>
                </div>
                <div class="profile-info-item">
                    <i class="fas fa-envelope"></i>
                    <a href="mailto:${profile.email}">${profile.email}</a>
                </div>
            </div>
            <div class="profile-social">
                ${socialLinksHTML}
            </div>
        </div>
    `;
}

// Render About section
function renderAbout() {
    const about = siteData.about;
    const container = document.getElementById('about-container');

    const descriptionHTML = about.description
        .map(p => `<p>${p}</p>`)
        .join('');

    const interestsHTML = about.researchInterests
        .map(interest => `<span class="interest-tag">${interest}</span>`)
        .join('');

    container.innerHTML = `
        <div class="about-content">
            ${descriptionHTML}
        </div>
        <div class="research-interests">
            <h4>Research Interests</h4>
            <div class="interest-tags">
                ${interestsHTML}
            </div>
        </div>
    `;
}

// Render News section with scrollable container
function renderNews() {
    const news = siteData.news;
    const container = document.getElementById('news-container');

    const newsItemsHTML = news
        .map(item => `
            <div class="news-item">
                <div class="news-icon">${item.icon}</div>
                <div class="news-content">
                    <div class="news-date">${item.date}</div>
                    <div class="news-text">${item.content}</div>
                </div>
            </div>
        `)
        .join('');

    container.innerHTML = `
        <div class="news-container">
            ${newsItemsHTML}
        </div>
    `;
}

// Helper function to highlight author name
function highlightAuthorName(authors, myName) {
    if (!myName || myName === 'Your Name') {
        return authors;
    }
    const regex = new RegExp(`(${myName})`, 'gi');
    return authors.replace(regex, '<span class="my-name">$1</span>');
}

// Helper function to render badges
function renderBadges(badges) {
    if (!badges || badges.length === 0) return '';

    return badges.map(badge => {
        const badgeLabels = {
            'ccf-a': 'CCF-A',
            'ccf-b': 'CCF-B',
            'ccf-c': 'CCF-C',
            'oral': 'Oral',
            'poster': 'Poster',
            'best-paper': 'Best Paper'
        };
        return `<span class="badge ${badge}">${badgeLabels[badge] || badge}</span>`;
    }).join(' ');
}

// Render Publications section
function renderPublications() {
    const pubs = siteData.publications;
    const container = document.getElementById('publications-container');

    const pubsHTML = pubs.items
        .map(pub => {
            const authorsHTML = highlightAuthorName(pub.authors, pubs.myName);
            const badgesHTML = renderBadges(pub.badges);
            const linksHTML = pub.links
                .map(link => `<a href="${link.url}" class="pub-link" target="_blank">${link.label}</a>`)
                .join('');

            return `
                <div class="publication-item">
                    <div class="pub-title">
                        <a href="${pub.links[0]?.url || '#'}" target="_blank">${pub.title}</a>
                    </div>
                    <div class="pub-authors">${authorsHTML}</div>
                    <div class="pub-venue">${pub.venue}</div>
                    ${badgesHTML ? `<div class="pub-badges">${badgesHTML}</div>` : ''}
                    <div class="pub-links">
                        ${linksHTML}
                    </div>
                </div>
            `;
        })
        .join('');

    container.innerHTML = `<div class="publication-list">${pubsHTML}</div>`;
}

// Render Awards section
function renderAwards() {
    const awards = siteData.awards;
    const container = document.getElementById('awards-container');

    const awardsHTML = awards
        .map(award => `
            <li class="award-item">
                <div class="award-date">${award.date}</div>
                <div class="award-content">
                    <div class="award-name">${award.name}</div>
                    <div class="award-institution">${award.institution}</div>
                </div>
            </li>
        `)
        .join('');

    container.innerHTML = `<ul class="awards-list">${awardsHTML}</ul>`;
}

// Render Experience section
function renderExperience() {
    const experience = siteData.experience;
    const container = document.getElementById('experience-container');

    const expHTML = experience
        .map(exp => `
            <div class="experience-item">
                <div class="exp-date">${exp.date}</div>
                <div class="exp-title">${exp.title}</div>
                <div class="exp-institution">${exp.institution}</div>
                ${exp.supervisor ? `<div class="exp-supervisor">${exp.supervisor}</div>` : ''}
            </div>
        `)
        .join('');

    container.innerHTML = `<div class="experience-timeline">${expHTML}</div>`;
}

// Render Services section
function renderServices() {
    const services = siteData.services;
    const container = document.getElementById('services-container');

    const reviewerHTML = services.reviewer
        .map(item => `<span class="service-item">${item}</span>`)
        .join('');

    const pcMemberHTML = services.pcMember
        .map(item => `<span class="service-item">${item}</span>`)
        .join('');

    container.innerHTML = `
        <div class="services-list">
            <div class="service-category">
                <h4>Reviewer</h4>
                <div class="service-items">
                    ${reviewerHTML}
                </div>
            </div>
            ${services.pcMember.length > 0 ? `
                <div class="service-category">
                    <h4>PC Member</h4>
                    <div class="service-items">
                        ${pcMemberHTML}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Mobile menu toggle
function setupMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
        }
    });
}

// Highlight active nav item based on scroll position
function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// Initialize the page
function init() {
    renderProfile();
    renderAbout();
    renderNews();
    renderPublications();
    renderAwards();
    renderExperience();
    renderServices();
    setupMobileMenu();
    setupScrollSpy();
    isInitialized = true;
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);
