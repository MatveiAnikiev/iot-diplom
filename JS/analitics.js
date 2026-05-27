// ТЕКУЩИЕ ПОКАЗАТЕЛИ
const DATA_URL = "../data_Lab_macket_v1.json";

async function loadKpiData() {
    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error("Не удалось загрузить JSON-файл");
        }

        const data = await response.json();

        document.getElementById("temperature_value").textContent = data.temperature.toFixed(1);
        document.getElementById("pressure_value").textContent = data.pressure;
        document.getElementById("light_value").textContent = data.ambient_light;
        document.getElementById("brightness_value").textContent = data.lightness;

    } catch (error) {
        console.error("Ошибка загрузки KPI:", error);
    }
}

// LED - лента
function renderLedStrip(leds) {
    const ledStripList = document.getElementById("led_strip_list");

    if (!ledStripList || !Array.isArray(leds)) {
        return;
    }

    ledStripList.innerHTML = "";

    leds.forEach((led) => {
        const ledItem = document.createElement("li");
        ledItem.classList.add("led_strip_item");

        const ledLight = document.createElement("span");
        ledLight.classList.add("led_strip_light");

        const red = led.red;
        const green = led.green;
        const blue = led.blue;

        ledLight.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
        ledLight.style.boxShadow = `0 0 18px rgba(${red}, ${green}, ${blue}, 0.65)`;

        ledItem.appendChild(ledLight);
        ledStripList.appendChild(ledItem);
    });
}
// Акселерометр
function renderAccelerometerValues(data) {
    const accelerationXValue = document.getElementById("acceleration_x_value");
    const accelerationYValue = document.getElementById("acceleration_y_value");
    const accelerationZValue = document.getElementById("acceleration_z_value");

    if (!accelerationXValue || !accelerationYValue || !accelerationZValue) {
        return;
    }

    accelerationXValue.textContent = data.acceleration_x.toFixed(2);
    accelerationYValue.textContent = data.acceleration_y.toFixed(2);
    accelerationZValue.textContent = data.acceleration_z.toFixed(2);
}

// ИСТОРИЯ ПОКАЗАТЕЛЕЙ
loadKpiData();

Chart.register(ChartDataLabels);

async function loadData() {
    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error("Не удалось загрузить JSON-файл");
        }

        const data = await response.json();

        renderLedStrip(data.leds);
        renderAccelerometerValues(data);
        createAccelerometerChart(data);

        createLineChart(
            "line_chart_temperature",
            data.temperature_history,
            "Температура",
            "°C"
        );

        createLineChart(
            "line_chart_pressure",
            data.pressure_history,
            "Давление",
            "кПа"
        );

        createLineChart(
            "line_chart_light",
            data.ambient_light_history,
            "Освещенность",
            "лк"
        );

        createLineChart(
            "line_chart_lightness",
            data.lightness_history,
            "Яркость",
            "%"
        );

    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}

function formatValue(value, unit) {
    return unit ? `${value} ${unit}` : `${value}`;
}

function createLineChart(canvasId, historyData, label, unit) {
    const canvas = document.getElementById(canvasId);

    if (!canvas || !historyData) {
        return;
    }

    const labels = historyData.map(item => item.time);
    const values = historyData.map(item => item.value);

    new Chart(canvas, {
        type: "line",

        data: {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: values,

                    borderColor: "#074db6",
                    backgroundColor: "#9d9d9d2f",

                    borderWidth: 4,
                    tension: 0.4,
                    fill: true,

                    pointRadius: 6,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "#ffffff",
                    pointBorderColor: "#0b4497",
                    pointBorderWidth: 2
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            layout: {
                padding: {
                    top: 10,
                    right: 16,
                    left: 6,
                    bottom: 5
                }
            },

            interaction: {
                mode: "index",
                intersect: false
            },

            scales: {
                x: {
                    offset: false,

                    title: {
                        display: true,
                        text: "t",
                        color: "#474747",
                        font: {
                            family: "Manrope",
                            size: 16,
                            weight: "600"
                        }
                    },

                    grid: {
                        drawTicks: false,
                        drawOnChartArea: false
                    },

                    ticks: {
                        color: "#6b7280",
                        font: {
                            family: "Manrope",
                            size: 12
                        }
                    },

                    border: {
                        display: false
                    }
                },

                y: {
                    beginAtZero: false,
                    grace: "10%",

                    title: {
                        display: true,
                        text: unit,
                        color: "#474747",
                        padding: {
                            bottom: -15
                        },
                        font: {
                            family: "Manrope",
                            size: 18,
                            weight: "800"
                        }
                    },

                    ticks: {
                        color: "#6b7280",
                        padding: 25,
                        font: {
                            family: "Manrope",
                            size: 12,
                        }
                    },

                    grid: {
                        color: "rgba(148, 163, 184, 0.25)",
                        drawTicks: false
                    },

                    border: {
                        display: false
                    }
                }
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    enabled: true,
                    backgroundColor: "#1f2937",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",

                    padding: {
                        top: 6,
                        right: 8,
                        bottom: 6,
                        left: 8
                    },

                    cornerRadius: 6,
                    displayColors: false,
                    caretSize: 4,
                    caretPadding: 4,

                    titleFont: {
                        family: "Manrope",
                        size: 11,
                        weight: "700"
                    },

                    bodyFont: {
                        family: "Manrope",
                        size: 11,
                        weight: "500"
                    },

                    callbacks: {
                        title: function (context) {
                            return context[0].label;
                        },

                        label: function (context) {
                            return `${context.parsed.y} ${unit}`;
                        }
                    }
                },

                datalabels: {
                    color: "#2f3e46",

                    anchor: "end",
                    align: "top",
                    offset: 5,

                    clamp: false,
                    clip: false,

                    padding: {
                        top: 3,
                        right: 6,
                        bottom: 3,
                        left: 6
                    },

                    font: {
                        family: "Manrope",
                        weight: "700",
                        size: 14
                    },

                    formatter: function (value) {
                        return value;
                    }
                }
            }
        },

        plugins: [ChartDataLabels]
    });
}

// ЦВЕТА АКСЕЛЕРОМЕТРА
function interpolateColor(color1, color2, factor) {
    const result = color1.map((channel, index) => {
        return Math.round(channel + factor * (color2[index] - channel));
    });

    return `rgba(${result[0]}, ${result[1]}, ${result[2]}, 0.78)`;
}

function getAccelerationGradientColor(value) {
    const minValue = -2;
    const maxValue = 2;

    const negativeColor = [54, 209, 119]; // зеленый
    const positiveColor = [11, 68, 151];  // синий

    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const factor = Math.min(Math.max(normalizedValue, 0), 1);

    return interpolateColor(negativeColor, positiveColor, factor);
}

function getAccelerationGradientBorderColor(value) {
    const minValue = -2;
    const maxValue = 2;

    const negativeColor = [109, 40, 217]; // зеленый
    const positiveColor = [11, 68, 151];  // синий

    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const factor = Math.min(Math.max(normalizedValue, 0), 1);

    return interpolateColor(negativeColor, positiveColor, factor);
}

// accelerometer
function createAccelerometerChart(data) {
    const canvas = document.getElementById("accelerometer_bar_chart");

    if (!canvas) {
        return;
    }

    const accelerationValues = [
        data.acceleration_x,
        data.acceleration_y,
        data.acceleration_z
    ];

    new Chart(canvas, {
        type: "bar",

        data: {
            labels: ["X", "Y", "Z"],
            datasets: [
                {
                    label: "Ускорение",
                    data: accelerationValues,

                    base: 0,

                    backgroundColor: [
                        getAccelerationGradientColor(data.acceleration_x),
                        getAccelerationGradientColor(data.acceleration_y),
                        getAccelerationGradientColor(data.acceleration_z)
                    ],

                    borderColor: [
                        getAccelerationGradientBorderColor(data.acceleration_x),
                        getAccelerationGradientBorderColor(data.acceleration_y),
                        getAccelerationGradientBorderColor(data.acceleration_z)
                    ],

                    borderWidth: 1,
                    borderRadius: 6,
                    barPercentage: 0.45,
                    categoryPercentage: 0.65
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            scales: {
                x: {
                    title: {
                        display: true,
                        color: "#474747",
                        font: {
                            family: "Manrope",
                            size: 16,
                            weight: "600"
                        }
                    },

                    ticks: {
                        color: "#2f3e46",
                        font: {
                            family: "Manrope",
                            size: 16,
                            weight: "700"
                        }
                    },

                    grid: {
                        drawOnChartArea: false,
                        drawTicks: false
                    }
                },

                y: {
                    beginAtZero: true,
                    suggestedMin: -2,
                    suggestedMax: 2,

                    title: {
                        display: true,
                        text: "Ускорение",
                        color: "#474747",
                        font: {
                            family: "Manrope",
                            size: 16,
                            weight: "600"
                        }
                    },

                    ticks: {
                        color: "#6b7280",
                        font: {
                            family: "Manrope",
                            size: 14
                        }
                    },

                    grid: {
                        color: function (context) {
                            if (context.tick.value === 0) {
                                return "rgba(47, 62, 70, 0.45)";
                            }

                            return "rgba(148, 163, 184, 0.25)";
                        },
                        drawTicks: false
                    }
                }
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    enabled: true,
                    backgroundColor: "#1f2937",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    displayColors: false,

                    callbacks: {
                        label: function (context) {
                            return context.parsed.y.toFixed(2);
                        }
                    }
                },

                datalabels: {
                    color: "#2f3e46",
                    backgroundColor: "rgb(255, 255, 255)",
                    borderRadius: 8,
                    padding: {
                        top: 2,
                        right: 5,
                        bottom: 2,
                        left: 5
                    },

                    anchor: function (context) {
                        const value = context.dataset.data[context.dataIndex];

                        return value < 0 ? "end" : "start";
                    },

                    align: function (context) {
                        const value = context.dataset.data[context.dataIndex];

                        return value < 0 ? "top" : "bottom";
                    },

                    offset: 8,

                    font: {
                        family: "Manrope",
                        weight: "600",
                        size: 13
                    },

                    formatter: function (value) {
                        return value.toFixed(2);
                    }
                }
            }
        },

        plugins: [ChartDataLabels]
    });
}


loadData();