import { Icon } from '@iconify/react'
import { Box, Button, CircularProgress, Menu, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'

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
        color={'inherit'}
        onClick={handleClick}
        {...(!isLoading ? { endIcon: <Icon icon='basil:caret-down-solid' /> } : {})}
        sx={{ minWidth: '10rem' }}
      >
        {
          isLoading ? <CircularProgress color='inherit' size='1.5rem' /> : 'FOLLOWING'
        }
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose()
            unfollowClickHandler && unfollowClickHandler()
          }}>
          <Typography variant="button">
            UNFOLLOW
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default FollowingButton
