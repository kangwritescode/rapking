import { ArticleContainer } from 'src/components/Article';

function BlogPage() {
  const { data: pulsePosts } = api.pulse.getAllPosts.useQuery();

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
      {pulsePosts?.map(post => (
        <>
          <Box component='article' key={post.id} mb='2rem'>
            <Typography component='h2' fontSize='1.5rem' fontWeight='600'>
              {post.createdAt.toLocaleDateString()}
            </Typography>
            <Typography
              component='div'
              variant='body1'
              fontSize='1.25rem'
              dangerouslySetInnerHTML={{
                __html: post.content
              }}
            />
          </Box>
        </>
      ))}
    </ArticleContainer>
  );
}

export default BlogPage;

import { Box, Divider, Typography } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
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
