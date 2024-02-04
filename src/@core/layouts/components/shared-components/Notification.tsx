import { Box, Typography, TypographyProps, styled } from '@mui/material';
import { htmlToText } from 'html-to-text';
import { useRouter } from 'next/router';
import CustomAvatar from 'src/@core/components/mui/avatar';
import { CustomAvatarProps } from 'src/@core/components/mui/avatar/types';
import { getFormattedDate } from 'src/@core/utils/get-formatted-date';
import { getInitials } from 'src/@core/utils/get-initials';
import { NotificationWithAssociatedData } from 'src/server/api/routers/notifications';
import { BUCKET_URL } from 'src/shared/constants';
import { StyledMenuItem } from './NotificationDropdown';

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}));

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
});

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<CustomAvatarProps>({
  width: 38,
  height: 38,
  fontSize: '1.125rem'
});

const RenderAvatar = ({ notification }: { notification: NotificationWithAssociatedData }) => {
  const { notifierUser, type } = notification;

  if ((type === 'RAP_COMMENT' || type === 'FOLLOW') && notifierUser?.profileImageUrl) {
    return (
      <Avatar alt='notification-avatar' src={`${BUCKET_URL}/${notifierUser.profileImageUrl}`} />
    );
  }

  return (
    <Avatar skin='light' color='info'>
      {getInitials(notifierUser?.username as string)}
    </Avatar>
  );
};

interface NotificationProps {
  notification: NotificationWithAssociatedData;
  closeDropdown: () => void;
}

function Notification({ notification, closeDropdown }: NotificationProps) {
  const router = useRouter();

  let title = '';
  if (notification.type === 'RAP_COMMENT') {
    title = `${notification.notifierUser?.username} commented on ${notification.rap?.title}`;
  } else if (notification.type === 'FOLLOW') {
    title = `${notification.notifierUser?.username} is now following you`;
  } else if (notification.type === 'FOLLOWED_USER_RAP') {
    title = `${notification.notifierUser?.username} published a new rap!`;
  }
  let subtitle = '';
  if (notification.type === 'RAP_COMMENT') {
    subtitle = notification.comment ? htmlToText(notification.comment.content) : '';
  }

  const notificationDate = getFormattedDate(notification.createdAt);

  const onClickHandler = async () => {
    closeDropdown();
    if (notification.type === 'RAP_COMMENT') {
      router.push(`/rap/${notification.rap?.id}/?commentId=${notification.comment?.id}`);
    } else if (notification.type === 'FOLLOW') {
      router.push(`/u/${notification.notifierUser?.username}`);
    } else if (notification.type === 'FOLLOWED_USER_RAP') {
      router.push(`/rap/${notification.rap?.id}`);
    }
  };

  return (
    <StyledMenuItem key={notification.id} onClick={onClickHandler}>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <RenderAvatar notification={notification} />
        <Box
          sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}
        >
          <MenuItemTitle>{title}</MenuItemTitle>
          <MenuItemSubtitle variant='body2'>{subtitle}</MenuItemSubtitle>
        </Box>
        <Typography variant='caption' sx={{ color: 'text.disabled' }}>
          {notificationDate}
        </Typography>
      </Box>
    </StyledMenuItem>
  );
}

export default Notification;
