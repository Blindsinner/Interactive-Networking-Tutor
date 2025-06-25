export default function initCloud() {
    const draggables = document.querySelectorAll('.vpc-draggable');
    const subnets = document.querySelectorAll('.vpc-subnet');
    const validateBtn = document.getElementById('validate-vpc-btn');
    const resetBtn = document.getElementById('reset-vpc-btn');
    const feedbackContainer = document.getElementById('vpc-ai-feedback');
    const feedbackContent = document.getElementById('vpc-ai-content');

    let draggedItem = null;

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggedItem = e.target;
            setTimeout(() => e.target.style.opacity = '0.5', 0);
        });
        draggable.addEventListener('dragend', () => {
            if (draggedItem) draggedItem.style.opacity = '1';
            draggedItem = null;
        });
    });

    subnets.forEach(subnet => {
        subnet.addEventListener('dragover', (e) => { e.preventDefault(); subnet.style.backgroundColor = 'var(--bg-tertiary)'; });
        subnet.addEventListener('dragleave', () => { subnet.style.backgroundColor = ''; });
        subnet.addEventListener('drop', (e) => {
            e.preventDefault();
            subnet.style.backgroundColor = '';
            if (draggedItem && (draggedItem.parentElement.id === 'vpc-palette' || draggedItem.parentElement.id === 'igw-slot')) {
                const clone = draggedItem.cloneNode(true);
                clone.style.opacity = '1';
                subnet.appendChild(clone);
            }
        });
    });

    resetBtn.addEventListener('click', () => {
        document.getElementById('public-subnet').innerHTML = '<div class="subnet-label">Public Subnet (Web Tier)</div>';
        document.getElementById('private-subnet').innerHTML = '<div class="subnet-label">Private Subnet (App/Data Tier)</div>';
        feedbackContainer.style.display = 'none';
    });

    validateBtn.addEventListener('click', async () => {
        feedbackContainer.style.display = 'block';
        feedbackContent.innerHTML = '<div class="spinner"></div>';

        const publicSubnet = document.getElementById('public-subnet');
        const privateSubnet = document.getElementById('private-subnet');

        const design = {
            public_subnet_components: Array.from(publicSubnet.children).map(el => el.dataset.type).filter(Boolean),
            private_subnet_components: Array.from(privateSubnet.children).map(el => el.dataset.type).filter(Boolean),
        };

        const prompt = `
            You are a cloud solutions architect reviewing a VPC design from a junior engineer. The design is as follows:
            - Public Subnet contains: ${design.public_subnet_components.join(', ') || 'nothing'}
            - Private Subnet contains: ${design.private_subnet_components.join(', ') || 'nothing'}
            - An Internet Gateway is present.

            Analyze this design based on best practices. Specifically check for these common mistakes:
            1. Is there a web server (EC2 Instance) in the public subnet to receive internet traffic?
            2. Is the database in the PRIVATE subnet to protect it from the internet? It should NOT be in the public subnet.
            3. If there is an EC2 instance in the private subnet, point out that it would need a NAT Gateway (not included in this simple lab) for outbound internet access.
            
            Provide your feedback in a constructive, easy-to-understand way. Start with an overall assessment (e.g., "Good start," "This design has security flaws") and then list your points as a bulleted list.
        `;

        const review = await askGemini(prompt);
        feedbackContent.innerHTML = review;
    });
}