import ccxt from 'ccxt';

const exchange = new ccxt.binance();

export async function fetchUSDTPairs() {
    const markets = await exchange.fetchMarkets();
    return markets.filter(market => market.symbol.endsWith('USDT')).map(m => m.symbol);
}

async function fetchUSDTData() {
    const markets = await exchange.fetchMarkets();
    const usdtPairs = markets.filter(market => market.symbol.endsWith('USDT'));

    const priceChanges = await Promise.all(usdtPairs.map(async (pair) => {
        try {
            const ticker = await exchange.fetchTicker(pair.symbol);
            return {
                symbol: pair.symbol,
                change: ticker.percentage,
            };
        } catch (error) {
            console.error(`Error fetching ticker for ${pair.symbol}: ${error.message}`);
            return null;
        }
    }));

    return priceChanges
        .filter(Boolean)
        .sort((a, b) => b.change - a.change)
        .slice(0, 10);
}

export default async function handler(req, res) {
    try {
        const topPairs = await fetchUSDTData();
        res.status(200).json(topPairs);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
    }
}