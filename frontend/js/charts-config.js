// Chart.js Configuration for Admin Dashboard

// Chart colors
const chartColors = {
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    purple: '#8b5cf6',
    pink: '#ec4899',
    gray: '#64748b'
};

// Chart gradient helper
function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

// Sales Chart Data by Period
const salesData = {
    daily: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [12500, 15200, 18900, 14300, 21400, 25600, 19800]
    },
    weekly: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [85000, 92000, 78000, 95000]
    },
    monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 81000, 78000, 89000]
    },
    yearly: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        data: [450000, 520000, 680000, 750000, 820000, 891000]
    }
};

// Initialize Sales Chart
function initSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    const gradient = createGradient(ctx.getContext('2d'), 'rgba(99, 102, 241, 0.2)', 'rgba(99, 102, 241, 0)');
    
    window.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.monthly.labels,
            datasets: [{
                label: 'Sales',
                data: salesData.monthly.data,
                borderColor: chartColors.primary,
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: chartColors.primary,
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: chartColors.primary,
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '৳' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '৳' + (value / 1000) + 'K';
                        },
                        color: '#64748b'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Initialize Revenue Breakdown Chart (Donut)
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    window.revenueChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'],
            datasets: [{
                data: [320000, 280000, 180000, 95000, 46000],
                backgroundColor: [
                    chartColors.primary,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.purple,
                    chartColors.pink
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 12
                        },
                        color: '#64748b'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#fff',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ৳' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Update Sales Chart Period
function updateSalesChartPeriod(period) {
    if (!window.salesChart || !salesData[period]) return;
    
    window.salesChart.data.labels = salesData[period].labels;
    window.salesChart.data.datasets[0].data = salesData[period].data;
    window.salesChart.update('active');
    
    // Update active button
    document.querySelectorAll('.admin-chart-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.period === period) {
            btn.classList.add('active');
        }
    });
}

// Initialize all charts
function initAllCharts() {
    initSalesChart();
    initRevenueChart();
    
    // Add event listeners for period filters
    document.querySelectorAll('.admin-chart-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.dataset.period;
            updateSalesChartPeriod(period);
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure canvas elements are rendered
    setTimeout(initAllCharts, 100);
});

// Export for use in other scripts
window.chartUtils = {
    colors: chartColors,
    createGradient: createGradient,
    updateSalesChartPeriod: updateSalesChartPeriod
};
