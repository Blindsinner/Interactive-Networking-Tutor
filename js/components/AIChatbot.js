/**
 * AIChatbot.js
 * Manages the functionality of the global AI Tutor chatbot.
 */

const chatbotState = {
    isOpen: false,
    context: "General Networking",
};

function initAIChatbot() {
    const fab = document.getElementById('ai-tutor-fab');
    const overlay = document.getElementById('ai-tutor-overlay');
    const closeBtn = document.getElementById('ai-tutor-close-btn');
    const form = document.getElementById('ai-tutor-form');
    const input = document.getElementById('ai-tutor-input');
    const messagesContainer = document.getElementById('ai-tutor-messages');

    const toggleChatbot = (show) => {
        chatbotState.isOpen = show;
        overlay.classList.toggle('hidden', !show);
        if (show) {
            input.focus();
            if (messagesContainer.children.length === 0) {
                 addMessage("Hello! I'm your AI networking tutor. Ask me anything about the current topic or networking in general.", 'ai');
            }
        }
    };

    fab.addEventListener('click', () => toggleChatbot(true));
    closeBtn.addEventListener('click', () => toggleChatbot(false));
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            toggleChatbot(false);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userInput = input.value.trim();
        if (!userInput) return;

        addMessage(userInput, 'user');
        input.value = '';
        showTypingIndicator();

        const contextualPrompt = `
            You are a helpful and friendly networking tutor. The user is currently studying a chapter on "${chatbotState.context}".
            Based on this context, please answer the following question. If the question seems unrelated, answer it anyway but try to link it back to the current topic if a reasonable connection can be made. Keep your answers concise and easy for a beginner to understand. Use markdown for formatting like bolding, lists, or code snippets.
            
            User's question: "${userInput}"
        `;

        const aiResponse = await askGemini(contextualPrompt);
        removeTypingIndicator();
        addMessage(aiResponse, 'ai');
    });

    function addMessage(text, type) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${type}`;
        // Basic markdown-like replacement for simplicity
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/`(.*?)`/g, '<code>$1</code>');
        bubble.innerHTML = text;
        messagesContainer.appendChild(bubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = messagesContainer.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
    }
}

function setChatbotContext(moduleName) {
    if (moduleName) {
        chatbotState.context = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    } else {
        chatbotState.context = "General Networking";
    }
    console.log(`AI Tutor context set to: ${chatbotState.context}`);
}