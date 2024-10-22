import React, { useEffect, useState } from 'react';
import PhaseChart from './PhaseChart';

const MarketCycleComparison = () => {
    const [marketData, setMarketData] = useState([]);

    useEffect(() => {
        async function main() {
            // Fetch market cycle comparison data
            const response = await fetch(`/api/market_cycle?years=2020,2021,2022,2023,2024`);
            const data = await response.json();
            setMarketData(data);
        }
        main()
    }, [])

    return (
        <div style={{ padding: '20px' }}>
            <h1>Market Cycle Comparison</h1>
            <p>Analyzing historical bull and bear markets across different years.</p>
            {marketData.length > 0 ? (
                marketData.map(yearData => (
                    <div key={yearData.year}>
                        <h2>{yearData.year}</h2>
                        <PhaseChart phases={yearData.marketPhases.sort((a1, a2) => a1.start - a2.start).map(phase => {
                            return { ...phase, start: new Date(phase.start).toLocaleDateString(), end: new Date(phase.end).toLocaleDateString() }
                        }) ?? []} />
                        <table border="1" cellPadding="10" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Phase</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Length (days)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {yearData.marketPhases.map((phase, index) => (
                                    <tr key={index}>
                                        <td>{phase.phase}</td>
                                        <td>{new Date(phase.start).toLocaleDateString()}</td>
                                        <td>{new Date(phase.end).toLocaleDateString()}</td>
                                        <td>{Math.round(phase.length)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}

export default MarketCycleComparison;