# SmApp - Smart Market Data Dashboard

A modern React-based web application for tracking cryptocurrency and currency exchange rates in real-time.

## Features

### Cryptocurrency Widget
- Real-time tracking of major cryptocurrencies (BTC, ETH, TON, SOL, ADA, LINK)
- 24-hour price change indicators
- Detailed modal view for each cryptocurrency
- Auto-refresh every 60 seconds
- Responsive grid layout

### Currency Exchange Widget
- Live exchange rates for major currencies (USD, EUR, RUB, CNY, GBP, JPY)
- All rates shown relative to KZT (Kazakhstani Tenge)
- Currency flags and symbols
- Auto-refresh functionality
- Responsive design

## Technical Stack

- **Frontend Framework**: React
- **UI Components**: Radix UI Themes
- **Icons**: Radix UI Icons
- **API Integrations**:
  - CoinGecko API for cryptocurrency data
  - Exchange Rates API for currency conversion
- **State Management**: React Hooks (useState, useEffect)
- **Custom Hooks**: useMarketData for unified data fetching

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd react-newapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Configuration

The application uses the following APIs:
- CoinGecko API (no API key required)
- Exchange Rates API (no API key required)

## Usage

The dashboard automatically fetches and displays:
- Current cryptocurrency prices in USD
- 24-hour price changes for cryptocurrencies
- Current exchange rates for major currencies relative to KZT
- All data is automatically refreshed every 60 seconds

## Customization

You can customize the tracked cryptocurrencies and currencies by modifying:
- `COIN_IDS` in useMarketData.js for cryptocurrencies
- `CURRENCY_SYMBOLS` in useMarketData.js for currencies

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## Data Refresh

- All market data automatically refreshes every 60 seconds
- Manual refresh available through the UI
- Graceful error handling for API failures

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
