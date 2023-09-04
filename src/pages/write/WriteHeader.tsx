import { Icon } from '@iconify/react';
import { Button, Stack } from '@mui/material'
import { Rap } from '@prisma/client';
import React from 'react'

interface WriteHeaderProps {
  disabled: boolean;
  onClickHandler: () => void;
  rapData?: Rap;
}

function WriteHeader({
  rapData,
  onClickHandler,
  disabled
}: WriteHeaderProps) {
  return (
    <Stack
      direction='row'
      justifyContent='flex-end'
      pb='1rem'>
      {rapData && (
        <Button
          sx={{
            marginRight: '1rem',
            whiteSpace: 'nowrap'
          }}
          size='medium'
          variant='outlined'>
          <Icon icon='ic:baseline-settings' fontSize={20} />
        </Button>
      )}
      <Button
        onClick={onClickHandler}
        size='medium'
        variant='contained'
        disabled={disabled}>
        {rapData ? 'Update Rap' : 'Create Rap'}
      </Button>

    </Stack>
  )
}

export default WriteHeader
