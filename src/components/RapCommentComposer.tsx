import { Avatar, Box, useTheme } from '@mui/material'
import React from 'react'
import RapCommentTextEditor from './RapCommentTextEditor'
import { api } from 'src/utils/api';
import { CDN_URL } from 'src/shared/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useForm } from 'react-hook-form';

interface RapCommentComposerProps {
  rapId?: string;
}

function RapCommentComposer({ rapId }: RapCommentComposerProps) {

  const theme = useTheme();

  // Queries
  const { data: userData } = api.user.getCurrentUser.useQuery();

  // Mutations
  const { mutate: postComment } = api.rapComment.postComment.useMutation();

  // Invalidaters
  const { invalidate: invalidateRapComments } = api.useContext().rapComment.getRapComments;

  const {
    setValue,
    formState: {
      isValid,
      isSubmitting
    },
    reset,
    handleSubmit
  } = useForm({
    defaultValues: { content: '' },
    resolver: zodResolver(z.object({
      content: z.string().min(1).max(500)
    }))
  })

  const submitFormHandler = (formValues: { content: string }) => {
    if (userData && formValues.content && rapId) {
      postComment({
        userId: userData.id,
        rapId,
        content: formValues.content
      }, {
        onSuccess: () => {
          invalidateRapComments({
            rapId: rapId as string,
          })
          reset();
          editor?.commands.clearContent();
        }
      })
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write a comment...',
      })
    ],
    onUpdate({ editor }) {
      setValue('content', editor.getHTML(), { shouldValidate: true });
    },
  });

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
          {...(userData?.profileImageUrl && {
            src: `${CDN_URL}/${userData.profileImageUrl}`,
          })}
        />
        {userData?.username}
      </Box>
      <form onSubmit={handleSubmit(submitFormHandler)}>
        <RapCommentTextEditor
          editor={editor}
          submitButtonIsDisabled={!isValid || isSubmitting}
        />
      </form>
    </Box>
  )
}

export default RapCommentComposer
