import { Box, IconButton, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { Rap, User } from '@prisma/client'
import RapCommentDrawer from 'src/components/RapCommentDrawer'
import LikeButton from './LikeButton'
import { api } from 'src/utils/api'

interface RapBarProps {
  rapData?: (Rap & {
    user?: User;
  }) | null;
}

function RapBar({ rapData }: RapBarProps) {

  const theme = useTheme();

  // Queries
  const { data: rapCommentsCount } = api.rapComment.rapCommentsCount.useQuery({
    rapId: rapData?.id as string
  }, {
    enabled: !!rapData?.id
  });

  // State
  const [commentDrawerIsOpen, setCommentDrawerIsOpen] = useState<boolean>(false);

  return (
    <>
      <RapCommentDrawer
        isOpen={commentDrawerIsOpen}
        onCloseHandler={() => setCommentDrawerIsOpen(false)}
        rapId={rapData?.id as string}
      />
      <Box display="flex">
       <LikeButton rapData={rapData} />
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
