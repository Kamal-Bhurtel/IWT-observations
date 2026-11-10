// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const bodyElement = document.body;

const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'light-theme' || storedTheme === 'dark-theme') {
    bodyElement.className = storedTheme;
    updateThemeIcon(storedTheme);
}

themeToggleBtn.addEventListener('click', () => {
    const isDark = bodyElement.classList.contains('dark-theme');
    const next = isDark ? 'light-theme' : 'dark-theme';
    bodyElement.classList.replace(isDark ? 'dark-theme' : 'light-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
});

function updateThemeIcon(theme) {
    if (theme === 'light-theme') {
        themeIcon.className = 'fa-solid fa-moon';
    } else {
        themeIcon.className = 'fa-solid fa-sun';
    }
}

// Skill category filters
const filterButtons = document.querySelectorAll('.filter-btn');
const skillTags = document.querySelectorAll('.skill-tag');

filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        skillTags.forEach((tag) => {
            const category = tag.getAttribute('data-category');
            const show = filter === 'all' || category === filter;
            tag.classList.toggle('hidden', !show);
        });
    });
});

// Side navigation — mobile toggle
const sideNav = document.getElementById('side-nav');
const navToggle = document.getElementById('nav-toggle');
const navToggleIcon = document.getElementById('nav-toggle-icon');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    const isOpen = sideNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    navToggleIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});

// Close mobile nav after clicking a link
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (sideNav.classList.contains('open')) {
            sideNav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open navigation');
            navToggleIcon.className = 'fa-solid fa-bars';
        }
    });
});

// Active section highlighting on scroll
const sections = document.querySelectorAll('#profile, #connect, #education, #lab-work, #skills');

function updateActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight * 0.3;

    let currentId = 'profile';
    sections.forEach((section) => {
        if (section.offsetTop <= scrollPos) {
            currentId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const isActive = link.getAttribute('data-section') === currentId;
        link.classList.toggle('active', isActive);
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
window.addEventListener('load', updateActiveNav);

// Card entrance animation (respect reduced motion)
document.addEventListener('DOMContentLoaded', () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cards = document.querySelectorAll('.bento-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';

        requestAnimationFrame(() => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 70);
        });
    });
});
