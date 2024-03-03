import { Box, Stack, Typography, useTheme } from '@mui/material';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext } from 'next';
import ForumCommentCreator from 'src/components/Forum/ForumCommentCreator';
import ForumThreadComment from 'src/components/Forum/ForumThreadComment';
import { appRouter } from 'src/server/api/root';
import { createTRPCContext } from 'src/server/api/trpc';
import { api } from 'src/utils/api';
import superjson from 'superjson';
import { ForumViewWrapper } from '..';

function ForumThreadPage({ id }: { id: string }) {
  const theme = useTheme();

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
            <ForumThreadComment comment={comment} />
          </Box>
        ))}
        <Box
          sx={{
            height: '2rem'
          }}
        />
      </Stack>
      <ForumCommentCreator
        threadId={forumThread?.thread.id}
        sx={{
          mt: '1.5rem',
          mb: '2rem'
        }}
      />
    </ForumViewWrapper>
  );
}

export default ForumThreadPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.id as string;

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: superjson
  });
  await helpers.thread.getForumThread.prefetch({ id });

  return {
    props: {
      id: context.params.id,
      trpcState: helpers.dehydrate()
    }
  };
}
