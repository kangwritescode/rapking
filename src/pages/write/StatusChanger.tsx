import { Button, Chip, Divider, Popover, Stack, SxProps, Typography } from '@mui/material'
import { RapStatus } from '@prisma/client';
import React from 'react'
import { toast } from 'react-hot-toast';
import { api } from 'src/utils/api';

interface StatusChangerProps {
  status: RapStatus;
  sx?: SxProps;
  rapId: string;
}

function StatusChanger({ status, sx, rapId }: StatusChangerProps) {

  const utils = api.useContext();

  const { mutate: updateRap } = api.rap.updateRap.useMutation()

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const updateStatusHandler = (status: RapStatus) => {
    updateRap({
      id: rapId,
      status
    }, {
      onError: (error: any) => {
        console.log(error)
        toast.error(error.message, {
          position: 'bottom-left',
        })
      },
      onSuccess: () => {
        utils.rap.getRap.invalidate()
        toast.success('Updated Rap!', {
          position: 'bottom-left',
        })
      }
    })
  }

  return (
    <>
      <Chip
        label={status}
        size='small'
        sx={{ width: 'fit-content', ...sx }}
        color={status === 'DRAFT' ? 'error' : 'success'}
        onClick={handleClick}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Stack>
          <Button
            color='error'
            onClick={() => {
              updateStatusHandler('DRAFT')
              handleClose()
            }}>
            <Typography>Draft</Typography>
          </Button>
          <Divider />
          <Button
            color='success'
            onClick={() => {
              updateStatusHandler('PUBLISHED')
              handleClose()
            }}>
            <Typography>Published</Typography>
          </Button>
        </Stack>
      </Popover></>
  )
}

export default StatusChanger
