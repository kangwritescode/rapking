import { Box, Button, FormLabel, Stack, SxProps, TextField, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon';

interface TitleSettingsBarProps {
  sx?: SxProps
  onClick?: () => void
  onTitleChange?: (title: string) => void
}

function TitleSettingsBar({ sx, onClick, onTitleChange }: TitleSettingsBarProps) {

  const theme = useTheme();

  const [title, setTitle] = useState('')

  useEffect(() => {
    if (onTitleChange) {
      onTitleChange(title)
    }
  }, [title, onTitleChange])

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
          onChange={(e) => setTitle(e.target.value)}
          value={title} />
      </Stack>
      <Stack pl='1rem'>
        <FormLabel>
          Settings
        </FormLabel>
        <Stack
          direction='row'>
          <Button
            onClick={onClick}
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
