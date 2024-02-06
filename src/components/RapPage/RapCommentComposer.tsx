import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Box, useTheme } from '@mui/material';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BUCKET_URL } from 'src/shared/constants';
import { removeTrailingAndLeadingPElements } from 'src/shared/editorHelpers';
import { api } from 'src/utils/api';
import { z } from 'zod';
import RapCommentTextEditor from './RapCommentTextEditor';

interface RapCommentComposerProps {
  threadId?: string | null;
}

function RapCommentComposer({ threadId }: RapCommentComposerProps) {
  const theme = useTheme();

  // Session
  const { data, status } = useSession();

  // Queries
  const { data: userData } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!data?.user?.id
  });

  // Mutations
  const { mutate: postComment, isLoading } = api.threadComments.postThreadComment.useMutation();

  // Invalidaters
  const { invalidate: invalidateRapComments } = api.useContext().threadComments.getThreadComments;
  const { invalidate: invalidateCommentsCount } =
    api.useContext().threadComments.getThreadCommentsCount;

  const {
    setValue,
    formState: { isValid, isSubmitting },
    reset,
    handleSubmit
  } = useForm({
    defaultValues: { content: '' },
    resolver: zodResolver(
      z.object({
        content: z.string().min(1).max(500)
      })
    )
  });

  const submitFormHandler = (formValues: { content: string }) => {
    if (status === 'unauthenticated') {
      toast.error('You must be logged in to comment.');
    } else if (userData && formValues.content && threadId) {
      const editedContent = removeTrailingAndLeadingPElements(formValues.content);

      postComment(
        {
          userId: userData.id,
          threadId,
          content: editedContent
        },
        {
          onSuccess: () => {
            invalidateRapComments();
            invalidateCommentsCount();
            reset();
            editor?.commands.clearContent();
          },
          onError: error => {
            toast.error(error.message);
          }
        }
      );
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write a comment...'
      })
    ],
    onUpdate({ editor }) {
      setValue('content', editor.getHTML(), { shouldValidate: true });
    }
  });

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.grey[300]}`,
        boxShadow: '1px 1px 14px 0px rgba(255, 255, 255, 0.15)'
      }}
    >
      <Box px={4} pt={3} display='flex' alignItems='center'>
        <Avatar
          sx={{
            cursor: 'pointer',
            width: 35,
            height: 35,
            position: 'relative',
            marginRight: theme.spacing(2)
          }}
          {...(userData?.profileImageUrl && {
            src: `${BUCKET_URL}/${userData.profileImageUrl}`
          })}
        />
        {userData?.username}
      </Box>
      <form onSubmit={handleSubmit(submitFormHandler)}>
        <RapCommentTextEditor
          editor={editor}
          submitButtonIsDisabled={!isValid || isSubmitting || isLoading}
          showSubmitLoader={isSubmitting || isLoading}
        />
      </form>
    </Box>
  );
}

export default RapCommentComposer;
