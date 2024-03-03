import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Stack, SxProps, useTheme } from '@mui/material';
import CharacterCount from '@tiptap/extension-character-count';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import { z } from 'zod';
import GenericTipTapEditor from '../GenericTipTapEditor';
import useSuggestionExtension from './useSuggestionExtension';

interface ForumCommentCreator {
  content: string;
}

const usernameSchema = z.object({
  content: z.string().min(1).max(1000)
});

interface ForumCommentCreatorProps {
  sx?: SxProps;
  threadId?: string;
}

function ForumCommentCreator({ sx, threadId }: ForumCommentCreatorProps) {
  const session = useSession();
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const { invalidate: invalidateGetForumThread } = api.useUtils().thread.getForumThread;

  const {
    handleSubmit: formSubmit,
    setValue,
    formState: { isValid }
  } = useForm({
    defaultValues: { content: '' },
    resolver: zodResolver(usernameSchema),
    mode: 'all'
  });

  const suggestion = useSuggestionExtension({
    threadId: threadId || ''
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          session.status === 'authenticated' ? 'Write your comment here...' : 'Log in to comment...'
      }),
      CharacterCount.configure({
        limit: 300
      }),
      Mention.configure({
        suggestion,
        renderHTML({ options, node }) {
          return [
            'span',
            { 'data-mention-user-id': node.attrs.id, class: 'mention' },
            `${options.suggestion.char}${node.attrs.label ?? ''}`
          ];
        }
      })
    ],
    onUpdate({ editor }) {
      setValue('content', editor.getText(), { shouldDirty: true, shouldValidate: true });
    },
    onFocus() {
      if (session.status === 'unauthenticated') {
        router.push('/auth');
      }
    }
  });

  const theme = useTheme();

  const { mutate: postThreadComment, isLoading: forumThreadIsLoading } =
    api.threadComments.postThreadComment.useMutation({
      onSuccess: () => {
        invalidateGetForumThread();
        if (editor) {
          editor.commands.clearContent();
        }
      },
      onError: err => {
        toast.error(err.message);
      }
    });

  const handleSubmit = async () => {
    if (!editor || !session?.data?.user.id) return;
    const content = editor.getHTML();
    postThreadComment({ content, threadId: threadId || '' });
  };

  return (
    <form onSubmit={formSubmit(handleSubmit)} ref={ref}>
      <Stack
        sx={{
          p: '1.5rem 1rem 1rem',
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          ...sx,
          '.mention': {
            border: `2px solid ${theme.palette.divider}`,
            borderRadius: '0.4rem',
            boxDecorationBreak: 'clone',
            padding: '0.125rem 0.25rem'
          }
        }}
      >
        <GenericTipTapEditor
          contentStyles={{
            background: 'unset',
            border: `1px solid ${theme.palette.grey[800]}`
          }}
          editor={editor}
        />
        <Stack direction='row' justifyContent='flex-end' mt='1rem' gap={4}>
          <LoadingButton
            type={session.status === 'authenticated' ? 'submit' : 'button'}
            onClick={() => {
              if (session.status === 'unauthenticated') {
                router.push('/auth');
              }
            }}
            variant='contained'
            color='primary'
            disabled={!isValid}
            loading={forumThreadIsLoading}
            size='small'
          >
            Add a Comment
          </LoadingButton>
        </Stack>
      </Stack>
    </form>
  );
}

export default ForumCommentCreator;
