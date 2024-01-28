import { ArticleContainer } from 'src/components/Article';

function BlogPage() {
  return <ArticleContainer>Coming Soon!</ArticleContainer>;
}

export default BlogPage;

import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

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
