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
          size={38}
          sx={{
            mr: 3
          }}
          borderRadius={1}
        />
        <Typography fontSize='1rem' fontWeight='600'>
          {comment.user.username}
        </Typography>
      </Stack>
      <TipTapContent
        content={comment.content}
        sx={{
          fontSize: '.875rem'
        }}
      />
      <Typography mt='.5rem' fontSize='.75rem' color='text.secondary'>
        {displayedDate}
      </Typography>
    </Stack>
  );
}

export default ForumThreadComment;
