import React from 'react'
import { Box, Stack, Avatar, Typography, SxProps, IconButton } from '@mui/material'
import TipTapContent from 'src/pages/rap/TipTapContent'
import { RapComment, User } from '@prisma/client'
import { CDN_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';
import { Icon } from '@iconify/react';

interface RapCommentProps {
  comment: RapComment & {
    user: User;
  },
  sx?: SxProps;
}

function RapComment({ comment, sx }: RapCommentProps) {
  const { content, user, createdAt } = comment;

  const { data: commentLikes } = api.commentVote.getCommentLikes.useQuery({ commentId: comment?.id as string }, {
    enabled: !!comment?.id
  });
  const { data: currentUser } = api.user.getCurrentUser.useQuery();

  // Mutations
  const { mutate: createCommentVote } = api.commentVote.createCommentVote.useMutation();
  const { mutate: deleteCommentVote } = api.commentVote.deleteCommentVote.useMutation();

  // Invalidaters
  const { invalidate: invalidateCommentLikes } = api.useContext().commentVote.getCommentLikes;

  // Like Logic
  let currentUserLikedComment = false;
  if (currentUser) {
    currentUserLikedComment = !!commentLikes?.find(comment => comment.userId === currentUser.id && comment.type === 'LIKE');
  }

  const likeRap = () => {
    if (currentUser && comment && currentUser) {
      createCommentVote({
        commentId: comment?.id as string,
        userId: currentUser.id,
        type: 'LIKE'
      }, {
        onSuccess: () => {
          invalidateCommentLikes(
            {
              commentId: comment?.id as string,
            },
          )
        }
      })
    }
  }

  const unlikeRap = () => {
    if (currentUser && comment && currentUser) {
      deleteCommentVote({
        commentId: comment?.id as string,
        userId: currentUser.id,
      }, {
        onSuccess: () => {
          invalidateCommentLikes(
            {
              commentId: comment?.id as string,
            },
          )
        }
      })
    }
  }

  return (
    <Box
      sx={sx}
    >
      <Stack direction="row">
        <Avatar
          {...(user?.profileImageUrl && {
            src: `${CDN_URL}/${user.profileImageUrl}`,
          })}
          sx={{
            mr: 3,
          }}
        />
        <Stack>
          <Typography variant="body1" fontSize={14}>
            {user.username}
          </Typography>
          <Typography variant="body2">
            {createdAt.toLocaleDateString()}
          </Typography>
        </Stack>
      </Stack>
      <TipTapContent
        content={content}
        sx={{
          fontSize: 14,
        }}
      />
      <Box sx={{
        ml: -1,
        display: 'flex',
      }}>
        <IconButton
          sx={{
            paddingRight: 1,
            py: 0,
            pl: 0,
          }}
          onClick={currentUserLikedComment ? unlikeRap : likeRap}
        >
          <Icon
            {...(currentUserLikedComment ? { color: 'orange' } : {})}
            icon='mdi:fire'
          />
        </IconButton>
        {commentLikes?.length || 0}
      </Box>
    </Box>
  )
}

export default RapComment
