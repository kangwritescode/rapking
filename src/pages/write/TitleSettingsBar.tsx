import { Box, FormLabel, Stack, SxProps, TextField, useTheme } from '@mui/material'
import React from 'react'

interface TitleSettingsBarProps {
  sx?: SxProps
}

function TitleSettingsBar({ sx }: TitleSettingsBarProps) {

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
          fullWidth
          value='Pidgeons' />
      </Stack>
      <Stack>
        <FormLabel>
          Settings
        </FormLabel>
        <Stack direction='row'>

        </Stack>
      </Stack>
    </Box>
  )
}

export default TitleSettingsBar
