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
import styles from './Comparator.module.css'; // Import the CSS Module
import CircularProgress from '@mui/material/CircularProgress';

const DEFAULT_PAIR = 'BTC/USDT';

export default function Comparator() {
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const now = new Date();
    const comparedYearOffset = 4;
    const [fromPeriodStart, setFromPeriodStart] = useState(formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 1)));
    const [toPeriodEnd, setToPeriodEnd] = useState(formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)));
    const [comparedFromPeriodStart, setComparedFromPeriodStart] = useState(formatDate(new Date(now.getFullYear() - comparedYearOffset, now.getMonth() - 1, 1)));
    const [comparedToPeriodEnd, setComparedToPeriodEnd] = useState(formatDate(new Date(now.getFullYear() - comparedYearOffset, now.getMonth() + 2, 0)));

    const [timeframe, setTimeframe] = useState('1d');
    const [usdtPairs, setUsdtPairs] = useState([DEFAULT_PAIR]);
    const [selectedPair, setSelectedPair] = useState(DEFAULT_PAIR);

    const [currentPeriodData, setCurrentPeriodData] = useState([]);
    const [comparedPeriodData, setComparedPeriodData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        fetchChartData();
        setIsLoading(false);
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
            height: 600,
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
        const fourYearsAgo = new Date();
        if (comparedToPeriodEnd?.length > 0) {
            const targetData = now.getFullYear() - (now.getFullYear() - parseInt(comparedFromPeriodStart.split('-')[0]))
            fourYearsAgo.setFullYear(targetData);
        }

        const updatedData = isCurrentPeriod ? chartData : chartData.map(candle => {
            const candleDate = new Date(candle.time * 1000);

            if (candleDate < fourYearsAgo) {
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

        if (!isCurrentPeriod) {
            const markers = [
                {
                    time: { year: parseInt(comparedFromPeriodStart.split('-')[0]), month: now.getMonth() + 1, day: now.getDate() },
                    position: 'belowBar',
                    color: '#f68410',
                    shape: 'circle',
                    text: 'We are here',
                },
            ];
            candlestickSeries.setMarkers(markers);
        }

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
        <Container maxWidth={false}>
            <h5 align="center">“History Doesn't Repeat Itself, but It Often Rhymes”.</h5>

            <Grid2 container spacing={3} justifyContent="center">
                <Grid2 item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <Autocomplete
                            sx={{ width: '150px' }}
                            value={selectedPair}
                            onChange={(event, newValue) => setSelectedPair(newValue)}
                            options={usdtPairs}
                            size='small'
                            disableClearable
                            renderInput={(params) => (
                                <TextField {...params} label="Pair" variant="outlined" fullWidth />
                            )}
                        />
                    </FormControl>
                </Grid2>


                <Grid2 item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <TextField
                            sx={{ width: '170px' }}
                            label="Compared Period Start"
                            type="date"
                            size='small'
                            value={comparedFromPeriodStart}
                            onChange={e => setComparedFromPeriodStart(e.target.value)}
                            variant="outlined"
                            fullWidth
                        />
                    </FormControl>
                </Grid2>

                <Grid2 item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <TextField
                            sx={{ width: '150px' }}
                            label="Compared Period End"
                            size='small'
                            type="date"
                            value={comparedToPeriodEnd}
                            onChange={e => setComparedToPeriodEnd(e.target.value)}
                            variant="outlined"
                            fullWidth
                        />
                    </FormControl>
                </Grid2><Grid2 item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <TextField
                            label="From Period Start"
                            type="date"
                            size='small'
                            value={fromPeriodStart}
                            onChange={e => setFromPeriodStart(e.target.value)}
                            variant="outlined"
                            fullWidth
                        />
                    </FormControl>
                </Grid2>

                <Grid2 item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <TextField
                            label="To Period End"
                            type="date"
                            size='small'
                            value={toPeriodEnd}
                            onChange={e => setToPeriodEnd(e.target.value)}
                            variant="outlined"
                            fullWidth
                        />
                    </FormControl>
                </Grid2>

                <Grid2 item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Timeframe</InputLabel>
                        <Select
                            value={timeframe}
                            onChange={e => setTimeframe(e.target.value)}
                            variant="outlined"
                            size='small'
                            fullWidth
                        >
                            <MenuItem value="1d">Daily</MenuItem>
                            <MenuItem value="1w">Weekly</MenuItem>
                            <MenuItem value="4h">4 Hours</MenuItem>
                            <MenuItem value="1h">1 Hour</MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>

            <Grid2 container spacing={3} justifyContent="center" className={styles.chartContainer} style={{ marginTop: '20px' }}>
                <Grid2 item>
                    <Typography variant="h6" align="center">{comparedFromPeriodStart} to {comparedToPeriodEnd}</Typography>
                    {isLoading ? <div style={{ height: '50vh', display: 'flex', alignItems: 'center', verticalAlign: 'center' }}><CircularProgress /> </div> : <div ref={comparedChartRef} className={`${styles.chartBox} chart`}></div>}
                </Grid2>
                <Grid2 item>
                    <Typography variant="h6" align="center">{fromPeriodStart} to {toPeriodEnd}</Typography>
                    {isLoading ? <div style={{ height: '50vh', display: 'flex', alignItems: 'center', verticalAlign: 'center' }}><CircularProgress /> </div> : <div ref={currentChartRef} className={`${styles.chartBox} chart`}></div>}
                </Grid2>
            </Grid2>

        </Container>
    );
}
