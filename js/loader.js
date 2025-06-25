/**
 * loader.js
 * Handles the dynamic fetching and importing of HTML and JS modules.
 * Caches loaded modules to prevent redundant network requests.
 */
window.moduleLoader = (() => {
    const loadedModules = new Map();

    async function load(moduleName) {
        if (loadedModules.has(moduleName)) {
            return loadedModules.get(moduleName);
        }

        console.log(`Fetching module: ${moduleName}`);
        
        try {
            const [htmlResponse, jsModule] = await Promise.all([
                fetch(`modules/${moduleName}.html`),
                import(`./modules/${moduleName}.js`)
            ]);

            if (!htmlResponse.ok) {
                throw new Error(`HTML for ${moduleName} not found (status: ${htmlResponse.status}).`);
            }

            const html = await htmlResponse.text();
            const init = jsModule.default;
            const moduleData = { html, init };
            
            loadedModules.set(moduleName, moduleData);
            return moduleData;
        } catch (error) {
            console.error(`Failed to load module ${moduleName}:`, error);
            throw error;
        }
    }

    return {
        load
    };
})();