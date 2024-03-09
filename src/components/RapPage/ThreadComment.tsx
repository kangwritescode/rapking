import { Avatar, Box, Stack, SxProps, Typography } from '@mui/material';
import { ThreadComment, ThreadType, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { getFormattedDate, getFormattedTime } from 'src/@core/utils/get-formatted-date';
import CommentLikeButton from 'src/components/RapPage/CommentLikeButton';
import TipTapContent from 'src/components/TipTapContent';
import { BUCKET_URL } from 'src/shared/constants';
import TextButton from '../TextButton';
import ThreadCommentMenu from './ThreadCommentMenu';

interface ThreadCommentProps {
  comment: ThreadComment & {
    user: Partial<User>;
  };
  sx?: SxProps;
  threadType?: ThreadType;
  forumThreadId?: string;
  onReply?: (userData: Partial<User>) => void;
}

function ThreadComment({ comment, sx, threadType, forumThreadId, onReply }: ThreadCommentProps) {
  const session = useSession();
  const { content, user } = comment;

  const isCurrentUsersComment = session.data?.user?.id === user.id;

  const formattedDate = getFormattedDate(comment.createdAt || new Date());
  let displayedDate = formattedDate;

  if (formattedDate === 'Today' || formattedDate === 'Yesterday') {
    displayedDate = formattedDate + ' at ' + getFormattedTime(comment.createdAt || new Date());
  }

  return (
    <Box sx={sx}>
      <Stack direction='row' position='relative'>
        <Link href={`/u/${user.username}`} passHref style={{ textDecoration: 'none' }}>
          <Avatar
            {...(user?.profileImageUrl && {
              src: `${BUCKET_URL}/${user.profileImageUrl}`
            })}
            sx={{
              mr: 3
            }}
          />
        </Link>
        <Stack>
          <Link
            href={`/u/${user.username}`}
            passHref
            style={{
              textDecoration: 'none'
            }}
          >
            <Typography variant='body1' fontSize={14}>
              {user.username}
            </Typography>
          </Link>
          <Typography variant='body2'>{displayedDate}</Typography>
        </Stack>
        <Stack justifyContent='flex-end' direction='row' flexGrow='1'>
          <ThreadCommentMenu
            isCurrentUsersComment={isCurrentUsersComment}
            commentData={comment}
            threadType={threadType}
            forumThreadId={forumThreadId}
          />
        </Stack>
      </Stack>
      <TipTapContent
        content={content}
        sx={{
          fontSize: 14
        }}
      />
      <Stack direction='row' alignItems='center' justifyContent='space-between' mt={4}>
        <Stack direction='row' alignItems='center'>
          {onReply && !isCurrentUsersComment ? (
            <TextButton
              sx={{
                mr: 4
              }}
              onClick={() => onReply?.({ username: user.username, id: user.id })}
              disabled={isCurrentUsersComment}
            >
              Reply
            </TextButton>
          ) : null}
          <CommentLikeButton threadCommentId={comment.id} />
        </Stack>
      </Stack>
    </Box>
  );
}

export default ThreadComment;
