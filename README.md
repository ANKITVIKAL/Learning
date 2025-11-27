# Real-Time Stock Dashboard

A modern, responsive web dashboard for tracking real-time stock market data with interactive charts and live updates.

## Features

- **Real-time Stock Tracking**: Monitor multiple stocks with live price updates
- **Interactive Charts**: Portfolio performance and market overview visualizations
- **Market Indices**: Track major market indices (S&P 500, NASDAQ, DOW, Russell 2000)
- **Auto-refresh**: Automatic data updates every 30 seconds
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful glass-morphism design with smooth animations

## Getting Started

### Quick Start (Demo Mode)

1. Simply open `index.html` in your web browser
2. The dashboard will load with demo data for popular stocks (AAPL, GOOGL, MSFT, TSLA, AMZN)
3. Add new stocks using the search bar
4. Enable/disable auto-refresh as needed

### Production Setup (Real API Data)

For real-time data, you'll need to get a free API key from Alpha Vantage:

1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key) and get your free API key
2. Open `script.js` and replace the demo API key:
   ```javascript
   this.apiKey = 'YOUR_ACTUAL_API_KEY_HERE';
   ```
3. Uncomment the real API implementation in the `fetchStockData` method

### Alternative API Providers

You can also use other stock API providers:
- **Finnhub**: Free tier with real-time data
- **IEX Cloud**: Reliable stock market data
- **Twelve Data**: Comprehensive financial data
- **Yahoo Finance API**: Free but unofficial

## File Structure

```
/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Usage

### Adding Stocks
1. Type a stock symbol (e.g., AAPL, GOOGL, MSFT) in the search box
2. Click "Add Stock" or press Enter
3. The stock will be added to your dashboard

### Removing Stocks
- Click the "Remove" button on any stock card

### Auto-refresh
- Toggle the "Auto-refresh" checkbox to enable/disable automatic updates
- Data refreshes every 30 seconds when enabled
- Auto-refresh pauses when the browser tab is not active

### Charts
- **Portfolio Performance**: Doughnut chart showing your stock distribution
- **Market Overview**: Line chart showing portfolio value over time

## Customization

### Styling
- Modify `styles.css` to change colors, layout, or animations
- The design uses CSS Grid and Flexbox for responsive layouts
- Glass-morphism effects can be adjusted by changing backdrop-filter values

### Functionality
- Add new chart types by extending the Chart.js implementation
- Modify refresh intervals in the `setupAutoRefresh` method
- Add new stock metrics by updating the `createStockCard` method

### API Integration
- Replace the mock data generator with real API calls
- Add error handling for API rate limits
- Implement caching to reduce API calls

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Dependencies

- **Chart.js**: For interactive charts and graphs
- **Font Awesome**: For icons and visual elements

All dependencies are loaded via CDN, so no installation is required.

## Performance Tips

1. **API Rate Limits**: Be mindful of API rate limits when using real data
2. **Caching**: Implement local storage caching for better performance
3. **Lazy Loading**: Consider lazy loading for large numbers of stocks
4. **Debouncing**: Add debouncing to search inputs for better UX

## Troubleshooting

### Common Issues

1. **CORS Errors**: Some APIs require server-side proxy for browser requests
2. **Rate Limiting**: Free API tiers have request limits
3. **Invalid Symbols**: Ensure stock symbols are valid and properly formatted

### Solutions

1. Use a CORS proxy service or implement a backend API
2. Implement caching and reduce refresh frequency
3. Add input validation and error handling

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.
