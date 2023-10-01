import React from 'react'
import { Box, Stack, Avatar, Typography, SxProps } from '@mui/material'
import TipTapContent from 'src/pages/rap/TipTapContent'
import { RapComment, User } from '@prisma/client'
import { CDN_URL } from 'src/shared/constants';

interface RapCommentProps {
  comment: RapComment & {
    user: User;
  },
  sx?: SxProps;
}

function RapComment({ comment, sx }: RapCommentProps) {
  const { content, user, createdAt } = comment;

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
        }} />
    </Box>
  )
}

export default RapComment
