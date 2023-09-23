import { Icon } from '@iconify/react';
import { Box, CircularProgress, TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { Control, Controller } from 'react-hook-form';
import { useDebounce } from 'src/pages/create-profile/utils';
import { api } from 'src/utils/api';

interface UsernameAvailabilityFieldProps {
  control: Control<{
    username: string;
  }>,
  initialUsername?: string | null,
  errors?: { [key: string]: any },
  availabilityChangedHandler?: (isAvailable: boolean | undefined) => void
}

function UsernameAvailabilityField({
  control,
  initialUsername,
  errors,
  availabilityChangedHandler
}: UsernameAvailabilityFieldProps) {

  const [value, setValue] = React.useState<string>(initialUsername || '');
  const [usernameIsAvailable, setUsernameIsAvailable] = React.useState<boolean | undefined>(undefined);
  const debouncedValue = useDebounce(value, 500);

  // queries
  const { data, status } = api.user.usernameIsAvailable.useQuery({
    text: debouncedValue
  }, { enabled: debouncedValue.length > 2 })

  useEffect(() => {
    if (data) {
      setUsernameIsAvailable(data.isAvailable)
    }
  }, [data])

  useEffect(() => {
    if (availabilityChangedHandler) {
      availabilityChangedHandler(usernameIsAvailable)
    }
  }, [usernameIsAvailable, availabilityChangedHandler])


  return (
    <Controller
      name='username'
      control={control}
      render={({ field: { value, onChange } }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              value={value}
              label='Username'
              onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
                const formattedInput = value
                  .replace(/ /g, '_')             // replace spaces with underscores
                  .replace(/[^a-zA-Z0-9_]/g, '')  // remove non-alphanumeric characters
                  .toLowerCase();                 // convert to lowercase
                setValue(formattedInput)
                setUsernameIsAvailable(undefined)
                onChange(formattedInput)
              }}
              size='small'
              error={Boolean(errors?.username)}
              aria-describedby='stepper-username'
              inputProps={{ maxLength: 20 }}
              sx={{ mr: 3 }}
            />
            {(status === 'loading' && value && value.length > 2 && usernameIsAvailable === undefined) ? (
              <CircularProgress color='secondary' size={24} />
            ) : undefined}
            {usernameIsAvailable && (
              <Icon color='green' icon="material-symbols:check-circle-rounded" width={24} />
            )}
            {usernameIsAvailable === false && (
              <Icon color='red' icon="ph:x-circle" width={24} />
            )}
          </Box>
        )
      }} />
  )
}

export default UsernameAvailabilityField
