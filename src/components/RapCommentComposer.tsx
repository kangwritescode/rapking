import { Avatar, Box, useTheme } from '@mui/material'
import React from 'react'
import RapCommentTextEditor from './RapCommentTextEditor'
import { api } from 'src/utils/api';
import { CDN_URL } from 'src/shared/constants';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface RapCommentComposerProps {
  rapId?: string;
}

function RapCommentComposer({ rapId }: RapCommentComposerProps) {

  const theme = useTheme();
  const { data: userData } = api.user.getCurrentUser.useQuery();
  const { mutate: postComment } = api.rapComment.postComment.useMutation();

  const submitFormHandler = (formValues: { content: string }) => {
    if (userData && formValues.content && rapId) {
      postComment({
        userId: userData.id,
        rapId,
        content: formValues.content
      }, {
        onSuccess: () => {
          console.log('success')
        }
      })
    }
  }

  const {
    control,
    formState: {
      isValid,
      isSubmitting
    },
    handleSubmit
  } = useForm({
    defaultValues: { content: '' },

    resolver: zodResolver(z.object({
      content: z.string().min(1).max(500)
    }))
  })

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.grey[300]}`,
        boxShadow: '1px 1px 14px 0px rgba(255, 255, 255, 0.15)',
      }}>
      <Box px={4} pt={3} display="flex" alignItems='center'>
        <Avatar
          sx={{
            cursor: 'pointer',
            width: 35,
            height: 35,
            position: 'relative',
            marginRight: theme.spacing(2),
          }}
          src={userData?.profileImageUrl ?
            `${CDN_URL}/${userData.profileImageUrl}` :
            `${CDN_URL}/default/profile-male-default.jpg`}
        />
        {userData?.username}
      </Box>
      <form onSubmit={handleSubmit(submitFormHandler)}>
        <Controller
          name='content'
          control={control}
          render={({ field: { value, onChange } }) => (
            <RapCommentTextEditor
              onChange={onChange}
              content={value}
              submitButtonIsDisabled={!isValid || isSubmitting}
            />
          )}
        />
      </form>
    </Box>
  )
}

export default RapCommentComposer
