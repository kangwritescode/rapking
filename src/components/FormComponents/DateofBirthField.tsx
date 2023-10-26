import { FormHelperText, FormLabel, Stack, SxProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

interface DateofBirthFieldProps {
  control: Control<any>;
  errorMessage?: string;
  label?: string;
  sx?: SxProps;
}

function DateofBirthField({ control, errorMessage, label }: DateofBirthFieldProps) {
  return (
    <>
      <Controller
        name='dob'
        control={control}
        render={({ field: { value, onChange } }) => (
          <Stack marginBottom={3}>
            {label && <FormLabel sx={{ marginBottom: 1 }}>{label}</FormLabel>}
            <DatePicker
              format='MM-DD-YYYY'
              minDate={dayjs(new Date('1900-01-01'))}
              maxDate={dayjs().subtract(8, 'year')}
              value={value}
              onChange={onChange}
            />
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

export default DateofBirthField;
