import { ArticleContainer } from 'src/components/Article';
import PulseEditor from 'src/components/PulsePage/PulseEditor';
import PulsePost from 'src/components/PulsePage/PulsePost';

function BlogPage() {
  const { data: pulsePosts } = api.pulse.getAllPosts.useQuery();

  const session = useSession();
  const isAdmin = session?.data?.user?.isAdmin;

  return (
    <ArticleContainer>
      <Typography
        component='h1'
        fontSize='4rem'
        fontFamily='impact'
        mb='1rem'
        position='relative'
        zIndex={1}
        lineHeight='2.5rem'
      >
        Pulse
      </Typography>
      <Typography component='h2' fontSize='1.25rem' fontWeight='600'>
        RapKing news, updates, and more
      </Typography>
      <Divider
        sx={{
          mt: '.5rem',
          mb: '2rem'
        }}
      />
      {isAdmin ? (
        <Box mb='2rem'>
          <PulseEditor />
        </Box>
      ) : undefined}
      {pulsePosts?.map(post => (
        <PulsePost key={post.id} pulsePost={post} />
      ))}
    </ArticleContainer>
  );
}

export default BlogPage;

import { Box, Divider, Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';
import { api } from 'src/utils/api';

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  const redirectToCreateProfilePage =
    session && (!session?.user.profileIsComplete || !session?.user.isWhitelisted);

  if (redirectToCreateProfilePage) {
    return {
      redirect: {
        destination: '/create-profile/',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};
