

import ccxt from 'ccxt';

const exchange = new ccxt.bybit();

// Fetch OHLCV data
async function fetchOHLCV(symbol, timeframe, since, limit = 1000) {
    try {
        const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, since, limit);
        return ohlcv;
    } catch (error) {
        console.error(`Error fetching OHLCV data: ${error.message}`);
        return [];
    }
}

// Process OHLCV data for TradingView format
function processOHLCVForTradingView(data) {
    return data.map(candle => ({
        time: candle[0] / 1000,  // Convert timestamp to seconds for TradingView
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
    }));
}

// Function to get the duration of the timeframe in milliseconds
function getTimeframeDuration(timeframe) {
    switch (timeframe) {
        case '1h':
            return 60 * 60 * 1000;  // 1 hour
        case '4h':
            return 4 * 60 * 60 * 1000;  // 4 hours
        case '1d':
            return 24 * 60 * 60 * 1000;  // 1 day
        case '1w':
            return 7 * 24 * 60 * 60 * 1000;  // 1 week
        default:
            return 24 * 60 * 60 * 1000;  // Default to 1 day
    }
}

export default async function handler(req, res) {
    const symbol = req.query.symbol || 'BTC/USDT';
    const fromPeriodStart = new Date(req.query.fromPeriodStart || '2024-10-01').getTime();
    const toPeriodEnd = new Date(req.query.toPeriodEnd || '2024-10-30').getTime();
    const comparedFromPeriodStart = new Date(req.query.comparedFromPeriodStart || '2020-10-01').getTime();
    const comparedToPeriodEnd = new Date(req.query.comparedToPeriodEnd || '2020-10-30').getTime();
    const timeframe = req.query.timeframe || '1d';

    const limitCurrent = Math.ceil((toPeriodEnd - fromPeriodStart) / getTimeframeDuration(timeframe));
    const limitCompared = Math.ceil((comparedToPeriodEnd - comparedFromPeriodStart) / getTimeframeDuration(timeframe));

    // Fetch current period data
    const ohlcvCurrent = await fetchOHLCV(symbol, timeframe, fromPeriodStart, limitCurrent);
    const processedCurrent = processOHLCVForTradingView(ohlcvCurrent);

    // Fetch compared period data
    const ohlcvCompared = await fetchOHLCV(symbol, timeframe, comparedFromPeriodStart, limitCompared);
    const processedCompared = processOHLCVForTradingView(ohlcvCompared);

    res.json({
        currentPeriod: processedCurrent,
        comparedPeriod: processedCompared
    });
}