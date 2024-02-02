import { Icon } from '@iconify/react';
import { Box, CircularProgress, SxProps, TextField, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useDebounce } from 'src/shared/utils';
import { api } from 'src/utils/api';

interface UsernameAvailabilityFieldProps {
  control: Control<any>;
  initialUsername?: string | null;
  errorMessage?: string;
  availabilityChangedHandler?: (isAvailable: boolean | undefined) => void;
  label?: string;
  sx?: SxProps;
}

function UsernameAvailabilityField({
  control,
  initialUsername,
  errorMessage,
  availabilityChangedHandler,
  label,
  sx
}: UsernameAvailabilityFieldProps) {
  const [value, setValue] = useState<string>(initialUsername || '');
  const [usernameIsAvailable, setUsernameIsAvailable] = useState<boolean | undefined>(undefined);
  const debouncedValue = useDebounce(value, 500);

  // queries
  const { data, status } = api.user.usernameIsAvailable.useQuery(
    {
      text: debouncedValue
    },
    { enabled: debouncedValue.length > 2 }
  );

  useEffect(() => {
    if (data) {
      setUsernameIsAvailable(data.isAvailable);
    }
  }, [data]);

  useEffect(() => {
    if (availabilityChangedHandler) {
      availabilityChangedHandler(usernameIsAvailable);
    }
  }, [usernameIsAvailable, availabilityChangedHandler]);

  const theme = useTheme();

  return (
    <>
      <Typography
        sx={{
          mb: theme.spacing(1)
        }}
      >
        Username
      </Typography>
      <Controller
        name='username'
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
              <TextField
                value={value}
                {...(label ? { label: label } : undefined)}
                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
                  const formattedInput = value
                    .replace(/ /g, '_') // replace spaces with underscores
                    .replace(/[^a-zA-Z0-9_]/g, '') // remove non-alphanumeric characters
                    .toLowerCase(); // convert to lowercase
                  setValue(formattedInput);
                  setUsernameIsAvailable(undefined);
                  onChange(formattedInput);
                }}
                size='small'
                error={Boolean(errorMessage)}
                aria-describedby='stepper-username'
                inputProps={{ maxLength: 20 }}
                sx={{ mr: 3 }}
              />
              {status === 'loading' &&
              value &&
              value.length > 2 &&
              usernameIsAvailable === undefined ? (
                <CircularProgress color='secondary' size={24} />
              ) : undefined}
              {usernameIsAvailable && (
                <Icon color='green' icon='material-symbols:check-circle-rounded' width={24} />
              )}
              {usernameIsAvailable === false && <Icon color='red' icon='ph:x-circle' width={24} />}
            </Box>
          );
        }}
      />
    </>
  );
}

export default UsernameAvailabilityField;
