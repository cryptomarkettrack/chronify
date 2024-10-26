import React, { useEffect, useState } from 'react';
import PhaseChart from './PhaseChart';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

const MarketCycleComparison = () => {
    const [marketData, setMarketData] = useState([]);

    useEffect(() => {
        async function main() {
            const response = await fetch(`/api/market_cycle?years=2020,2021,2022,2023,2024`);
            const data = await response.json();
            setMarketData(data);
        }
        main();
    }, []);

    return (
        <Box sx={{ padding: { xs: 2, sm: 4 } }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                Market Cycle Comparison
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, marginBottom: 2 }}>
                Analyzing historical bull and bear markets across different years.
            </Typography>
            {marketData.length > 0 ? (
                marketData.map((yearData) => (
                    <Box key={yearData.year} sx={{ marginBottom: 4 }}>
                        <Typography variant="h5" component="h2" sx={{ color: '#1976d2', fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>
                            {yearData.year}
                        </Typography>
                        <PhaseChart
                            phases={
                                yearData.marketPhases
                                    .sort((a1, a2) => a1.start - a2.start)
                                    .map((phase) => ({
                                        ...phase,
                                        start: new Date(phase.start).toLocaleDateString(),
                                        end: new Date(phase.end).toLocaleDateString(),
                                    })) ?? []
                            }
                        />
                        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Phase</TableCell>
                                        <TableCell>Start</TableCell>
                                        <TableCell>End</TableCell>
                                        <TableCell>Length (days)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {yearData.marketPhases.map((phase, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{phase.phase}</TableCell>
                                            <TableCell>{new Date(phase.start).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(phase.end).toLocaleDateString()}</TableCell>
                                            <TableCell>{Math.round(phase.length)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))
            ) : (
                <Typography variant="body2" sx={{ color: 'gray', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                    Loading...
                </Typography>
            )}
        </Box>
    );
};

export default MarketCycleComparison;
