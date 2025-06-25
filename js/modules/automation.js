export default async function initAutomation() {
    const pyodideStatus = document.getElementById('pyodide-status');
    const pythonCode = document.getElementById('python-code');
    const runPythonBtn = document.getElementById('run-python-btn');
    const pyodideOutput = document.getElementById('pyodide-output');
    let pyodide = null;

    async function setupPyodide() {
        try {
            pyodide = await loadPyodide();
            pyodideStatus.textContent = 'Python runtime loaded successfully!';
            pyodideStatus.style.color = 'var(--accent-secondary)';
            runPythonBtn.disabled = false;
        } catch (error) {
            pyodideStatus.textContent = 'Error loading Python runtime.';
            pyodideStatus.style.color = 'var(--accent-error)';
            console.error('Pyodide loading error:', error);
        }
    }

    runPythonBtn.addEventListener('click', async () => {
        if (!pyodide) {
            pyodideOutput.textContent = 'Pyodide is not ready yet.';
            return;
        }
        try {
            const result = await pyodide.runPythonAsync(pythonCode.value);
            pyodideOutput.textContent = `Result: ${result}`;
        } catch (error) {
            pyodideOutput.textContent = `Python Error:\n${error}`;
        }
    });

    const jsonEditor = document.getElementById('json-editor');
    const applyPolicyBtn = document.getElementById('apply-policy-btn');
    const sdnTopologyDiv = document.getElementById('sdn-topology');
    
    const initialPolicy = { "action": "block-port", "target_switch": "s2", "target_port_edge_id": "e-s2-h2" };
    jsonEditor.value = JSON.stringify(initialPolicy, null, 2);

    const sdnCy = cytoscape({
        container: sdnTopologyDiv,
        elements: [
            { data: { id: 'h1', label: 'Host 1' } }, { data: { id: 'h2', label: 'Host 2' } },
            { data: { id: 's1', label: 'Switch 1' } }, { data: { id: 's2', label: 'Switch 2' } },
            { data: { id: 'e-h1-s1', source: 'h1', target: 's1' } },
            { data: { id: 'e-s1-s2', source: 's1', target: 's2' } },
            { data: { id: 'e-s2-h2', source: 's2', target: 'h2' } }
        ],
        style: [
            { selector: 'node', style: { 'label': 'data(label)', 'background-color': 'var(--bg-tertiary)', 'color': 'var(--text-primary)' } },
            { selector: 'edge', style: { 'width': 4, 'line-color': 'var(--accent-secondary)', 'transition-property': 'line-color', 'transition-duration': '0.5s' } },
            { selector: '.blocked', style: { 'line-color': 'var(--accent-error)' } }
        ],
        layout: { name: 'grid' }
    });

    applyPolicyBtn.addEventListener('click', () => {
        sdnCy.edges().removeClass('blocked');
        try {
            const policy = JSON.parse(jsonEditor.value);
            if (policy.action === 'block-port' && policy.target_port_edge_id) {
                const edge = sdnCy.getElementById(policy.target_port_edge_id);
                if (edge) edge.addClass('blocked');
            }
        } catch (error) {
            alert('Invalid JSON format!');
        }
    });

    setupPyodide();
}