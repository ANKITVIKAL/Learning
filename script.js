class StockDashboard {
    constructor() {
        this.stocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
        this.stockData = new Map();
        this.autoRefreshInterval = null;
        this.portfolioChart = null;
        this.marketChart = null;
        
        // API configuration - using Alpha Vantage demo key (limited requests)
        this.apiKey = 'demo'; // Users should get their own free API key from Alpha Vantage
        this.apiBaseUrl = 'https://www.alphavantage.co/query';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialStocks();
        this.setupAutoRefresh();
        this.initializeCharts();
        this.loadMarketIndices();
    }

    setupEventListeners() {
        const addStockBtn = document.getElementById('addStock');
        const stockInput = document.getElementById('stockInput');
        const refreshAllBtn = document.getElementById('refreshAll');
        const autoRefreshCheckbox = document.getElementById('autoRefresh');

        addStockBtn.addEventListener('click', () => this.addStock());
        stockInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addStock();
        });
        refreshAllBtn.addEventListener('click', () => this.refreshAllStocks());
        autoRefreshCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.setupAutoRefresh();
            } else {
                this.clearAutoRefresh();
            }
        });
    }

    async loadInitialStocks() {
        this.showLoading(true);
        
        // Load demo data for initial stocks
        for (const symbol of this.stocks) {
            await this.fetchStockData(symbol);
        }
        
        this.renderStockCards();
        this.updateCharts();
        this.showLoading(false);
        this.updateLastUpdated();
    }

    async addStock() {
        const input = document.getElementById('stockInput');
        const symbol = input.value.trim().toUpperCase();
        
        if (!symbol) {
            this.showMessage('Please enter a stock symbol', 'error');
            return;
        }

        if (this.stocks.includes(symbol)) {
            this.showMessage('Stock already added to dashboard', 'error');
            return;
        }

        this.showLoading(true);
        const success = await this.fetchStockData(symbol);
        
        if (success) {
            this.stocks.push(symbol);
            this.renderStockCards();
            this.updateCharts();
            input.value = '';
            this.showMessage(`${symbol} added successfully`, 'success');
        }
        
        this.showLoading(false);
        this.updateLastUpdated();
    }

    async fetchStockData(symbol) {
        try {
            // Since Alpha Vantage demo has limited calls, we'll simulate data for demo purposes
            // In production, replace this with actual API calls
            const mockData = this.generateMockStockData(symbol);
            this.stockData.set(symbol, mockData);
            return true;
        } catch (error) {
            console.error(`Error fetching data for ${symbol}:`, error);
            this.showMessage(`Failed to fetch data for ${symbol}`, 'error');
            return false;
        }
    }

    generateMockStockData(symbol) {
        const basePrice = Math.random() * 200 + 50; // Random price between 50-250
        const change = (Math.random() - 0.5) * 20; // Random change between -10 to +10
        const changePercent = (change / basePrice) * 100;
        
        return {
            symbol: symbol,
            price: basePrice.toFixed(2),
            change: change.toFixed(2),
            changePercent: changePercent.toFixed(2),
            volume: Math.floor(Math.random() * 10000000),
            high: (basePrice + Math.random() * 10).toFixed(2),
            low: (basePrice - Math.random() * 10).toFixed(2),
            open: (basePrice + (Math.random() - 0.5) * 5).toFixed(2),
            marketCap: (Math.random() * 2000 + 100).toFixed(1) + 'B',
            pe: (Math.random() * 30 + 10).toFixed(1),
            timestamp: new Date().toISOString()
        };
    }

    renderStockCards() {
        const grid = document.getElementById('stockGrid');
        grid.innerHTML = '';

        this.stocks.forEach(symbol => {
            const data = this.stockData.get(symbol);
            if (!data) return;

            const card = this.createStockCard(data);
            grid.appendChild(card);
        });
    }

    createStockCard(data) {
        const card = document.createElement('div');
        card.className = 'stock-card';
        
        const isPositive = parseFloat(data.change) >= 0;
        const changeClass = isPositive ? 'positive' : 'negative';
        const changeIcon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';

        card.innerHTML = `
            <div class="stock-header">
                <div class="stock-symbol">${data.symbol}</div>
                <button class="remove-stock" onclick="dashboard.removeStock('${data.symbol}')">
                    <i class="fas fa-times"></i> Remove
                </button>
            </div>
            <div class="stock-price ${changeClass}">$${data.price}</div>
            <div class="stock-change ${changeClass}">
                <i class="fas ${changeIcon}"></i>
                ${isPositive ? '+' : ''}${data.change} (${isPositive ? '+' : ''}${data.changePercent}%)
            </div>
            <div class="stock-details">
                <div class="detail-item">
                    <div class="detail-label">Volume</div>
                    <div class="detail-value">${this.formatNumber(data.volume)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Market Cap</div>
                    <div class="detail-value">$${data.marketCap}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">High</div>
                    <div class="detail-value">$${data.high}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Low</div>
                    <div class="detail-value">$${data.low}</div>
                </div>
            </div>
        `;

        return card;
    }

    removeStock(symbol) {
        const index = this.stocks.indexOf(symbol);
        if (index > -1) {
            this.stocks.splice(index, 1);
            this.stockData.delete(symbol);
            this.renderStockCards();
            this.updateCharts();
            this.showMessage(`${symbol} removed from dashboard`, 'success');
        }
    }

    async refreshAllStocks() {
        this.showLoading(true);
        
        for (const symbol of this.stocks) {
            await this.fetchStockData(symbol);
        }
        
        this.renderStockCards();
        this.updateCharts();
        this.showLoading(false);
        this.updateLastUpdated();
        this.showMessage('All stocks refreshed successfully', 'success');
    }

    setupAutoRefresh() {
        this.clearAutoRefresh();
        this.autoRefreshInterval = setInterval(() => {
            this.refreshAllStocks();
        }, 30000); // Refresh every 30 seconds
    }

    clearAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    initializeCharts() {
        // Portfolio Performance Chart
        const portfolioCtx = document.getElementById('portfolioChart').getContext('2d');
        this.portfolioChart = new Chart(portfolioCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
                        '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
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
        });

        // Market Overview Chart
        const marketCtx = document.getElementById('marketChart').getContext('2d');
        this.marketChart = new Chart(marketCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    updateCharts() {
        if (!this.portfolioChart || !this.marketChart) return;

        // Update portfolio chart
        const symbols = [];
        const values = [];
        
        this.stockData.forEach((data, symbol) => {
            symbols.push(symbol);
            values.push(parseFloat(data.price));
        });

        this.portfolioChart.data.labels = symbols;
        this.portfolioChart.data.datasets[0].data = values;
        this.portfolioChart.update();

        // Update market chart with sample time series data
        const timeLabels = [];
        const portfolioValues = [];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            timeLabels.push(date.toLocaleDateString());
            
            // Calculate mock portfolio value
            let totalValue = 0;
            this.stockData.forEach(data => {
                totalValue += parseFloat(data.price) * (1 + (Math.random() - 0.5) * 0.1);
            });
            portfolioValues.push(totalValue.toFixed(2));
        }

        this.marketChart.data.labels = timeLabels;
        this.marketChart.data.datasets[0].data = portfolioValues;
        this.marketChart.update();
    }

    loadMarketIndices() {
        const indices = [
            { name: 'S&P 500', value: '4,567.89', change: '+1.23%', positive: true },
            { name: 'NASDAQ', value: '14,234.56', change: '+0.87%', positive: true },
            { name: 'DOW JONES', value: '34,567.12', change: '-0.45%', positive: false },
            { name: 'RUSSELL 2000', value: '2,123.45', change: '+2.10%', positive: true }
        ];

        const grid = document.getElementById('indicesGrid');
        grid.innerHTML = '';

        indices.forEach(index => {
            const card = document.createElement('div');
            card.className = 'index-card';
            
            const changeClass = index.positive ? 'positive' : 'negative';
            
            card.innerHTML = `
                <div class="index-name">${index.name}</div>
                <div class="index-value">${index.value}</div>
                <div class="index-change ${changeClass}">${index.change}</div>
            `;
            
            grid.appendChild(card);
        });
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    updateLastUpdated() {
        const now = new Date();
        document.getElementById('lastUpdated').textContent = now.toLocaleTimeString();
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
}

// Initialize the dashboard when the page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new StockDashboard();
});

// Handle page visibility change to pause/resume auto-refresh
document.addEventListener('visibilitychange', () => {
    if (dashboard) {
        const autoRefreshCheckbox = document.getElementById('autoRefresh');
        if (document.hidden) {
            dashboard.clearAutoRefresh();
        } else if (autoRefreshCheckbox.checked) {
            dashboard.setupAutoRefresh();
        }
    }
});
