import ccxt from 'ccxt';

// Initialize CCXT Exchange
const exchange = new ccxt.binance({
    rateLimit: 1200,
    enableRateLimit: true,
});

const timeframe = '1h'; // Timeframe to fetch data
const shortPeriod = 30; // Equivalent to shortPeriod in Pine Script
const longPeriod = 100; // Equivalent to longPeriod in Pine Script

// Fetch OHLCV data
async function fetchOHLCV(symbol, timeframe, limit = longPeriod) {
    try {
        const ohlcv = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
        return ohlcv;
    } catch (error) {
        console.error(`Error fetching data for ${symbol}: ${error.message}`);
        return null;
    }
}

// Find the highest high or lowest low in the given period
function findExtremes(prices, period, high = true) {
    const slice = prices.slice(-period);
    return high ? Math.max(...slice) : Math.min(...slice);
}

function calculateTrendline(data, shortPeriod, longPeriod) {
    const lows = data.map(candle => candle[3]); // Low prices
    const highs = data.map(candle => candle[2]); // High prices
    const timestamps = data.map(candle => candle[0]); // Timestamps

    // Short period extremes
    const lowestY2 = findExtremes(lows, shortPeriod, false);
    const lowestX2 = lows.lastIndexOf(lowestY2);
    const highestY2 = findExtremes(highs, shortPeriod, true);
    const highestX2 = highs.lastIndexOf(highestY2);

    // Long period extremes
    const lowestY1 = findExtremes(lows.slice(0, longPeriod), longPeriod, false);
    const lowestX1 = lows.indexOf(lowestY1);
    const highestY1 = findExtremes(highs.slice(0, longPeriod), longPeriod, true);
    const highestX1 = highs.indexOf(highestY1);

    // Trendline formulas (Support & Resistance)
    const supportSlope = (lowestY2 - lowestY1) / (lowestX2 - lowestX1);
    const resistanceSlope = (highestY2 - highestY1) / (highestX2 - highestX1);

    // Convert timestamps to readable date objects
    const formatTimestamp = timestamp => {
        const date = new Date(timestamp);
        return {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDate(),
            hour: date.getUTCHours(),
            minute: date.getUTCMinutes(),
            millisTime: date.getTime()
        };
    };

    // Extend the resistance line by 3x
    const resistanceEndXExtended = highestX2 + 3 * (highestX2 - highestX1); // Extend end X by 3x the original distance
    const resistanceEndYExtended = resistanceSlope * (resistanceEndXExtended - highestX1) + highestY1;

    return {
        support: x => supportSlope * (x - lowestX1) + lowestY1,
        resistance: x => resistanceSlope * (x - highestX1) + highestY1,
        supportLine: {
            start: { x: formatTimestamp(timestamps[lowestX1]), y: lowestY1 },
            end: { x: formatTimestamp(timestamps[lowestX2]), y: supportSlope * (lowestX2 - lowestX1) + lowestY1 }
        },
        resistanceLine: {
            start: { x: formatTimestamp(timestamps[highestX1]), y: highestY1 },
            end: { x: formatTimestamp(timestamps[resistanceEndXExtended] || timestamps[timestamps.length - 1]), y: resistanceEndYExtended }
        }
    };
}


// Check for trendline breaks
function detectTrendlineBreak(data, trendlines, symbol) {
    const closePrices = data.map(candle => candle[4]); // Close prices
    const currentPrice = closePrices[closePrices.length - 1];


    // Calculate trendlines
    const supportLine = trendlines.support(closePrices.length - 1);
    const resistanceLine = trendlines.resistance(closePrices.length - 1);
    // console.log('supportLine', supportLine, resistanceLine, trendlines.supportLine, trendlines.resistanceLine)

    if (currentPrice < supportLine) {
        console.log(`[${symbol}] Break below support! Current Price: ${currentPrice}, Support Level: ${supportLine}`, trendlines);
        return -1;
    } else if (currentPrice > resistanceLine) {
        console.log(`[${symbol}] Break above resistance! Current Price: ${currentPrice}, Resistance Level: ${resistanceLine}`, trendlines);
        return 1;
    }

    return 0;
}

// Get all USDT pairs excluding skipped symbols
async function getUSDTpairs() {
    const skipSymbols = [
        'USDP/USDT', 'USDC/USDT', 'FDUSD/USDT', 'EURI/USDT', 'EUR/USDT',
        'AEUR/USDT', 'PAXG/USDT', 'TUSD/USDT', 'WBTC/USDT', 'BTTC/USDT'
    ];
    const markets = await exchange.loadMarkets();
    return Object.keys(markets)
        .filter(symbol => symbol.endsWith('/USDT') && markets[symbol].active && !skipSymbols.includes(symbol));
}

// Run analysis for trendline breaks
export async function runAnalysis() {
    let usdtPairs = await getUSDTpairs();
    let belowTrendline = [];
    let aboveTrendline = [];
    console.log(`Running analysis for ${usdtPairs.length} USDT pairs...`);

    usdtPairs = usdtPairs
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    for (const symbol of usdtPairs) {

        if (aboveTrendline.length > 3 || belowTrendline.length > 3) {
            break;
        }

        const ohlcv = await fetchOHLCV(symbol, timeframe, longPeriod);
        if (ohlcv) {
            const trendlines = calculateTrendline(ohlcv, shortPeriod, longPeriod);
            const res = detectTrendlineBreak(ohlcv, trendlines, symbol);
            // console.log('res', res, aboveTrendline.length, belowTrendline.length)

            if (res > 0) {
                aboveTrendline.push({ symbol: symbol, trendline: trendlines.resistanceLine });
            } else if (res < 0) {
                belowTrendline.push({ symbol: symbol, trendline: trendlines.supportLine });
            }
        }
    }

    return {
        aboveTrendline: aboveTrendline,
        belowTrendline: belowTrendline
    }
}


export default async function handler(req, res) {
    const result = await runAnalysis();

    res.json({
        belowTrendline: result.belowTrendline,
        aboveTrendline: result.aboveTrendline
    });
}

// Schedule the analysis to run every 5 minutes
// setInterval(runAnalysis, 5 * 60 * 1000);

// // Start the trendline break analysis tool
// (async () => {
//     console.log("Starting the trendline break analysis tool...");
//     await runAnalysis(); // Run immediately at startup
// })();
