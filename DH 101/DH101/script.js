const themeStorageKey = 'dh101-theme';
const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');

function getPreferredTheme() {
    const storedTheme = window.localStorage.getItem(themeStorageKey);

    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return themeQuery.matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
}

applyTheme(getPreferredTheme());

if (typeof themeQuery.addEventListener === 'function') {
    themeQuery.addEventListener('change', function(event) {
        if (!window.localStorage.getItem(themeStorageKey)) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    });
}

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    // Dropdown functionality for mobile
    const dropdowns = document.querySelectorAll('.dropdown');

    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !document.querySelector('.theme-toggle')) {
        const themeItem = document.createElement('li');
        themeItem.className = 'theme-toggle-item';

        const themeButton = document.createElement('button');
        themeButton.type = 'button';
        themeButton.className = 'theme-toggle';

        const syncThemeButton = function() {
            const currentTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            themeButton.textContent = nextTheme === 'dark' ? 'Dark mode' : 'Light mode';
            themeButton.setAttribute('aria-label', 'Switch to ' + nextTheme + ' mode');
            themeButton.setAttribute('aria-pressed', String(currentTheme === 'dark'));
        };

        themeButton.addEventListener('click', function() {
            const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            window.localStorage.setItem(themeStorageKey, nextTheme);
            applyTheme(nextTheme);
            syncThemeButton();
        });

        themeItem.appendChild(themeButton);
        navMenu.appendChild(themeItem);
        syncThemeButton();
    }
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
            // reflect expanded state for assistive tech
            const expanded = dropdown.classList.contains('active');
            try { toggle.setAttribute('aria-expanded', expanded); } catch (err) {}
        });

        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdown.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.blur();
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) { toggle.setAttribute('aria-expanded', 'false'); }
            });
        }
    });

    // Filter controls for makes catalog
    const filterButtons = document.querySelectorAll('.filter-btn');
    const catalogCards = document.querySelectorAll('.catalog-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedFilter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            catalogCards.forEach(card => {
                const cardKind = card.dataset.kind;
                const shouldShow = selectedFilter === 'all' || cardKind === selectedFilter;
                card.classList.toggle('is-hidden', !shouldShow);
            });
        });
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip placeholder links such as href="#" used by dropdown toggles.
        if (!href || href === '#') {
            return;
        }

        const target = document.querySelector(href);
        if (!target) {
            return;
        }

        e.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});
