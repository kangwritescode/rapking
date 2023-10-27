import { Button, Stack, SxProps } from '@mui/material';
import { Rap } from '@prisma/client';

interface WriteHeaderProps {
  disabled: boolean;
  onClickHandler: () => void;
  rapData?: Rap | null;
  sx?: SxProps;
}

function WriteHeader({ rapData, onClickHandler, disabled, sx }: WriteHeaderProps) {
  return (
    <Stack direction='row' justifyContent='flex-end' pb='1rem' sx={{ ...sx }}>
      <Button onClick={onClickHandler} size='medium' variant='contained' disabled={disabled}>
        {rapData ? 'Update Rap' : 'Create Rap'}
      </Button>
    </Stack>
  );
}

export default WriteHeader;
