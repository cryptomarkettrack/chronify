import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, Fade, Zoom } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';

const AboutSection = () => {
    return (
        <Box sx={{ padding: 4, borderRadius: 2, boxShadow: 1 }}>
            <Zoom in timeout={1400}>
                <Typography variant="h1" component="h1" gutterBottom align="center" sx={{ color: '#F4E4BA' }}>
                    Why Chronify?
                </Typography>
            </Zoom>
            <Typography variant="body1" align="center" sx={{ color: '#D9DCD6' }}>
                Chronify helps traders and investors uncover recurring market trends by analyzing historical data. From seasonal rallies to major market cycles, our advanced tools enable you to compare key assets across timeframes and detect patterns that repeat over months, quarters, or years.
            </Typography>
            <Typography variant="h2" component="h2" gutterBottom align="center" sx={{ color: '#F4E4BA' }}>
                Key Features:
            </Typography>
            <List sx={{ listStyleType: 'none', paddingLeft: 0 }}>
                <ListItem>
                    <ListItemIcon>
                        <CompareArrowsIcon sx={{ color: '#F4E4BA' }} />
                    </ListItemIcon>
                    <Typography variant="body1" sx={{ color: '#D9DCD6' }}>
                        <strong>Compare Historical Trends:</strong> Gain insights by comparing the performance of assets during similar periods in previous years.
                    </Typography>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <CalendarTodayIcon sx={{ color: '#F4E4BA' }} />
                    </ListItemIcon>
                    <Typography variant="body1" sx={{ color: '#D9DCD6' }}>
                        <strong>Spot Seasonal Patterns:</strong> Identify key times when the market typically rallies or dips.
                    </Typography>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <BarChartIcon sx={{ color: '#F4E4BA' }} />
                    </ListItemIcon>
                    <Typography variant="body1" sx={{ color: '#D9DCD6' }}>
                        <strong>Cross-Asset Analysis:</strong> Compare different coins, stocks, or sectors during the same timeframes.
                    </Typography>
                </ListItem>
            </List>
        </Box>
    );
};

export default AboutSection;
