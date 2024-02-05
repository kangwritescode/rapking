import { Avatar, Box, Stack, SxProps, Typography } from '@mui/material';
import { RapComment, User } from '@prisma/client';
import CommentLikeButton from 'src/components/RapPage/CommentLikeButton';
import TipTapContent from 'src/components/TipTapContent';
import { BUCKET_URL } from 'src/shared/constants';
import RapCommentMenu from './RapCommentMenu';

interface RapCommentProps {
  comment: RapComment & {
    user: Partial<User>;
  };
  sx?: SxProps;
}

function RapComment({ comment, sx }: RapCommentProps) {
  const { content, user, createdAt } = comment;

  return (
    <Box sx={sx}>
      <Stack direction='row' position='relative'>
        <Avatar
          {...(user?.profileImageUrl && {
            src: `${BUCKET_URL}/${user.profileImageUrl}`
          })}
          sx={{
            mr: 3
          }}
        />
        <Stack>
          <Typography variant='body1' fontSize={14}>
            {user.username}
          </Typography>
          <Typography variant='body2'>{createdAt.toLocaleDateString()}</Typography>
        </Stack>
        <Stack flexGrow={1} alignItems='flex-end'>
          <RapCommentMenu rapCommentId={comment.id} />
        </Stack>
      </Stack>
      <TipTapContent
        content={content}
        sx={{
          fontSize: 14
        }}
      />
      <CommentLikeButton rapCommentId={comment.id} sx={{ ml: -1 }} />
    </Box>
  );
}

export default RapComment;
