import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Box, useMediaQuery, useTheme } from '@mui/material';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BUCKET_URL } from 'src/shared/constants';
import { removeTrailingAndLeadingPElements } from 'src/shared/editorHelpers';
import { api } from 'src/utils/api';
import { z } from 'zod';
import ThreadCommentTextEditor from './ThreadCommentTextEditor';

interface ThreadCommentComposerProps {
  threadId?: string | null;
}

function ThreadCommentComposer({ threadId }: ThreadCommentComposerProps) {
  const theme = useTheme();
  const router = useRouter();

  // Session
  const { data, status } = useSession();

  // Queries
  const { data: userData } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!data?.user?.id
  });

  // Mutations
  const { mutate: postComment, isLoading } = api.threadComments.postThreadComment.useMutation();

  // Invalidaters
  const { invalidate: invalidateThreadComments } =
    api.useContext().threadComments.getThreadComments;
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
      router.push('/auth/');
    } else if (userData && formValues.content && threadId) {
      const editedContent = removeTrailingAndLeadingPElements(formValues.content);

      postComment(
        {
          threadId,
          content: editedContent
        },
        {
          onSuccess: () => {
            invalidateThreadComments();
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

  const isNotMobile = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.grey[800]}`,
        background: theme.palette.grey[900]
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
        <ThreadCommentTextEditor
          editor={editor}
          submitButtonIsDisabled={!isValid || isSubmitting || isLoading}
          showSubmitLoader={isSubmitting || isLoading}
          editorStyles={{
            maxWidth: isNotMobile ? '25rem' : '100%'
          }}
        />
      </form>
    </Box>
  );
}

export default ThreadCommentComposer;
