// ** MUI Components
import Typography from '@mui/material/Typography';

// ** Third Party Imports

// ** Icon Imports
import { Stack, SxProps } from '@mui/material';
import { User } from '@prisma/client';
import { useState } from 'react';
import { api } from 'src/utils/api';
import FollowersModal from '../FollowersModal/FollowersModal';

interface ProfileCardStatsProps {
  userData?: Partial<User> | null;
  sx?: SxProps;
}

function Stat({
  label,
  value,
  onClick,
  sx
}: {
  label: string;
  value: number | string;
  onClick?: () => void;
  sx?: SxProps;
}) {
  return (
    <Stack
      sx={{
        alignItems: 'left',
        ...sx,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <Typography {...(onClick ? { color: 'secondary.main' } : {})} variant='caption'>
        {label}
      </Typography>
      <Typography
        {...(onClick ? { color: 'secondary.main' } : {})}
        fontFamily='impact'
        fontSize='1.75rem'
        lineHeight='1.75rem'
      >
        {value}
      </Typography>
    </Stack>
  );
}

function ProfileCardStats({ userData, sx }: ProfileCardStatsProps) {
  const [followingUser, setFollowingUser] = useState<Partial<User> | null>();
  const [followedUser, setFollowedUser] = useState<Partial<User> | null>();

  const { data: userFollowersCount } = api.userFollows.getFollowersCount.useQuery(
    { userId: userData?.id || '' },
    {
      enabled: !!userData?.id
    }
  );

  const { data: userFollowingCount } = api.userFollows.getFollowingCount.useQuery(
    { userId: userData?.id || '' },
    {
      enabled: !!userData?.id
    }
  );

  return (
    <>
      <Stack
        direction='row'
        sx={{
          display: 'flex',
          ...sx
        }}
      >
        <Stat
          label='Followers'
          value={userFollowersCount || 0}
          onClick={() => setFollowedUser(userData)}
          sx={{
            mr: 8
          }}
        />
        <Stat
          label='Following'
          value={userFollowingCount || 0}
          onClick={() => setFollowingUser(userData)}
          sx={{
            mr: 8
          }}
        />
        <Stat label='Points' value={userData?.points || 0} />
      </Stack>
      <FollowersModal
        isOpen={!!followedUser || !!followingUser}
        followedUser={followedUser}
        followingUser={followingUser}
        handleClose={() => {
          setFollowedUser(undefined);
          setFollowingUser(undefined);
        }}
        title={followedUser ? 'followers' : 'following'}
      />
    </>
  );
}

export default ProfileCardStats;
