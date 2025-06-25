export default function initRouting() {
    const visualizerDiv = document.getElementById('routing-visualizer');
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');
    const protocolSelect = document.getElementById('protocol-select');

    let routerState = { protocol: 'ospf' };
    
    const routingTables = {
        ospf: `Codes: O - OSPF, C - Connected
Gateway of last resort is not set

      192.168.12.0/24 is directly connected, Serial0/0
C     192.168.13.0/24 is directly connected, Serial0/1
O     10.10.20.0/24 [110/20] via 192.168.12.2, 00:00:05, S0/0
O     10.10.30.0/24 [110/11] via 192.168.13.3, 00:00:09, S0/1`,
        static: `Codes: S - Static, C - Connected
Gateway of last resort is 192.168.12.2 to network 0.0.0.0

C     192.168.12.0/24 is directly connected, Serial0/0
C     192.168.13.0/24 is directly connected, Serial0/1
S     10.10.20.0/24 [1/0] via 192.168.12.2
S* 0.0.0.0/0 [1/0] via 192.168.12.2`
    };

    const paths = {
        ospf: ['e-pc-r1', 'e-r1-r3', 'e-r3-r4', 'e-r4-server'],
        static: ['e-pc-r1', 'e-r1-r2', 'e-r2-r4', 'e-r4-server']
    };

    const cy = cytoscape({
        container: visualizerDiv,
        elements: [
            { data: { id: 'pc', label: 'PC-A\n192.168.1.10' } }, { data: { id: 'r1', label: 'R1' } },
            { data: { id: 'r2', label: 'R2' } }, { data: { id: 'r3', label: 'R3' } },
            { data: { id: 'r4', label: 'R4' } }, { data: { id: 'server', label: 'Server\n10.10.30.5' } },
            { data: { id: 'e-pc-r1', source: 'pc', target: 'r1' } },
            { data: { id: 'e-r1-r2', source: 'r1', target: 'r2', label: 'Cost: 10' } },
            { data: { id: 'e-r1-r3', source: 'r1', target: 'r3', label: 'Cost: 5' } },
            { data: { id: 'e-r2-r4', source: 'r2', target: 'r4', label: 'Cost: 5' } },
            { data: { id: 'e-r3-r4', source: 'r3', target: 'r4', label: 'Cost: 5' } },
            { data: { id: 'e-r4-server', source: 'r4', target: 'server' } },
        ],
        style: [
            { selector: 'node', style: { 'label': 'data(label)', 'background-color': 'var(--bg-tertiary)', 'border-color': 'var(--accent-primary)', 'color': 'var(--text-primary)', 'border-width': 2, 'text-valign': 'center', 'text-wrap': 'wrap' } },
            { selector: 'edge', style: { 'label': 'data(label)', 'width': 3, 'line-color': 'var(--border-color)', 'color': 'var(--text-secondary)', 'font-size': '12px', 'curve-style': 'bezier' } },
            { selector: '.animated-path', style: { 'line-color': 'var(--accent-secondary)', 'target-arrow-color': 'var(--accent-secondary)', 'transition-property': 'line-color, target-arrow-color', 'transition-duration': '0.5s' } }
        ],
        layout: { name: 'breadthfirst', directed: true, padding: 10 }
    });

    function logToCli(text, isCommand = false) {
        if (isCommand) {
            cliOutput.innerHTML += `<div><span class="cli-prompt">R1# </span>${text}</div>`;
        } else {
            cliOutput.innerHTML += `<div>${text.replace(/\n/g, '<br>')}</div>`;
        }
        cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    function handleCliCommand(command) {
        logToCli(command, true);
        const parts = command.trim().toLowerCase().split(' ');
        const baseCmd = parts[0];

        switch (baseCmd) {
            case 'help':
                logToCli(`Available commands:\n  - show ip route   : Displays the current routing table.\n  - ping <ip>       : Simulates sending a packet (e.g., ping 10.10.30.5).\n  - clear           : Clears the CLI screen.`);
                break;
            case 'show':
                if (parts[1] === 'ip' && parts[2] === 'route') {
                    logToCli(routingTables[routerState.protocol]);
                } else {
                    logToCli(`% Incomplete command.`);
                }
                break;
            case 'ping':
                const path = paths[routerState.protocol];
                logToCli(`Pinging... path determined by ${routerState.protocol.toUpperCase()}.`);
                animatePath(path);
                break;
            case 'clear':
                cliOutput.innerHTML = '';
                break;
            default:
                if (command.trim() !== '') logToCli(`% Unknown command: "${command}"`);
                break;
        }
    }
    
    function animatePath(pathEdges) {
        let i = 0;
        cy.edges().removeClass('animated-path');
        
        function highlightNext() {
            if (i < pathEdges.length) {
                cy.getElementById(pathEdges[i]).addClass('animated-path');
                i++;
                setTimeout(highlightNext, 600);
            } else {
                setTimeout(() => cy.edges().removeClass('animated-path'), 2000);
            }
        }
        highlightNext();
    }
    
    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = cliInput.value;
            cliInput.value = '';
            handleCliCommand(command);
        }
    });

    protocolSelect.addEventListener('change', (e) => {
        routerState.protocol = e.target.value;
        logToCli(`--- Simulating routing protocol changed to ${routerState.protocol.toUpperCase()} ---`);
    });
}