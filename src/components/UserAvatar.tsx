import { Avatar, SxProps } from '@mui/material';
import { BUCKET_URL } from 'src/shared/constants';

interface UserAvatarProps {
  url?: string | null;
  size?: number;
  borderRadius?: number;
  sx?: SxProps;
}

function UserAvatar({ url, size = 120, borderRadius, sx }: UserAvatarProps) {
  return (
    <Avatar
      {...(url && { src: `${BUCKET_URL}/${url}` })}
      alt='profile-picture'
      sx={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: borderRadius ?? '50%',
        ...sx
      }}
    />
  );
}

export default UserAvatar;
