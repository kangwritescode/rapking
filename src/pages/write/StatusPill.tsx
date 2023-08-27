import { Chip, SxProps } from '@mui/material'
import React from 'react'
import { RapStatus } from 'src/shared/schemas'

interface StatusPillProps {
  status: RapStatus;
  sx?: SxProps;
}

function StatusPill({ status, sx }: StatusPillProps) {
  return (
    <Chip
      label={status}
      size='small'
      sx={{ width: 'fit-content', ...sx }}
      color='default'
    />
  )
}

export default StatusPill
