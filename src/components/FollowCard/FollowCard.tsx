import { Avatar, Stack, Typography } from '@mui/material';
import { User } from '@prisma/client';
import Link from 'next/link';
import { BUCKET_URL } from 'src/shared/constants';

interface FollowCardProps {
  userData?: Partial<User> | null;
  onCardClick?: () => void;
}

function FollowCard({ userData, onCardClick }: FollowCardProps) {
  const { profileImageUrl, username } = userData || {};
  const linkClickHandler = () => {
    if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <>
      <Link
        onClick={linkClickHandler}
        href={username ? `/u/${username}` : '/'}
        style={{
          textDecoration: 'none'
        }}
      >
        <Stack
          py='.25rem'
          sx={theme => ({
            '&:hover': {
              backgroundColor: theme.palette.grey[900]
            }
          })}
        >
          <Stack direction='row' alignItems='center' spacing={2} sx={{ p: 2 }}>
            <Avatar
              {...(profileImageUrl && { src: `${BUCKET_URL}/${profileImageUrl}` })}
              alt='profile-picture'
              sx={{
                ml: '.25rem',
                mr: '.5rem',
                width: 30,
                height: 30,
                position: 'relative'
              }}
            />
            <Typography variant='body1'>{username}</Typography>
          </Stack>
        </Stack>
      </Link>
    </>
  );
}

export default FollowCard;
