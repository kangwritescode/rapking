import { Button, Stack } from '@mui/material';
import { Rap } from '@prisma/client';
import React from 'react';

interface WriteHeaderProps {
  disabled: boolean;
  onClickHandler: () => void;
  rapData?: Rap | null;
}

function WriteHeader({ rapData, onClickHandler, disabled }: WriteHeaderProps) {
  return (
    <Stack direction='row' justifyContent='flex-end' pb='1rem'>
      <Button onClick={onClickHandler} size='medium' variant='contained' disabled={disabled}>
        {rapData ? 'Update Rap' : 'Create Rap'}
      </Button>
    </Stack>
  );
}

export default WriteHeader;
