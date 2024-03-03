import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, SxProps } from '@mui/material';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { removeTrailingAndLeadingPElements } from 'src/shared/editorHelpers';
import { api } from 'src/utils/api';
import { z } from 'zod';
import WallCommentEditor from './WallCommentEditor';

interface WallCommentComposerProps {
  sx?: SxProps;
  threadId?: string | null;
}

const WallCommentComposer = ({ sx, threadId }: WallCommentComposerProps) => {
  const session = useSession();
  const router = useRouter();

  const {
    setValue,
    formState: { isValid, isSubmitting },
    reset,
    handleSubmit
  } = useForm({
    defaultValues: { threadComment: '' },
    resolver: zodResolver(
      z.object({
        threadComment: z.string().min(1).max(100)
      })
    )
  });

  // Mutations
  const { mutate: postComment, status } = api.threadComments.postThreadComment.useMutation();

  const { data: userData } = api.user.getCurrentUser.useQuery();

  // Invalidaters
  const { invalidate: invalidateThreadComments } = api.useUtils().threadComments.getThreadComments;
  const { invalidate: invalidateCommentsCount } =
    api.useUtils().threadComments.getThreadCommentsCount;

  const submitFormHandler = (formValues: { threadComment: string }) => {
    if (session.status === 'unauthenticated') {
      router.push('/auth');
    } else if (userData && formValues.threadComment && threadId) {
      const editedContent = removeTrailingAndLeadingPElements(formValues.threadComment);

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
    content: '',
    onUpdate({ editor }) {
      setValue('threadComment', editor.getHTML(), { shouldValidate: true });
    }
  });

  return (
    <Stack
      direction='row'
      sx={{
        mt: 2,
        mb: 4,
        ...sx
      }}
    >
      <form
        onSubmit={handleSubmit(submitFormHandler)}
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%'
        }}
      >
        <WallCommentEditor editor={editor} />
        <Button
          type='submit'
          sx={{
            ml: 4
          }}
          color='primary'
          variant='contained'
          disabled={isSubmitting || !isValid || status === 'loading'}
        >
          Post
        </Button>
      </form>
    </Stack>
  );
};

export default WallCommentComposer;
