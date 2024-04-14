import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, TextField, useTheme } from '@mui/material';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import { z } from 'zod';
import GenericTipTapEditor from '../GenericTipTapEditor';

interface ForumThreadForm {
  title: string;
  content: string;
}

const forumThreadSchema = z.object({
  title: z.string().min(3).max(50),
  content: z.string().min(3).max(1000)
});

interface ForumThreadFormProps {
  cancelButtonOnClick?: () => void;
  onSuccess?: () => void;
}

function ForumThreadForm({ cancelButtonOnClick, onSuccess }: ForumThreadFormProps) {
  const session = useSession();

  // Invalidators
  const { invalidate: invalidateGetDiscussionsPage } = api.useUtils().thread.getDiscussionsPage;

  const {
    register,
    handleSubmit: formSubmit,
    setValue,
    formState: { isValid }
  } = useForm({
    defaultValues: { title: '', content: '' },
    resolver: zodResolver(forumThreadSchema),
    mode: 'all'
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your post here...'
      }),
      CharacterCount.configure({
        limit: 300
      })
    ],
    onUpdate({ editor }) {
      setValue('content', editor.getText(), { shouldDirty: true, shouldValidate: true });
    }
  });

  const theme = useTheme();

  const { mutate: createForumThread, isLoading: forumThreadIsLoading } =
    api.thread.createForumThread.useMutation({
      onSuccess: () => {
        toast.success('Thread created successfully!');
        invalidateGetDiscussionsPage();
        if (onSuccess) onSuccess();
      },
      onError: error => {
        toast.error(error.message);
      }
    });

  const handleSubmit = async ({ title }: { title: string }) => {
    if (!editor || !session?.data?.user.id) return;
    const content = editor.getHTML();
    createForumThread({ title, content, userId: session?.data?.user.id });
  };

  return (
    <form onSubmit={formSubmit(formValues => handleSubmit({ title: formValues.title }))}>
      <Stack>
        <TextField
          label='Title'
          variant='outlined'
          size='small'
          {...register('title')}
          sx={{
            mb: '1rem',
            mt: '.5rem'
          }}
        />
        <GenericTipTapEditor
          contentStyles={{
            background: 'unset',
            border: `1px solid ${theme.palette.grey[800]}`
          }}
          editor={editor}
        />
        <Stack direction='row' justifyContent='flex-end' mt='2rem' gap={4}>
          <Button
            color='secondary'
            variant='outlined'
            onClick={() => cancelButtonOnClick && cancelButtonOnClick()}
          >
            Cancel
          </Button>
          <LoadingButton
            type='submit'
            variant='contained'
            color='primary'
            disabled={!isValid}
            loading={forumThreadIsLoading}
          >
            Submit
          </LoadingButton>
        </Stack>
      </Stack>
    </form>
  );
}

export default ForumThreadForm;
