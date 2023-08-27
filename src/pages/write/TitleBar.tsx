import { Box, FormLabel, Stack, SxProps, TextField, useTheme } from '@mui/material'
import React from 'react'
import { UseFormRegister } from 'react-hook-form';
import { RapEditorFormValues } from './RapEditor';

interface TitleBarProps {
  sx?: SxProps
  onClick?: () => void
  register?: UseFormRegister<RapEditorFormValues>
  submitButtonText?: string;
  isEditMode?: boolean;
}

function TitleBar(props: TitleBarProps) {

  const {
    sx,
    register,

    // isEditMode
  } = props

  const theme = useTheme();


  return (
    <Box
      display='flex'
      p='1rem 1rem 2rem'
      borderRadius={1}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        ...sx
      }}>
      <Stack width='100%'>
        <FormLabel>
          Title
        </FormLabel>
        <TextField
          {...register?.('title')}
          size='small'
          fullWidth
        />
      </Stack>
    </Box>
  )
}

export default TitleBar
