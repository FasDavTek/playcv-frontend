import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface RadioProps extends RadioGroupProps {
  label: string;
  options: { value: string; label: string }[];
}

export default function RowRadioButtonsGroup({
  label,
  options,
  ...rest
}: RadioProps) {
  return (
    <FormControl>
      <FormLabel
        id="radio-component"
        sx={{
          '&.Mui-focused': { color: 'black' },
        }}
      >
        {label}
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="radio-component"
        name="row-radio-buttons-group"
        {...rest}
      >
        {options.map(({ value, label }, idx) => (
          <FormControlLabel
            key={idx}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
