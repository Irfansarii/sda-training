import { PerformanceMonitor } from './PerformanceMonitor.js';

export class ChartManager {
    constructor(containerId, dataManager) {
        this.container = document.getElementById(containerId);
        this.dataManager = dataManager;
        //  this.container = document.querySelector('#chart-container');
        this.charts = new Map();
        // this.init(); The infinite issue is happening because this.init() is being called inside the constructor, and your app is probably creating multiple ChartManager instances repeatedly.
        // this.init();
    }

    async init() {

        await this.loadChartLibrary();
        await this.createCharts();

        //below new line add
        //  await this.createCharts();
        this.setupEventListeners();
        // await this.createCharts(); double use
    }

    async loadChartLibrary() {
           if (window.Chart) return;
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // async createCharts() {
    //     try {
    //         // Fetch data
    //         const [userData, revenueData, orderData] = await Promise.all([
    //             this.dataManager.fetchData('/api/users'),
    //             this.dataManager.fetchData('/api/revenue'),
    //             this.dataManager.fetchData('/api/orders')
    //         ]);

    //         // Create charts
    //         this.createLineChart('revenueChart', revenueData);
    //         this.createBarChart('userChart', userData);
    //         this.createDoughnutChart('orderChart', orderData);
    //         this.createMixedChart('performanceChart', { userData, revenueData, orderData });

    //     } catch (error) {
    //         console.error('Chart creation error:', error);
    //         this.showError('Failed to load chart data');
    //     }
    // }


    // async createCharts() {

    //     const users = await this.dataManager.fetchData('/users');

    //     this.container.innerHTML = `
    //         <h2>Chart Data</h2>

    //         ${users.map(user => `
    //             <div>
    //                 ${user.name}
    //             </div>
    //         `).join('')}
    //     `;
    // }
    async createCharts() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();

        this.container.innerHTML = `
        <div class="chart-grid">

            <div class="chart-card">
                <h3>Revenue Trend</h3>
                <canvas id="revenueChart"></canvas>
            </div>

            <div class="chart-card">
                <h3>User Growth</h3>
                <canvas id="userChart"></canvas>
            </div>

            <div class="chart-card">
                <h3>Order Distribution</h3>
                <canvas id="orderChart"></canvas>
            </div>

            <div class="chart-card">
                <h3>Performance Overview</h3>
                <canvas id="performanceChart"></canvas>
            </div>

        </div>
    `;

        // Dummy data
        const revenueData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr'],
            values: [100, 200, 150, 300]
        };

        const userData = {
            labels: ['A', 'B', 'C', 'D'],
            values: [10, 20, 30, 40]
        };

        const orderData = {
            labels: ['Pending', 'Completed', 'Cancelled'],
            values: [15, 60, 10]
        };

        // Create charts
        this.createLineChart('revenueChart', revenueData);

        this.createBarChart('userChart', userData);

        this.createDoughnutChart('orderChart', orderData);

        this.createMixedChart('performanceChart', {
            userData,
            revenueData,
            orderData
        });
    }
    createLineChart(canvasId, data) {
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }
        const ctx = document.getElementById(canvasId).getContext('2d');

        this.charts.set(canvasId, new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.values,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        }));
    }

    createBarChart(canvasId, data) {
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }
        const ctx = document.getElementById(canvasId).getContext('2d');

        this.charts.set(canvasId, new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Users',
                    data: data.values,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }));
    }

    createDoughnutChart(canvasId, data) {
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }
        const ctx = document.getElementById(canvasId).getContext('2d');

        this.charts.set(canvasId, new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        }));
    }

    createMixedChart(canvasId, data) {
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }
        const ctx = document.getElementById(canvasId).getContext('2d');

        this.charts.set(canvasId, new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.userData.labels,
                datasets: [
                    {
                        label: 'Users',
                        data: data.userData.values,
                        type: 'bar',
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgb(59, 130, 246)',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Revenue',
                        data: data.revenueData.values,
                        type: 'line',
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        }));
    }

    setupEventListeners() {
        // Add chart interaction events
        this.dataManager.subscribe((endpoint, data) => {
            this.updateCharts(endpoint, data);
        });

        // Add window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.charts.forEach(chart => chart.resize());
        }, 250));
    }

    updateCharts(endpoint, data) {
        // Update specific charts based on endpoint
        switch (endpoint) {
            case '/api/users':
                this.updateChart('userChart', data);
                break;
            case '/api/revenue':
                this.updateChart('revenueChart', data);
                break;
            case '/api/orders':
                this.updateChart('orderChart', data);
                break;
        }
    }

    updateChart(chartId, data) {
        const chart = this.charts.get(chartId);
        if (chart) {
            chart.data = data;
            chart.update('active');
        }
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Charts</h3>
                <p>${message}</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}