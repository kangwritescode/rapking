import { FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, Stack, SxProps } from '@mui/material';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

interface SexFieldProps {
  control: Control<any>;
  errorMessage?: string;
  label?: string;
  sx?: SxProps;
}

function SexField({ control, errorMessage, label }: SexFieldProps) {
  return (
    <>
      <Controller
        name='sex'
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Stack>
            {label && <FormLabel sx={{ marginBottom: -1 }}>{label}</FormLabel>}
            <RadioGroup row aria-label='sex' {...field}>
              <FormControlLabel value='male' control={<Radio />} label='Male' />
              <FormControlLabel value='female' control={<Radio />} label='Female' />
            </RadioGroup>
          </Stack>
        )}
      />
      {errorMessage && (
        <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-dob'>
          {errorMessage}
        </FormHelperText>
      )}
    </>
  );
}

export default SexField;
