import { Avatar, Box, Typography, TypographyProps, styled } from '@mui/material';
import { htmlToText } from 'html-to-text';
import { useRouter } from 'next/router';
import { getFormattedDate } from 'src/@core/utils/get-formatted-date';
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
const RenderAvatar = ({ notification }: { notification: NotificationWithAssociatedData }) => {
  const { notifierUser, type } = notification;

  const avatarUrl = '';

  if (type === 'RAP_COMMENT' || type === 'FOLLOW' || type === 'RAP_REVIEW') {
    return notifierUser?.profileImageUrl ? (
      <Avatar alt='notification-avatar' src={`${BUCKET_URL}/${notifierUser.profileImageUrl}`} />
    ) : (
      <Avatar alt='notification-avatar' />
    );
  } else if (
    type === 'FOLLOWED_USER_RAP' ||
    type === 'COLLABORATOR_ADDED' ||
    type === 'REVIEW_REQUEST_CREATED'
  ) {
    return notification.rap?.coverArtUrl ? (
      <Avatar alt='notification-avatar' src={`${BUCKET_URL}/${notification.rap.coverArtUrl}`} />
    ) : (
      <Avatar alt='notification-avatar' src={`${BUCKET_URL}/default/cover-art.jpg`} />
    );
  }

  if (avatarUrl) {
    return <Avatar alt='notification-avatar' src={avatarUrl} />;
  }

  return <Avatar alt='notification-avatar' />;
};

interface NotificationProps {
  notification: NotificationWithAssociatedData;
  closeDropdown: () => void;
}

function Notification({ notification, closeDropdown }: NotificationProps) {
  const router = useRouter();

  let title = '';
  if (notification.type === 'RAP_COMMENT') {
    title = `${notification.notifierUser?.username} commented on ${notification.rap?.title}'`;
  } else if (notification.type === 'FOLLOW') {
    title = `${notification.notifierUser?.username} is now following you`;
  } else if (notification.type === 'FOLLOWED_USER_RAP') {
    title = `${notification.notifierUser?.username} published a new rap!`;
  } else if (notification.type === 'WALL_COMMENT') {
    title = `${notification.notifierUser?.username} commented on your wall`;
  } else if (notification.type === 'RAP_REVIEW') {
    title = `${notification.notifierUser?.username} reviewed '${notification.rap?.title}'`;
  } else if (notification.type === 'COLLABORATOR_ADDED') {
    title = `${notification.notifierUser?.username} added you as a collaborator on '${notification.rap?.title}'`;
  } else if (notification.type === 'REVIEW_REQUEST_CREATED') {
    title = `${notification.notifierUser?.username} requested a review for '${notification.rap?.title}'`;
  } else if (notification.type === 'FORUM_MENTION') {
    title = `${notification.notifierUser?.username} mentioned you in a comment`;
  }
  let subtitle = '';
  if (
    notification.type === 'RAP_COMMENT' ||
    notification.type === 'WALL_COMMENT' ||
    notification.type === 'FORUM_MENTION'
  ) {
    subtitle = notification.threadComment ? htmlToText(notification.threadComment.content) : '';
  }

  const notificationDate = getFormattedDate(notification.createdAt);

  const onClickHandler = async () => {
    closeDropdown();
    if (notification.type === 'RAP_COMMENT') {
      router.push(`/rap/${notification.rap?.id}/?commentId=${notification.threadComment?.id}`);
    } else if (notification.type === 'FOLLOW') {
      router.push(`/u/${notification.notifierUser?.username}`);
    } else if (notification.type === 'FOLLOWED_USER_RAP') {
      router.push(`/rap/${notification.rap?.id}`);
    } else if (notification.type === 'RAP_REVIEW') {
      router.push(`/rap/${notification.rap?.id}`);
    } else if (notification.type === 'COLLABORATOR_ADDED') {
      router.push(`/rap/${notification.rap?.id}`);
    } else if (notification.type === 'REVIEW_REQUEST_CREATED') {
      router.push('/review-inbox');
    } else if (notification.type === 'FORUM_MENTION') {
      router.push(`/forum/${notification.forumThreadId}`);
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
