import { Icon } from '@iconify/react';
import { Dialog, DialogContent, DialogTitle, Divider, IconButton } from '@mui/material';
import { User } from '@prisma/client';
import { Fragment, useEffect, useState } from 'react';
import { api } from 'src/utils/api';
import FollowCard from '../FollowCard/FollowCard';

interface FollowersModalProps {
  isOpen: boolean;
  handleClose: () => void;
  followedUser?: Partial<User> | null;
  followingUser?: Partial<User> | null;
}

function FollowersModal({ isOpen, handleClose, followedUser, followingUser }: FollowersModalProps) {
  const [user, setUser] = useState<Partial<User> | null | undefined>();
  const { data: userFollowers } = api.userFollows.getUserFollowers.useQuery(
    { userId: followedUser?.id || '' },
    {
      enabled: !!followedUser?.id
    }
  );
  useEffect(() => {
    if (followedUser || followingUser) {
      setUser(followedUser || followingUser);
    }
  }, [followedUser, followingUser]);

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <IconButton
        onClick={() => handleClose()}
        sx={{
          position: 'absolute',
          left: 2,
          top: 8
        }}
      >
        <Icon icon='ph:x' />
      </IconButton>
      <DialogTitle display='flex' justifyContent='center' alignItems='center' sx={{ p: 3 }}>
        {`${user?.username}'s followers`}
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          pt: 0,
          height: {
            xs: '100vh',
            md: 'unset'
          },
          minHeight: '20rem',
          minWidth: {
            sm: '25rem'
          }
        }}
      >
        {userFollowers?.map((user, i) => (
          <Fragment key={user.id}>
            {i === 0 ? null : <Divider />}
            <FollowCard
              userData={user}
              onCardClick={() => {
                handleClose();
              }}
            />
            {i === userFollowers.length - 1 ? <Divider /> : null}
          </Fragment>
        ))}
      </DialogContent>
    </Dialog>
  );
}

export default FollowersModal;
