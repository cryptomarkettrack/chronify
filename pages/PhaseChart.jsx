import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const PhaseChart = ({ phases }) => {
    console.log('phases', phases)

    return (
        <div style={{ height: 400, width: '100%' }}>
            <BarChart
                xAxis={[
                    {
                        data: phases?.map((phase) => `${phase.start} - ${phase.end}`) ?? [], // Categorical data for x-axis
                        label: 'Phase Period',
                        scaleType: 'band', // Set the scale type to band for categorical data
                    },
                ]}
                series={[
                    {
                        data: phases?.map((phase) => phase.length) ?? [],
                        label: 'Phase Length (Days)',
                        color: '#fdb462'
                    },
                ]}
            />
        </div>
    );
};

export default PhaseChart;
