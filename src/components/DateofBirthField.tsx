import { FormHelperText, FormLabel, Stack, SxProps } from '@mui/material'
import { DateField } from '@mui/x-date-pickers'
import React from 'react'
import { Control, Controller } from 'react-hook-form'

interface DateofBirthFieldProps {
  control: Control<any>,
  errorMessage?: string,
  label?: string
  sx?: SxProps;
}

function DateofBirthField({
  control,
  errorMessage,
  label
}: DateofBirthFieldProps) {
  return (
    <>
      <Controller
        name='dob'
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Stack marginBottom={3}>
            {label && <FormLabel sx={{ marginBottom: -1 }}>{label}</FormLabel>}
            <DateField format="MM-DD-YYYY" value={value} onChange={onChange} size='small' />
          </Stack>
        )}
      />
      {
        errorMessage && (
          <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-dob'>
            {errorMessage}
          </FormHelperText>
        )
      }
    </>
  )
}

export default DateofBirthField
