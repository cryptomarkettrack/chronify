import ccxt from 'ccxt';
// Initialize Binance exchange instance
const exchange = new ccxt.binance();
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
// Detect bull and bear markets
function detectMarketPhases(ohlcvData) {
    let marketPhases = [];
    let currentPhase = null;
    let currentStart = null;
    let lastPrice = null;
    ohlcvData.forEach((candle, index) => {
        const [timestamp, open, high, low, close] = candle;
        const price = close;
        if (lastPrice === null) {
            lastPrice = price;
            currentStart = timestamp;
            return;
        }
        // Define phase transition thresholds
        const bullThreshold = price > lastPrice * 1.1;  // 10% increase for a bull market
        const bearThreshold = price < lastPrice * 0.9;  // 10% decrease for a bear market
        // Check for bull market
        if (bullThreshold && (!currentPhase || currentPhase !== 'bull')) {
            if (currentPhase) {
                marketPhases.push({
                    phase: currentPhase,
                    start: currentStart,
                    end: timestamp,
                    length: (timestamp - currentStart) / (1000 * 60 * 60 * 24),  // Length in days
                });
            }
            currentPhase = 'bull';
            currentStart = timestamp;
        }
        // Check for bear market
        if (bearThreshold && (!currentPhase || currentPhase !== 'bear')) {
            if (currentPhase) {
                marketPhases.push({
                    phase: currentPhase,
                    start: currentStart,
                    end: timestamp,
                    length: (timestamp - currentStart) / (1000 * 60 * 60 * 24),  // Length in days
                });
            }
            currentPhase = 'bear';
            currentStart = timestamp;
        }
        lastPrice = price;
    });
    // Add the final phase to the list
    if (currentPhase) {
        marketPhases.push({
            phase: currentPhase,
            start: currentStart,
            end: ohlcvData[ohlcvData.length - 1][0],
            length: (ohlcvData[ohlcvData.length - 1][0] - currentStart) / (1000 * 60 * 60 * 24),  // Length in days
        });
    }
    return marketPhases;
}
// Compare market phases across different years
async function compareMarketCycles(symbol, timeframe, years) {
    const currentYear = new Date().getFullYear();
    const yearCycleData = [];
    for (const year of years) {
        const startTime = new Date(`${year}-01-01`).getTime();
        const endTime = new Date(`${year}-12-31`).getTime();
        const limit = 1000;  // Fetch max number of candles (adjust if needed)
        const ohlcvData = await fetchOHLCV(symbol, timeframe, startTime, limit);
        const marketPhases = detectMarketPhases(ohlcvData);
        yearCycleData.push({
            year,
            marketPhases
        });
    }
    return yearCycleData;
}
// API Handler
export default async function handler(req, res) {
    const symbol = 'BTC/USDT';
    const timeframe = '1d';  // Daily candles
    const years = req.query.years ? req.query.years.split(',') : [2020, 2021, 2022, 2023];  // Default years to compare
    try {
        const marketCycles = await compareMarketCycles(symbol, timeframe, years);
        res.json(marketCycles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching market data.' });
    }
}