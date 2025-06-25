export default function initSecurity() {
    const aclForm = document.getElementById('acl-rules-form');
    const aclList = document.getElementById('acl-rules-list');
    const packetForm = document.getElementById('packet-test-form');
    const animationPanel = document.getElementById('packet-animation-panel');
    const aclLog = document.getElementById('acl-log');
    const aiButtonContainer = document.getElementById('acl-ai-button-container');
    const explainAclBtn = document.getElementById('explain-acl-btn');
    const aiExplanationContainer = document.getElementById('acl-ai-explanation');
    const aiContentDiv = document.getElementById('acl-ai-content');

    let rules = [];
    let lastAddedRule = null;

    function renderRules() {
        aclList.innerHTML = '';
        rules.forEach((rule, index) => {
            const li = document.createElement('li');
            li.className = rule.action === 'permit' ? 'acl-permit' : 'acl-deny';
            
            const text = document.createElement('span');
            text.textContent = `${index + 1}: ${rule.action.toUpperCase()} source ${rule.ip}`;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.ariaLabel = `Remove rule ${index + 1}`;
            removeBtn.style.cssText = 'background:transparent; color:var(--text-primary); border:none; padding: 0 0.5rem; cursor:pointer;';
            removeBtn.onclick = () => { rules.splice(index, 1); renderRules(); };

            li.appendChild(text);
            li.appendChild(removeBtn);
            aclList.appendChild(li);
        });
        
        const implicitDeny = document.createElement('li');
        implicitDeny.textContent = `${rules.length + 1}: DENY source any (Implicit)`;
        implicitDeny.style.cssText = 'opacity:0.5; border:1px dashed var(--border-color); padding:0.5rem 1rem; background:transparent;';
        aclList.appendChild(implicitDeny);
    }

    function testPacket(sourceIp) {
        let finalAction = 'deny';
        let matchedRuleIndex = -1;

        for (let i = 0; i < rules.length; i++) {
            if (rules[i].ip.toLowerCase() === 'any' || rules[i].ip === sourceIp) {
                finalAction = rules[i].action;
                matchedRuleIndex = i + 1;
                break;
            }
        }

        if (matchedRuleIndex !== -1) {
            aclLog.textContent = `Packet from ${sourceIp} matched rule #${matchedRuleIndex}. Action: ${finalAction.toUpperCase()}`;
        } else {
            aclLog.textContent = `Packet from ${sourceIp} matched implicit deny. Action: DENY`;
        }
        aclLog.style.color = (finalAction === 'permit') ? 'var(--accent-secondary)' : 'var(--accent-error)';

        const packet = document.createElement('div');
        packet.className = 'packet-sim';
        if (finalAction === 'deny') packet.classList.add('denied');
        animationPanel.appendChild(packet);
        packet.addEventListener('animationend', () => packet.remove());
    }

    aclForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const action = aclForm.querySelector('#acl-action').value;
        const ipInput = aclForm.querySelector('#acl-ip');
        if (ipInput.value.trim()) {
            lastAddedRule = { action, ip: ipInput.value.trim() };
            rules.push(lastAddedRule);
            renderRules();
            ipInput.value = '';
            aiButtonContainer.style.display = 'block';
            aiExplanationContainer.style.display = 'none';
        }
    });

    packetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const sourceIpInput = packetForm.querySelector('#packet-source-ip');
        if (sourceIpInput.value.trim()) testPacket(sourceIpInput.value.trim());
    });

    explainAclBtn.addEventListener('click', async () => {
        if (!lastAddedRule) return;
        aiExplanationContainer.style.display = 'block';
        aiContentDiv.innerHTML = '<div class="spinner"></div>';
        
        const prompt = `You are a senior network security analyst. A junior admin created the ACL rule: "access-list 101 ${lastAddedRule.action} ip host ${lastAddedRule.ip} any". Explain: 1. What this rule does. 2. A real-world scenario for using it. 3. Why ACL order is important relative to this rule.`;
        
        const explanation = await askGemini(prompt);
        aiContentDiv.innerHTML = explanation;
    });

    renderRules();
}