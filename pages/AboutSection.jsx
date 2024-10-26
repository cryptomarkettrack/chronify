import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';

const AboutSection = () => {
    return (
        <Box
            sx={{
                padding: { xs: 2, sm: 4 },
                borderRadius: 2,
                boxShadow: 1,
                textAlign: 'center',
            }}
        >
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                align="center"
                sx={{
                    color: '#F4E4BA',
                    fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                }}
            >
                Why Chronify?
            </Typography>
            <Typography
                variant="body1"
                align="center"
                sx={{
                    color: '#D9DCD6',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    marginBottom: { xs: 2, sm: 4 },
                }}
            >
                Chronify helps traders and investors uncover recurring market trends by analyzing historical data. From seasonal rallies to major market cycles, our advanced tools enable you to compare key assets across timeframes and detect patterns that repeat over months, quarters, or years.
            </Typography>
            <Typography
                variant="h4"
                component="h2"
                gutterBottom
                align="center"
                sx={{
                    color: '#F4E4BA',
                    fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
            >
                Key Features:
            </Typography>
            <List sx={{ listStyleType: 'none', paddingLeft: 0 }}>
                <ListItem sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                    <ListItemIcon>
                        <CompareArrowsIcon sx={{ color: '#F4E4BA', fontSize: { xs: '1.5rem', sm: '2rem' } }} />
                    </ListItemIcon>
                    <Typography variant="body1" sx={{ color: '#D9DCD6', textAlign: { xs: 'center', sm: 'left' } }}>
                        <strong>Compare Historical Trends:</strong> Gain insights by comparing the performance of assets during similar periods in previous years.
                    </Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                    <ListItemIcon>
                        <CalendarTodayIcon sx={{ color: '#F4E4BA', fontSize: { xs: '1.5rem', sm: '2rem' } }} />
                    </ListItemIcon>
                    <Typography variant="body1" sx={{ color: '#D9DCD6', textAlign: { xs: 'center', sm: 'left' } }}>
                        <strong>Spot Seasonal Patterns:</strong> Identify key times when the market typically rallies or dips.
                    </Typography>
                </ListItem>
                <ListItem sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                    <ListItemIcon>
                        <BarChartIcon sx={{ color: '#F4E4BA', fontSize: { xs: '1.5rem', sm: '2rem' } }} />
                    </ListItemIcon>
                    <Typography variant="body1" sx={{ color: '#D9DCD6', textAlign: { xs: 'center', sm: 'left' } }}>
                        <strong>Cross-Asset Analysis:</strong> Compare different coins, stocks, or sectors during the same timeframes.
                    </Typography>
                </ListItem>
            </List>
        </Box>
    );
};

export default AboutSection;
