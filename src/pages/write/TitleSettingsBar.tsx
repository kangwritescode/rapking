import { Box, Button, FormLabel, Stack, SxProps, TextField, useTheme } from '@mui/material'
import React from 'react'
import Icon from 'src/@core/components/icon';

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
          size='small'
          fullWidth
          value='Pidgeons' />
      </Stack>
      <Stack pl='1rem'>
        <FormLabel>
          Settings
        </FormLabel>
        <Stack
          direction='row'>
          <Button
            size='medium'
            variant='contained'>
            Save
          </Button>
          <Button
            sx={{
              marginLeft: '1rem',
              whiteSpace: 'nowrap'
            }}
            size='medium'
            variant='contained'>
            <Icon icon='ic:baseline-settings' fontSize={20} />
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default TitleSettingsBar
