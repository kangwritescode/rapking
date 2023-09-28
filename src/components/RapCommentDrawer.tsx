import { Icon } from '@iconify/react';
import { Box, Drawer, IconButton, Typography, useTheme } from '@mui/material'
import { RapComment } from '@prisma/client';
import React from 'react'
import RapCommentComposer from './RapCommentComposer';

interface RapCommentDrawerProps {
  onCloseHandler: () => void;
  isOpen: boolean;
  rapComments?: RapComment[];
}

function RapCommentDrawer({ onCloseHandler, isOpen, rapComments }: RapCommentDrawerProps) {
  const theme = useTheme();

  return (
    <Drawer
      anchor='right'
      open={isOpen}
      onClose={onCloseHandler}
    >
      <Box
        width='24rem'
        maxWidth="100%"
        p={theme.spacing(6)}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            Comments {rapComments?.length ? `(${rapComments.length})` : ''}
          </Typography>
          <IconButton onClick={onCloseHandler}>
            <Icon icon="mdi:close" />
          </IconButton>
        </Box>
        <RapCommentComposer />
      </Box>
    </Drawer>
  )
}

export default RapCommentDrawer
