import { Box, IconButton, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { Rap, User } from '@prisma/client'
import RapCommentDrawer from 'src/components/RapCommentDrawer'
import RapLikeButton from './RapLikeButton'
import { api } from 'src/utils/api'
import { useRouter } from 'next/router'

interface RapBarProps {
  rapData?: (Rap & {
    user?: User;
  }) | null;
}

function RapBar({ rapData }: RapBarProps) {

  const theme = useTheme();

  // Queries
  const { data: rapCommentsCount } = api.rapComment.getRapCommentsCount.useQuery({
    rapId: rapData?.id as string
  }, {
    enabled: !!rapData?.id
  });

  const { commentId } = useRouter().query;

  // State
  const [commentDrawerIsOpen, setCommentDrawerIsOpen] = useState<boolean>(!!commentId);

  return (
    <>
      <RapCommentDrawer
        isOpen={commentDrawerIsOpen}
        onCloseHandler={() => setCommentDrawerIsOpen(false)}
        rapId={rapData?.id as string}
      />
      <Box display="flex">
        <RapLikeButton rapId={rapData?.id} />
        <Box sx={{
          ml: theme.spacing(5),
          display: 'flex',
          alignItems: 'center'
        }}>
          <IconButton
            onClick={() => setCommentDrawerIsOpen(true)}
            sx={{
              pr: 1
            }}>
            <Icon icon='prime:comment' />
          </IconButton>
          {rapCommentsCount || 0}
        </Box>
      </Box>
    </>
  )
}

export default RapBar
