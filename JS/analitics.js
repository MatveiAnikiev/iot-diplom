const DATA_URL = "../data_Lab_macket_v1.json";

Chart.register(ChartDataLabels);

async function loadData() {
    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error("Не удалось загрузить JSON-файл");
        }

        const data = await response.json();

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

                    borderColor: "#0b4497",
                    backgroundColor: "#1929701a",

                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,

                    pointRadius: 4,
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
                    top: 20,
                    right: 16,
                    left: 4,
                    bottom: 0
                }
            },

            interaction: {
                mode: "index",
                intersect: false
            },

            scales: {
                x: {
                    offset: true,

                    title: {
                        display: true,
                        text: "Время",
                        color: "#474747",
                        font: {
                            family: "Manrope",
                            size: 14,
                            weight: "800"
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
                            size: 11
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
                        font: {
                            family: "Manrope",
                            size: 14,
                            weight: "800"
                        }
                    },

                    ticks: {
                        color: "#6b7280",
                        font: {
                            family: "Manrope",
                            size: 11
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
                        size: 11
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

loadData();