document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Function to add message to chat
    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');

        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('bubble');
        bubbleDiv.textContent = text;

        messageDiv.appendChild(bubbleDiv);
        chatBox.appendChild(messageDiv);

        // Auto-scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to handle sending message
    async function sendMessage() {
        const text = userInput.value.trim();
        if (text === "") return;

        // 1. Show user message
        appendMessage(text, 'user');

        // 2. Clear input
        userInput.value = '';

        // 3. Send to Backend
        try {
            // Mostra indicador de carregamento (opcional, mas boa prática)
            // Por enquanto, apenas o usuário espera

            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();

            if (response.ok) {
                appendMessage(data.response, 'bot');
            } else {
                appendMessage("Erro: " + (data.response || "Falha na comunicação com o servidor."), 'bot');
            }

        } catch (error) {
            console.error('Erro:', error);
            appendMessage("Desculpe, não consegui conectar ao servidor.", 'bot');
        }
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    console.log("Sistema Frontend conectado ao Backend (/chat).");
});
