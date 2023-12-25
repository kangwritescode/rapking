import { Icon } from '@iconify/react';
import { Button, Dialog, IconButton, Stack, SxProps } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface LandingMobileNavProps {
  onForumClick?: () => void;
  sx?: SxProps;
}

function LandingMobileNav({ onForumClick, sx }: LandingMobileNavProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const menuItems = [
    { text: 'Explore', path: '/explore' },
    { text: 'Write', path: '/write' },
    { text: 'Leaderboard', path: '/leaderboard' },
    { text: 'Forum', path: '/forum' }
  ];

  const router = useRouter();

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: 'unset',
          ...sx
        }}
      >
        <Icon icon='mdi:hamburger-menu' fontSize='1.5rem' />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullScreen>
        <Stack
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: 'background.paper',
            display: 'flex'
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              zIndex: 10
            }}
          >
            <Icon icon='mdi:close' fontSize='3rem' />
          </IconButton>
          {menuItems.map(item => {
            const onClick = item.text === 'Forum' ? onForumClick : () => router.push(item.path);

            return (
              <Stack sx={{ flexGrow: 1 }} key={item.text} justifyContent='center'>
                <Button
                  onClick={onClick}
                  sx={{
                    textTransform: 'none',
                    fontFamily: 'impact',
                    color: 'grey.300',
                    fontSize: '2.5rem',
                    height: '100%'
                  }}
                >
                  {item.text}
                </Button>
              </Stack>
            );
          })}
        </Stack>
      </Dialog>
    </>
  );
}

export default LandingMobileNav;
