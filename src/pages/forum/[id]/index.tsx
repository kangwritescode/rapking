import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ThreadType, User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import ForumCommentCreator from 'src/components/Forum/ForumCommentCreator';
import ThreadComment from 'src/components/RapPage/ThreadComment';
import { prisma } from 'src/server/db';
import { api } from 'src/utils/api';
import { ForumViewWrapper } from '..';

function ForumThreadPage({ id, defaultThreadId }: { id: string; defaultThreadId: string }) {
  const theme = useTheme();
  const [userToMention, setUserToMention] = useState<Partial<User> | null>(null);

  const { data: forumThread } = api.thread.getForumThread.useQuery({
    id: id as string
  });

  return (
    <ForumViewWrapper>
      <Stack
        sx={{
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1
        }}
      >
        <Box
          sx={{
            p: '.75rem 1rem',
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography fontWeight='600'>{forumThread?.title}</Typography>
        </Box>
        {forumThread?.thread.threadComments.map(comment => (
          <Box
            key={comment.id}
            sx={{
              p: '1.25rem 1.25rem',
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            <ThreadComment
              comment={comment}
              threadType={ThreadType.FORUM}
              forumThreadId={forumThread?.id}
              onReply={(user: Partial<User>) => setUserToMention(user)}
            />
          </Box>
        ))}
        <Box
          sx={{
            height: '2rem'
          }}
        />
      </Stack>
      <ForumCommentCreator
        threadId={defaultThreadId || forumThread?.thread.id}
        sx={{
          mt: '1.5rem',
          mb: '2rem'
        }}
        addReplyMentionSuccessHandler={() => {
          setUserToMention(null);
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }}
        userToMention={userToMention}
      />
    </ForumViewWrapper>
  );
}

export default ForumThreadPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;

  const forumThread = await prisma.forumThread.findUnique({
    where: {
      id
    },
    include: {
      thread: true
    }
  });

  if (!forumThread) {
    return {
      notFound: true
    };
  }

  const threadId = forumThread.threadId;

  return {
    props: {
      id: context.params.id,
      defaultThreadId: threadId
    }
  };
}
