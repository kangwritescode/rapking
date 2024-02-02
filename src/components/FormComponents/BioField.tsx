import { Box, FormHelperText, SxProps, TextField, Typography } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

interface SexFieldProps {
  control: Control<any>;
  errorMessage?: string;
  sx?: SxProps;
}

function BioField({ control, errorMessage, sx }: SexFieldProps) {
  return (
    <Box sx={sx}>
      <Typography
        aria-label='bio'
        sx={{
          mb: 1
        }}
      >
        Bio
      </Typography>
      <Controller
        name='bio'
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            fullWidth
            sx={{ width: '100%' }}
            multiline
            placeholder='Add a bio.'
            error={errorMessage !== undefined}
            {...field}
          />
        )}
      />
      {errorMessage && (
        <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-dob'>
          {errorMessage}
        </FormHelperText>
      )}
    </Box>
  );
}

export default BioField;
