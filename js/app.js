/**
 * app.js
 * Core application logic for navigation, state management, and module loading orchestration.
 */
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const sideMenu = document.getElementById('side-menu');
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const welcomeMessageHTML = mainContent.innerHTML;

    const AppState = { isMenuOpen: false, currentModule: null, };

    const toggleMenu = () => {
        AppState.isMenuOpen = !AppState.isMenuOpen;
        sideMenu.classList.toggle('open', AppState.isMenuOpen);
        menuToggle.setAttribute('aria-expanded', AppState.isMenuOpen);
        if (AppState.isMenuOpen) { menuClose.focus(); } else { menuToggle.focus(); }
    };

    const loadContent = async (moduleName) => {
        if (!moduleName) return;
        if (window.innerWidth < 1024 && AppState.isMenuOpen) { toggleMenu(); }

        mainContent.innerHTML = `<p>Loading ${moduleName} chapter...</p>`;
        AppState.currentModule = moduleName;

        try {
            const { html, init } = await window.moduleLoader.load(moduleName);
            mainContent.innerHTML = html;
            updateActiveLink(moduleName);
            
            setChatbotContext(moduleName);

            if (init && typeof init === 'function') { init(); }
            
            history.pushState({ module: moduleName }, `${moduleName} Chapter`, `#${moduleName}`);
            document.title = `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} | Networking Tutor`;
        } catch (error) {
            console.error('Error loading module:', error);
            mainContent.innerHTML = `<p class="error">Failed to load content for "${moduleName}". Please check the console and ensure a local server is running.</p>`;
        }
    };

    const updateActiveLink = (moduleName) => {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.module === moduleName);
        });
    };
    
    const handleRouteChange = () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            loadContent(hash);
        } else {
            mainContent.innerHTML = welcomeMessageHTML;
            updateActiveLink(null);
            document.title = 'Interactive Networking Tutor';
            setChatbotContext("General");
        }
    };

    menuToggle.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', toggleMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const moduleName = link.dataset.module;
            if (moduleName !== AppState.currentModule) { loadContent(moduleName); }
        });
    });

    window.addEventListener('popstate', (e) => {
        const module = e.state ? e.state.module : window.location.hash.substring(1);
        if (module) {
            loadContent(module);
        } else {
             mainContent.innerHTML = welcomeMessageHTML;
             updateActiveLink(null);
             setChatbotContext("General");
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.isMenuOpen) { toggleMenu(); }
    });

    handleRouteChange();
    initAIChatbot();
});