// ===== Загрузка и отображение состояний LED =====

const DATA_URL = '../data_Lab_macket_v1.json';

function updateLedCards(data) {
    const ledCards = document.querySelectorAll('.led_card[data-led-key]');

    ledCards.forEach(card => {
        const ledKey = card.dataset.ledKey;
        const ledValue = Number(data[ledKey]);

        const indicator = card.querySelector('.system_indicator');
        const onButton = card.querySelector('[data-led-state="on"]');
        const offButton = card.querySelector('[data-led-state="off"]');

        if (!indicator || !onButton || !offButton) return;

        indicator.classList.remove('active', 'inactive');
        onButton.classList.remove('active');
        offButton.classList.remove('active');

        if (ledValue === 1) {
            indicator.classList.add('active');
            onButton.classList.add('active');
        } else {
            indicator.classList.add('inactive');
            offButton.classList.add('active');
        }
    });
}

// ===== Отображение состояний тумблеров =====

function updateButtonCards(data) {
    const buttonCards = document.querySelectorAll('.button_card[data-button-key]');

    buttonCards.forEach(card => {
        const buttonKey = card.dataset.buttonKey;
        const buttonValue = Number(data[buttonKey]);

        const stateText = card.querySelector('.button_state');

        if (!stateText) return;

        card.classList.remove('active');

        if (buttonValue === 1) {
            card.classList.add('active');
            stateText.textContent = 'Активен';
        } else {
            stateText.textContent = 'Неактивен';
        }
    });
}


async function loadControlsData() {
    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        updateLedCards(data);
        updateButtonCards(data);

    } catch (error) {
        console.error('Ошибка загрузки JSON для страницы управления:', error);
    }
}

loadControlsData();