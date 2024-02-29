import { Stack, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { getFormattedDate } from 'src/@core/utils/get-formatted-date';
import { GetForumThreadPage } from 'src/server/api/routers/thread';
import UserAvatar from '../UserAvatar';

interface DiscussionCardProps {
  forumThread: GetForumThreadPage;
}

function DiscussionCard({ forumThread }: DiscussionCardProps) {
  const theme = useTheme();

  const lastComment = forumThread.thread.threadComments.length
    ? forumThread.thread.threadComments[0]
    : null;

  return (
    <Link
      href={`/forum/${forumThread.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{
          p: '1rem',
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        }}
      >
        <Stack direction='row'>
          <UserAvatar
            url={forumThread.owner.profileImageUrl}
            size={40}
            borderRadius={1}
            sx={{
              mr: 4
            }}
          />
          <Stack>
            <Typography fontSize='.875rem' fontWeight='600'>
              {forumThread.title}
            </Typography>
            <Typography variant='caption'>
              Latest by {lastComment?.user.username} •{' '}
              {getFormattedDate(lastComment?.createdAt || new Date())}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          sx={{
            height: 40,
            px: 2,
            borderRadius: 1
          }}
          alignItems='center'
          justifyContent='center'
        >
          <Typography variant='caption' fontSize='.675rem' fontWeight={600}>
            Replies
          </Typography>
          <Typography>{Math.max(forumThread.thread.commentsCount - 1, 0)}</Typography>
        </Stack>
      </Stack>
    </Link>
  );
}

export default DiscussionCard;
