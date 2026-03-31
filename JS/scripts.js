const burger = document.querySelector('.burger');
const sidebar = document.querySelector('.sidebar');
const spans = burger.querySelectorAll('span');
const navLinks = document.querySelectorAll('.nav_link');

let open = false;
let isAnimating = false;

function openMenu(){
    if (open || isAnimating) return;
    isAnimating = true;
    open = true;

    const middleTop = spans[1].offsetTop;
    //  схлопывание
    spans[0].style.top = middleTop + 'px';
    spans[2].style.top = middleTop + 'px';
    sidebar.classList.add('expanded');
    sidebar.classList.remove('collapsed');
        
    setTimeout(() => {
        // скрываем центральную
        spans[1].style.opacity = '0';

            // делаем крестик
        spans[0].style.transform = 'rotate(45deg)';
        spans[2].style.transform = 'rotate(-45deg)';
    }, 300); 
    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

function closeMenu(){
    if (!open || isAnimating) return;
    isAnimating = true;
    open = false;

    // убираем крестик
    spans[0].style.transform = 'rotate(0deg)';
    spans[2].style.transform = 'rotate(0deg)';
    spans[1].style.opacity = '1';

    // закрываем меню
    sidebar.classList.remove('expanded');
    sidebar.classList.add('collapsed');

    setTimeout(() => {
        spans[0].style.top = '0px';
        spans[2].style.top = '16px';
    }, 300);

    setTimeout(() => {
        isAnimating = false;
    }, 600);
}

burger.addEventListener('click', () => {
    if (isAnimating) return; 

    if (open) {
        closeMenu();
    } else {
        openMenu();
    }
});
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

/* ===== Загрузка данных из JSON ===== */

async function loadKpiData() {
    try {
        const response = await fetch('data_Lab_macket_v1.json');

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        document.getElementById('temperature_value').textContent = data.temperature.toFixed(1);
        document.getElementById('pressure_value').textContent = data.pressure;
        document.getElementById('light_value').textContent = data.ambient_light;
        document.getElementById('brightness_value').textContent = data.lightness;
    } catch (error) {
        console.error('Ошибка загрузки JSON:', error);
    }
}

loadKpiData();