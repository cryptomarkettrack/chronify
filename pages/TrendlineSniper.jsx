import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, CircularProgress, Grid2, Paper, ListItemButton, ListItemText, FormControl, Autocomplete, TextField } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import styles from './Comparator.module.css'; // Import the CSS Module
import { createChart } from 'lightweight-charts';

const TrendlineSniper = () => {
    const now = new Date();
    const comparedYearOffset = 4;

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState(false);
    const [selectedBelowPair, setSelectedBelowPair] = useState(null);
    const [selectedAbovePair, setSelectedAbovePair] = useState(null);
    const [fromPeriodStart, setFromPeriodStart] = useState(formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 1)));
    const [toPeriodEnd, setToPeriodEnd] = useState(formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)));
    const [comparedFromPeriodStart, setComparedFromPeriodStart] = useState(formatDate(new Date(now.getFullYear() - comparedYearOffset, now.getMonth() - 1, 1)));
    const [comparedToPeriodEnd, setComparedToPeriodEnd] = useState(formatDate(new Date(now.getFullYear() - comparedYearOffset, now.getMonth() + 2, 0)));

    const chartRef = useRef(null);



    useEffect(async () => {
        fetchChartData();
    }, []);


    useEffect(() => {
        if (selectedAbovePair == null && selectedBelowPair == null) {
            return;
        }

        let pair = selectedAbovePair !== null ? selectedAbovePair : selectedBelowPair;
        const trendline = selectedAbovePair !== null ? chartData?.aboveTrendline.find(t => t.symbol === selectedAbovePair).trendline
            : chartData?.belowTrendline.find(t => t.symbol === selectedBelowPair).trendline;
        const main = async () => {
            const response = await fetch(`/api/ohlcv?symbol=${pair}&fromPeriodStart=2024-12-25&toPeriodEnd=2024-12-31&comparedFromPeriodStart=2020-11-01&comparedToPeriodEnd=2021-01-31&timeframe=1h`);
            const data = await response.json();
            // setChartData(data.currentPeriod);
            console.log('data', data, chartData)

            if (data !== false) {
                console.log('draw')
                createChartInstance(chartRef.current, data.currentPeriod, true, trendline);
            }
        }

        main();
    }, [selectedAbovePair, selectedBelowPair]);


    function createChartInstance(container, chartData, isCurrentPeriod, trendline) {
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
                timezone: 'Etc/GMT-2', // GMT+2
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


        const lineSeries = chart.addLineSeries({
            lastValueVisible: false
        });

        var tldata = [];
        console.log('trendline, ', trendline, new Date(trendline.start.x.year, trendline.start.x.month - 1, trendline.start.x.day, trendline.start.x.hour, trendline.start.x.minute));
        tldata.push({
            time: Math.floor(new Date(trendline.start.x.year, trendline.start.x.month - 1, trendline.start.x.day, trendline.start.x.hour + 2, trendline.start.x.minute).getTime() / 1000),
            value: trendline.start.y
        });
        tldata.push({
            time: Math.floor(new Date(trendline.end.x.year, trendline.end.x.month - 1, trendline.end.x.day, trendline.end.x.hour + 2, trendline.end.x.minute).getTime() / 1000),
            value: trendline.end.y
        });
        lineSeries.setData(tldata);

        chart.timeScale().fitContent();
    }


    async function fetchChartData() {
        setIsLoading(true)
        const response = await fetch(`/api/trendlines`);
        const data = await response.json();
        setChartData(data);
        setIsLoading(false)
    }

    const belowTrendlinePairs = chartData?.belowTrendline?.length > 0 ? chartData?.belowTrendline.map(d => d.symbol) : [];
    const aboveTrendlinePairs = chartData?.aboveTrendline?.length > 0 ? chartData?.aboveTrendline.map(d => d.symbol) : [];

    return (
        <Grid2 container spacing={3} justifyContent="center" alignItems="flex-start" style={{ marginTop: '20px' }} >
            <FormControl fullWidth>
                <Autocomplete
                    onChange={(event, newValue) => setSelectedBelowPair(newValue)}
                    options={belowTrendlinePairs}
                    size='small'
                    disableClearable
                    renderInput={(params) => (
                        <TextField {...params} label="Below Trendline Pairs" variant="outlined" fullWidth />
                    )}
                />
                <Autocomplete
                    onChange={(event, newValue) => setSelectedAbovePair(newValue)}
                    options={aboveTrendlinePairs}
                    size='small'
                    disableClearable
                    renderInput={(params) => (
                        <TextField {...params} label="Above Trendline Pairs" variant="outlined" fullWidth />
                    )}
                />
            </FormControl>
            {/* Column 2: Chart */}
            <Grid2 item xs={12} sm={6} className={styles.chartContainer}>
                {isLoading ? (
                    <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>Loading....</span>
                    </div>
                ) : (
                    <div ref={chartRef} className={`${styles.chartBox} chart`}></div>
                )}
            </Grid2>
        </Grid2>
    );

};

export default TrendlineSniper;
