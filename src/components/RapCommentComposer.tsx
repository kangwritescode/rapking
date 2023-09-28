import { Box, useTheme } from '@mui/material'
import React from 'react'
import RapCommentTextEditor from './RapCommentTextEditor'
import { api } from 'src/utils/api';
import { CDN_URL } from 'src/shared/constants';

function RapCommentComposer() {

  const theme = useTheme();
  const { data: userData } = api.user.getCurrentUser.useQuery();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.grey[300]}`,
        boxShadow: '1px 1px 14px 0px rgba(255, 255, 255, 0.15)',
      }}>
      <Box px={4} pt={3} display="flex" alignItems='center'>
        <Box
          component='img'
          width='35px'
          height='35px'
          borderRadius='100px'
          position='relative'
          marginRight={theme.spacing(3)}
          sx={{
            cursor: 'pointer',
          }}
          src={userData?.profileImageUrl ?
            `${CDN_URL}/${userData.profileImageUrl}` :
            `${CDN_URL}/default/profile-male-default.jpg`}
        />
        {userData?.username}
      </Box>
      <RapCommentTextEditor />
    </Box>
  )
}

export default RapCommentComposer
