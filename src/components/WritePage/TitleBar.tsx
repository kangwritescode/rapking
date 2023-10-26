import { Box, FormLabel, Stack, SxProps, TextField, Typography, useTheme } from '@mui/material';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { RapEditorFormValues } from './RapEditor';

interface TitleBarProps {
  sx?: SxProps;
  onClick?: () => void;
  register?: UseFormRegister<RapEditorFormValues>;
  errorMessage?: string;
}

function TitleBar(props: TitleBarProps) {
  const { sx, register, errorMessage } = props;

  const theme = useTheme();

  return (
    <Box
      display='flex'
      p='1rem 1rem 2rem'
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        ...sx
      }}
    >
      <Stack width='100%'>
        <FormLabel>Title</FormLabel>
        <TextField {...register?.('title')} size='small' fullWidth error={Boolean(errorMessage)} />
        {errorMessage && (
          <Typography variant='caption' color='error'>
            {errorMessage}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default TitleBar;
