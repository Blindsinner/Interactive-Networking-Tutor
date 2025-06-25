export default function initZerotrust() {
    const mfaCheckbox = document.getElementById('zta-mfa');
    const deviceCheckbox = document.getElementById('zta-device');
    const locationCheckbox = document.getElementById('zta-location');
    const attemptBtn = document.getElementById('zta-attempt-btn');
    const verdictDiv = document.getElementById('zta-verdict');

    attemptBtn.addEventListener('click', () => {
        const isMfaAuthenticated = mfaCheckbox.checked;
        const isDeviceCompliant = deviceCheckbox.checked;
        const isFromUntrustedNetwork = locationCheckbox.checked;

        // A simple ZTA policy: Must have MFA and a compliant device.
        const accessGranted = isMfaAuthenticated && isDeviceCompliant;

        verdictDiv.innerHTML = '';
        verdictDiv.className = '';

        setTimeout(() => {
            if (accessGranted) {
                verdictDiv.textContent = 'ACCESS GRANTED';
                verdictDiv.classList.add('zta-granted');
                if (isFromUntrustedNetwork) {
                    verdictDiv.innerHTML += '<br><small>...via secure tunnel</small>';
                }
            } else {
                let reason = !isMfaAuthenticated ? 'MFA check failed' : 'Device is not compliant';
                verdictDiv.innerHTML = `ACCESS DENIED<br><small>Reason: ${reason}</small>`;
                verdictDiv.classList.add('zta-denied');
            }
        }, 100);
    });

    const style = document.createElement('style');
    style.textContent = `
        .zta-policy-simulator { display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; }
        #zta-policy-controls { display: flex; flex-direction: column; gap: 1rem; }
        .zta-control label { margin-left: 0.5rem; }
        #zta-visualizer { flex-grow: 1; display: flex; justify-content: space-around; align-items: center; background: var(--bg-primary); padding: 2rem; border-radius: 8px; min-height: 150px; }
        .zta-entity { font-weight: bold; padding: 1rem; border: 2px solid var(--border-color); border-radius: 8px; }
        #zta-verdict { font-weight: bold; font-family: var(--font-mono); text-align: center; transition: all 0.3s; }
        .zta-granted { color: var(--accent-secondary); }
        .zta-denied { color: var(--accent-error); }
    `;
    document.head.appendChild(style);
    
    // Cleanup the injected style when the module is unloaded (hypothetical, as this app doesn't have a formal unload mechanism)
    // This is good practice for more complex SPAs.
    const mainContent = document.getElementById('main-content');
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.removedNodes) {
                const ztaContent = document.getElementById('zerotrust-content');
                if (!document.body.contains(ztaContent)) {
                    style.remove();
                    observer.disconnect();
                    break;
                }
            }
        }
    });
    observer.observe(mainContent, { childList: true, subtree: true });
}