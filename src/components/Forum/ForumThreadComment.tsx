import { Stack, Typography } from '@mui/material';
import { getFormattedDate, getFormattedTime } from 'src/@core/utils/get-formatted-date';
import { ThreadCommentWithUserData } from 'src/server/api/routers/thread';
import TipTapContent from '../TipTapContent';
import UserAvatar from '../UserAvatar';

interface ForumThreadCommentProps {
  comment: ThreadCommentWithUserData;
}

function ForumThreadComment({ comment }: ForumThreadCommentProps) {
  const formattedDate = getFormattedDate(comment.createdAt || new Date());
  let displayedDate = formattedDate;

  if (formattedDate === 'Today' || formattedDate === 'Yesterday') {
    displayedDate = formattedDate + ' at ' + getFormattedTime(comment.createdAt || new Date());
  }

  return (
    <Stack>
      <Stack direction='row' alignItems='top'>
        <UserAvatar
          url={comment.user.profileImageUrl}
          size={40}
          sx={{
            mr: 3
          }}
        />
        <Stack>
          <Typography fontSize='.875rem' fontWeight='600'>
            {comment.user.username}
          </Typography>
          <Typography variant='caption'>{displayedDate}</Typography>
        </Stack>
      </Stack>
      <TipTapContent
        content={comment.content}
        sx={{
          fontSize: '.875rem'
        }}
      />
    </Stack>
  );
}

export default ForumThreadComment;
