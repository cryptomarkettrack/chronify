import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

const YearSelection = ({ availableYears, selectedYears, onChange }) => {
    const handleYearChange = (year) => {
        const updatedYears = selectedYears.includes(year)
            ? selectedYears.filter(y => y !== year)
            : [...selectedYears, year];
        onChange(updatedYears);
    };

    return (
        <div>
            {availableYears.map((year) => (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selectedYears.includes(year)}
                            onChange={() => handleYearChange(year)}
                        />
                    }
                    label={year}
                    key={year}
                />
            ))}
        </div>
    );
};

export default YearSelection;
