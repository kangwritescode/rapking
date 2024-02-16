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
  title?: string;
}

function FollowersModal({
  isOpen,
  handleClose,
  followedUser,
  followingUser,
  title
}: FollowersModalProps) {
  const [user, setUser] = useState<Partial<User> | null | undefined>();
  const { data: userFollowers } = api.userFollows.getUserFollowers.useQuery(
    { userId: followedUser?.id || '' },
    {
      enabled: !!followedUser?.id
    }
  );
  const { data: userFollowing } = api.userFollows.getUserFollowing.useQuery(
    { userId: followingUser?.id || '' },
    {
      enabled: !!followingUser?.id
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
        {`${user?.username}'s ${title ? title : 'followers'}`}
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          pt: 0,
          px: 4,
          height: {
            xs: '100vh',
            md: '30rem'
          },
          overflowY: 'auto',
          minHeight: '20rem',
          minWidth: {
            sm: '26rem'
          }
        }}
      >
        {(userFollowers || userFollowing || []).map((user, i) => (
          <Fragment key={user.id}>
            {i === 0 ? null : <Divider />}
            <FollowCard
              userData={user}
              onCardClick={() => {
                handleClose();
              }}
            />
          </Fragment>
        ))}
      </DialogContent>
    </Dialog>
  );
}

export default FollowersModal;
