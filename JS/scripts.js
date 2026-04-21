
// ========== BURGER ============
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

// ======= График RGB Chart.js =========
Chart.register(ChartDataLabels);

fetch('./data_Lab_macket_v1.json')
    .then(response => response.json()) // ответ в JSON
    .then(data => {
        const pie_chart_rgb = new Chart(document.querySelector('#bar_chart_RGB'), {
            type: 'bar',
            data: {
                labels: ['Red', 'Green', 'Blue', ],
                datasets: [{
                    label: ' ',
                    data: [data.red_light, data.green_light, data.blue_light],
                    borderWidth: 3,
                    borderRadius:10,
                    backgroundColor: [
                        'rgba(243, 63, 102, 0.6)',  
                        'rgba(53, 187, 73, 0.6)', 
                        'rgba(32, 151, 231, 0.6)' 
                    ],
                    borderColor: [
                        'rgba(197, 64, 113, 0.5)',
                        'rgba(62, 144, 74, 0.5)',
                        'rgba(44, 111, 155, 0.5)' 
                    ],
                    barPercentage: 1.1,

                }]
            },
            options: {
                layout:{
                    padding:{
                        top:30
                    }
                },
                scales:{
                    y: {
                        type: 'logarithmic',
                        display: false,
                        offset: true,
                    },
                    x: {
                        offset: true,
                        grid: {
                            drawTicks: false,    // убираем маленькие палочки на делениях
                            drawOnChartArea: false, // убираем сетку на фоне графика
                            
                        },
                        ticks:{
                            font: {
                                weight: 'bold',
                                size: 15,
                                color: '#2f3e46',
                            }
                        },
                    }
                },

                plugins: {

                    tooltip: {
                        enabled: false 
                    },

                    legend:{display: false},

                    datalabels:{
                        labels: [{
                            color: '#2f3e46',
                            anchor: 'end',
                            align: 'top',
                            offset: 0,
                            clip: false,

                            font: {
                                weight: 'bold',
                                size: 16,
                            },
                        }],
                    },
                }
            },
            plugins: [ChartDataLabels],
        });
    });
    

// ======= График Отображения состояний системы DONUT Chart.js =========

// ======= Цифры в центре =======
const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
        const { width, height, ctx } = chart;

        ctx.save();
        ctx.font = 'bold 24px Manrope';
        ctx.fillStyle = '#2f3e46';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const value = chart.data.datasets[0].data[0];
        const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        const percent = Math.round((value / total) * 100);

        ctx.fillText(percent + '%', width / 2, height / 2);
    }
};


// ======= Donut chart =======
fetch('./data_Lab_macket_v1.json')
    .then(response => response.json())
    .then(data => {

        const states = [
            data.LED1,
            data.LED2,
            data.LED3,
            data.button1State,
            data.button2State,
            data.button3State
        ];

        const activeCount = states.reduce((sum, val) => sum + val, 0);
        const total = states.length;

        const donut_chart = new Chart(document.querySelector('#donut_chart_system'), {
            type: 'doughnut',
            data: {
                labels: ['ON', 'OFF'], // не нужно
                datasets: [{
                    data: [activeCount, total - activeCount],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.8)', // вкл
                        'rgba(200, 200, 200, 0.3)' // выкл
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '80%', // толщина кольца

                plugins: {

                    datalabels:{
                        display: false
                    },

                    legend: { display: false },

                    tooltip: {
                        enabled: false
                    }
                }
            },
            plugins: [centerTextPlugin]
        });      
    });
