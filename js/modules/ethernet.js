export default function initEthernet() {
    const hosts = document.querySelectorAll('.vlan-host');
    const selectedHostLabel = document.getElementById('selected-host-label');
    const vlanSelect = document.getElementById('vlan-assignment-select');
    const log = document.getElementById('vlan-sim-log');
    const instructions = document.getElementById('vlan-sim-instructions');
    let selectedHost = null;

    function updateHostVisuals() {
        hosts.forEach(h => {
            h.classList.remove('vlan10', 'vlan20');
            const vlan = h.dataset.vlan;
            if (vlan === '10') h.classList.add('vlan10');
            if (vlan === '20') h.classList.add('vlan20');
        });
    }

    function logMessage(message, type = 'info') {
        const entry = document.createElement('div');
        entry.textContent = `> ${message}`;
        if (type === 'success') entry.style.color = 'var(--accent-secondary)';
        if (type === 'error') entry.style.color = 'var(--accent-error)';
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    function handleHostClick(hostElement) {
        if (!selectedHost) {
            selectedHost = hostElement;
            selectedHost.classList.add('selected');
            selectedHostLabel.textContent = `Host ${selectedHost.textContent}`;
            vlanSelect.value = selectedHost.dataset.vlan;
            vlanSelect.disabled = false;
            instructions.textContent = `Now, click another host to ping it.`;
        } else if (selectedHost === hostElement) {
            selectedHost.classList.remove('selected');
            selectedHost = null;
            selectedHostLabel.textContent = 'None';
            vlanSelect.disabled = true;
            instructions.textContent = `Click a host to select it as the ping source.`;
        } else {
            const source = selectedHost;
            const target = hostElement;
            logMessage(`Pinging Host ${target.textContent} from Host ${source.textContent}...`);

            if (source.dataset.vlan === target.dataset.vlan) {
                logMessage(`Ping successful! Both hosts are in VLAN ${source.dataset.vlan}.`, 'success');
            } else {
                logMessage(`Ping failed. Host ${source.textContent} (VLAN ${source.dataset.vlan}) cannot reach Host ${target.textContent} (VLAN ${target.dataset.vlan}).`, 'error');
            }
            
            source.classList.remove('selected');
            selectedHost = null;
            selectedHostLabel.textContent = 'None';
            vlanSelect.disabled = true;
            instructions.textContent = `Click a host to select it as the ping source.`;
        }
    }
    
    hosts.forEach(host => host.addEventListener('click', () => handleHostClick(host)));

    vlanSelect.addEventListener('change', () => {
        if (selectedHost) {
            const oldVlan = selectedHost.dataset.vlan;
            const newVlan = vlanSelect.value;
            selectedHost.dataset.vlan = newVlan;
            updateHostVisuals();
            logMessage(`Host ${selectedHost.textContent} moved from VLAN ${oldVlan} to VLAN ${newVlan}.`);
        }
    });

    updateHostVisuals();
    logMessage('VLAN Simulator Initialized. Click a host to select it.');
}