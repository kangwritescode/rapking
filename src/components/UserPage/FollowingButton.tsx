import { Icon } from '@iconify/react';
import { Box, Button, CircularProgress, Menu, MenuItem, Typography } from '@mui/material';
import React, { useState } from 'react';

interface FollowingButtonProps {
  unfollowClickHandler?: () => void;
  isLoading?: boolean;
}

function FollowingButton({ unfollowClickHandler, isLoading }: FollowingButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        variant={'outlined'}
        color='secondary'
        onClick={handleClick}
        {...(!isLoading ? { endIcon: <Icon icon='basil:caret-down-solid' /> } : {})}
        sx={{ minWidth: '10rem' }}
      >
        {isLoading ? <CircularProgress color='inherit' size='1.5rem' /> : 'FOLLOWING'}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            unfollowClickHandler && unfollowClickHandler();
          }}
          sx={{
            width: '10rem',
            textAlign: 'center'
          }}
        >
          <Typography
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            color={theme => theme.palette.grey[300]}
            variant='button'
          >
            <Icon icon='ri:user-unfollow-line' /> &nbsp; UNFOLLOW
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default FollowingButton;
