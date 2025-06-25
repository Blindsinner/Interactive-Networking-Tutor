export default function initSubnetting() {
    const ipInput = document.getElementById('ip-address-input');
    const cidrInput = document.getElementById('cidr-input');
    const outputPre = document.getElementById('subnet-output-pre');
    const aiButtonContainer = document.getElementById('ai-button-container');
    const explainSubnetBtn = document.getElementById('explain-subnet-btn');
    const aiExplanationContainer = document.getElementById('subnet-ai-explanation');
    const aiContentDiv = document.getElementById('subnet-ai-content');
    const quizForm = document.getElementById('subnet-quiz-form');
    const quizFeedback = document.getElementById('quiz2-feedback');

    function ipToLong(ip) { return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0; }
    function longToIp(long) { return [(long >>> 24), (long >> 16) & 255, (long >> 8) & 255, long & 255].join('.'); }

    function calculateAndDisplaySubnet() {
        const ipStr = ipInput.value;
        const cidr = parseInt(cidrInput.value, 10);

        if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ipStr) || isNaN(cidr) || cidr < 1 || cidr > 32) {
            outputPre.textContent = 'Please enter a valid IPv4 address and a CIDR prefix between 1 and 32.';
            aiButtonContainer.style.display = 'none';
            return;
        }

        const ipLong = ipToLong(ipStr);
        const maskLong = (0xFFFFFFFF << (32 - cidr)) >>> 0;
        const networkLong = (ipLong & maskLong) >>> 0;
        const broadcastLong = (networkLong | ~maskLong) >>> 0;
        const firstHostLong = (cidr < 31) ? networkLong + 1 : networkLong;
        const lastHostLong = (cidr < 31) ? broadcastLong - 1 : broadcastLong;
        const usableHosts = (cidr < 31) ? Math.pow(2, 32 - cidr) - 2 : (cidr === 31) ? 2 : 1;

        outputPre.innerHTML = `Address:      <span class="highlight">${ipStr}</span>
Netmask:      <span class="highlight">${longToIp(maskLong)}</span>
Wildcard:     <span class="highlight">${longToIp(~maskLong)}</span>
---------------------------------------------
Network:      <span class="highlight">${longToIp(networkLong)}/${cidr}</span>
Broadcast:    <span class="highlight">${longToIp(broadcastLong)}</span>
HostMin:      <span class="highlight">${longToIp(firstHostLong)}</span>
HostMax:      <span class="highlight">${longToIp(lastHostLong)}</span>
---------------------------------------------
Usable Hosts: <span class="highlight">${usableHosts.toLocaleString()}</span>`;
        
        aiButtonContainer.style.display = 'block';
        aiExplanationContainer.style.display = 'none';
    }

    explainSubnetBtn.addEventListener('click', async () => {
        const ip = ipInput.value;
        const cidr = cidrInput.value;
        const results = outputPre.textContent;

        aiExplanationContainer.style.display = 'block';
        aiContentDiv.innerHTML = '<div class="spinner"></div>';
        
        const prompt = `You are a friendly networking instructor. A student has these subnet calculation results:\n- IP Address: ${ip}\n- CIDR: /${cidr}\n- Results:\n${results}\n\nExplain these results simply. Cover: 1. How the Netmask is derived from /${cidr}. 2. How the Network Address is found using a bitwise AND. 3. How the Broadcast Address is found. 4. How the usable host range is determined. Format your response for a beginner.`;
        
        const explanation = await askGemini(prompt);
        aiContentDiv.innerHTML = explanation;
    });

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selected = quizForm.querySelector('input[name="q1"]:checked');
        if (!selected) {
            quizFeedback.textContent = 'Please select an answer.';
            quizFeedback.className = 'quiz-feedback error';
            return;
        }
        if (selected.value === '10.10.10.79') {
            quizFeedback.textContent = 'Correct! The /28 network containing .70 is the .64 network, which ends at .79 (the broadcast address).';
            quizFeedback.className = 'quiz-feedback success';
        } else {
            quizFeedback.textContent = 'Incorrect. Hint: A /28 mask creates subnets with 16 addresses each.';
            quizFeedback.className = 'quiz-feedback error';
        }
    });

    ipInput.addEventListener('input', calculateAndDisplaySubnet);
    cidrInput.addEventListener('input', calculateAndDisplaySubnet);
    calculateAndDisplaySubnet();
}