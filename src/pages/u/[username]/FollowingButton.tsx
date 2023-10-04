import { Icon } from '@iconify/react'
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'

interface FollowingButtonProps {
  unfollowClickHandler?: () => void;
}

function FollowingButton({ unfollowClickHandler }: FollowingButtonProps) {

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
        endIcon={
          <Icon icon='basil:caret-down-solid' />
        }
      >
        {'Following'}
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
