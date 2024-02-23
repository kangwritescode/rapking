import { Avatar } from '@mui/material';
import { BUCKET_URL } from 'src/shared/constants';

interface UserAvatarProps {
  url?: string | null;
  size?: number;
}

function UserAvatar({ url, size = 120 }: UserAvatarProps) {
  return (
    <Avatar
      {...(url && { src: `${BUCKET_URL}/${url}` })}
      alt='profile-picture'
      sx={{
        width: size,
        height: size,
        position: 'relative'
      }}
    />
  );
}

export default UserAvatar;
