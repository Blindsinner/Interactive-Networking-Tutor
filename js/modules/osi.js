export default function initOsi() {
    document.querySelectorAll('.layer[data-tooltip]').forEach(layer => {
        const tooltipText = layer.dataset.tooltip;
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        layer.appendChild(tooltip);
    });

    const draggables = document.querySelectorAll('.draggable-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const feedbackEl = document.getElementById('quiz1-feedback');
    let draggedItem = null;

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggedItem = e.target;
            e.dataTransfer.setData('text/plain', e.target.dataset.pdu);
            setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
        });
        draggable.addEventListener('dragend', () => {
            if (draggedItem) { draggedItem.style.opacity = '1'; }
            draggedItem = null;
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('over'); });
        zone.addEventListener('dragleave', () => { zone.classList.remove('over'); });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('over');
            if (zone.classList.contains('correct')) return;

            const droppedPDU = e.dataTransfer.getData('text/plain');
            const targetPDU = zone.dataset.target;

            if (droppedPDU === targetPDU) {
                zone.textContent = droppedPDU;
                zone.classList.add('correct');
                if (draggedItem) draggedItem.style.display = 'none';
                updateScore('osiQuiz', 1);
                checkCompletion();
            } else {
                feedbackEl.textContent = `Not quite. A ${droppedPDU} is used at a different layer.`;
                feedbackEl.className = 'quiz-feedback error';
            }
        });
    });
    
    function checkCompletion() {
        const allCorrect = Array.from(dropZones).every(z => z.classList.contains('correct'));
        if (allCorrect) {
            feedbackEl.textContent = 'Excellent! You matched all the PDUs correctly.';
            feedbackEl.className = 'quiz-feedback success';
        }
    }

    function updateScore(quizId, points) {
        try {
            let scores = JSON.parse(localStorage.getItem('networkingTutorScores')) || {};
            if(!scores[quizId]){
                 scores[quizId] = (scores[quizId] || 0) + points;
                 localStorage.setItem('networkingTutorScores', JSON.stringify(scores));
            }
        } catch (e) {
            console.error("Could not access localStorage. Progress will not be saved.", e);
        }
    }
}