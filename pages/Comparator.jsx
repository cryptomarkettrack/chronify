import React, { useEffect, useRef, useState } from 'react';
import {
    Autocomplete,
    Container,
    FormControl,
    Grid2,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { createChart } from 'lightweight-charts';
import { fetchUSDTPairs } from './api/top_usdt_pairs';

const DEFAULT_PAIR = 'BTC/USDT';

export default function Comparator() {
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const comparedYearOffset = 4;
    const [fromPeriodStart, setFromPeriodStart] = useState(formatDate(firstDayOfMonth));
    const [toPeriodEnd, setToPeriodEnd] = useState(formatDate(lastDayOfMonth));
    const [comparedFromPeriodStart, setComparedFromPeriodStart] = useState(formatDate(new Date(now.getFullYear() - comparedYearOffset, now.getMonth(), 1)));
    const [comparedToPeriodEnd, setComparedToPeriodEnd] = useState(formatDate(new Date(now.getFullYear() - comparedYearOffset, now.getMonth() + 1, 0)));

    const [timeframe, setTimeframe] = useState('4h');
    const [usdtPairs, setUsdtPairs] = useState([DEFAULT_PAIR]);
    const [selectedPair, setSelectedPair] = useState(DEFAULT_PAIR);

    const [currentPeriodData, setCurrentPeriodData] = useState([]);
    const [comparedPeriodData, setComparedPeriodData] = useState([]);

    const currentChartRef = useRef(null);
    const comparedChartRef = useRef(null);

    useEffect(() => {
        async function main() {
            const pairs = await fetchUSDTPairs();
            setUsdtPairs(pairs);
        }
        main();
    }, []);

    useEffect(() => {
        fetchChartData();
    }, [fromPeriodStart, toPeriodEnd, comparedFromPeriodStart, comparedToPeriodEnd, timeframe, selectedPair]);

    async function fetchChartData() {
        const response = await fetch(`/api/ohlcv?symbol=${selectedPair}&fromPeriodStart=${fromPeriodStart}&toPeriodEnd=${toPeriodEnd}&comparedFromPeriodStart=${comparedFromPeriodStart}&comparedToPeriodEnd=${comparedToPeriodEnd}&timeframe=${timeframe}`);
        const data = await response.json();
        setCurrentPeriodData(data.currentPeriod);
        setComparedPeriodData(data.comparedPeriod);
    }

    function createChartInstance(container, chartData, isCurrentPeriod) {
        container.innerHTML = '';


        const chart = createChart(container, {
            width: container.clientWidth,
            height: 550,
            layout: {
                background: {
                    color: '#000000'
                },
                textColor: '#ffffff',
                borderRadius: '10px'
            },
            grid: {
                vertLines: { color: 'transparent' },
                horzLines: { color: 'transparent' },
            },
            priceScale: {
                borderColor: '#555555',
            },
            timeScale: {
                borderColor: '#555555',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#4caf50',
            downColor: '#f44336',
            borderDownColor: '#f44336',
            borderUpColor: '#4caf50',
            wickDownColor: '#f44336',
            wickUpColor: '#4caf50'
        });

        const now = new Date();
        const currentDay = now.getDate();
        const currentMonth = now.getMonth();

        const updatedData = isCurrentPeriod ? chartData : chartData.map(candle => {
            const candleDate = new Date(candle.time * 1000);
            const candleDay = candleDate.getDate();
            const candleMonth = candleDate.getMonth();

            if (candleMonth < currentMonth || (candleMonth === currentMonth && candleDay < currentDay)) {
                return {
                    ...candle,
                    color: 'rgba(255,255,255,0.2)',
                    borderColor: 'rgba(255,255,255,0.2)',
                    wickColor: 'rgba(255,255,255,0.2)',
                };
            }
            return candle;
        });

        candlestickSeries.setData(updatedData);
        chart.timeScale().fitContent();
    }

    useEffect(() => {
        if (currentPeriodData.length > 0 && currentChartRef.current) {
            createChartInstance(currentChartRef.current, currentPeriodData, true);
        }
    }, [currentPeriodData]);

    useEffect(() => {
        if (comparedPeriodData.length > 0 && comparedChartRef.current) {
            createChartInstance(comparedChartRef.current, comparedPeriodData, false);
        }
    }, [comparedPeriodData]);

    return (
        <Container>
            <h1 align="center">Unlock Hidden Market Patterns with Chronify</h1>
            <h5 align="center">Analyze historical crypto market trends to discover recurring patterns, predict future movements, and make data-driven decisions.</h5>

            <Grid2 container spacing={3} justifyContent="center">
                <Grid2 item>
                    <FormControl fullWidth>
                        <Autocomplete
                            sx={{ width: '150px' }}
                            value={selectedPair}
                            onChange={(event, newValue) => setSelectedPair(newValue)}
                            options={usdtPairs}
                            disableClearable
                            renderInput={(params) => (
                                <TextField {...params} label="Pair" variant="outlined" fullWidth /> // Ensure TextField is full width
                            )}
                        />
                    </FormControl>
                </Grid2>
                <Grid2 item>
                    <FormControl fullWidth>
                        <TextField
                            label="From Period Start"
                            type="date"
                            value={fromPeriodStart}
                            onChange={e => setFromPeriodStart(e.target.value)}
                            variant="outlined"
                            fullWidth // Ensure TextField is full width
                        />
                    </FormControl>
                </Grid2>

                <Grid2 item>
                    <FormControl fullWidth>
                        <TextField
                            label="To Period End"
                            type="date"
                            value={toPeriodEnd}
                            onChange={e => setToPeriodEnd(e.target.value)}
                            variant="outlined"
                            fullWidth // Ensure TextField is full width
                        />
                    </FormControl>
                </Grid2>

                <Grid2 item>
                    <FormControl fullWidth>
                        <TextField
                            sx={{ width: '170px' }}
                            label="Compared Period Start"
                            type="date"
                            value={comparedFromPeriodStart}
                            onChange={e => setComparedFromPeriodStart(e.target.value)}
                            variant="outlined"
                            fullWidth // Ensure TextField is full width
                        />
                    </FormControl>
                </Grid2>

                <Grid2 item>
                    <FormControl fullWidth>
                        <TextField
                            sx={{ width: '150px' }}
                            label="Compared Period End"
                            type="date"
                            value={comparedToPeriodEnd}
                            onChange={e => setComparedToPeriodEnd(e.target.value)}
                            variant="outlined"
                            fullWidth // Ensure TextField is full width
                        />
                    </FormControl>
                </Grid2>

                <Grid2 item>
                    <FormControl fullWidth>
                        <InputLabel>Timeframe</InputLabel>
                        <Select
                            value={timeframe}
                            onChange={e => setTimeframe(e.target.value)}
                            variant="outlined"
                            fullWidth // Ensure Select is full width
                        >
                            <MenuItem value="1d">Daily</MenuItem>
                            <MenuItem value="1w">Weekly</MenuItem>
                            <MenuItem value="4h">4 Hours</MenuItem>
                            <MenuItem value="1h">1 Hour</MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>


            <Grid2 container spacing={3} justifyContent="center" style={{ marginTop: '20px' }}>
                <Grid2 item >
                    <Typography variant="h6" align="center">Current Period</Typography>
                    <div ref={currentChartRef} className="chart" style={{ width: '30vw', height: '550px', borderRadius: '10px' }}></div>
                </Grid2>
                <Grid2 item >
                    <Typography variant="h6" align="center">Compared Period</Typography>
                    <div ref={comparedChartRef} className="chart" style={{ width: '30vw', height: '550px', borderRadius: '10px' }}></div>
                </Grid2>
            </Grid2>
        </Container>
    );
}
