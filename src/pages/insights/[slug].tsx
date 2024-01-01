import { Box, Typography, useTheme } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Article from 'src/components/Article';
import { prisma } from 'src/server/db';
import { BUCKET_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';

const ArticleHead = ({ article }: { article: Article }) => {
  return (
    <Head>
      <title key='title'>{article?.title} - RapKing</title>
      <meta name='description' content={article?.content} />
      <meta property='og:title' content={article?.title} />
      <meta property='og:description' content={article?.content} />
      <meta property='og:url' content={`https://rapking.io/insights/${article?.slug}`} />
      <meta property='og:image' content={`${BUCKET_URL}/${article?.bannerImage}`} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content='RapKing' />
      <meta property='og:locale' content='en_US' />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={article?.title} />
      <meta name='twitter:description' content={article?.content} />
      <meta name='twitter:image' content={`${BUCKET_URL}/${article?.bannerImage}`} />
      <meta name='twitter:domain' content='rapking.io' />
      <link rel='canonical' href={`https://rapking.io/insights/${article?.slug}`} />
    </Head>
  );
};

function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;
  const { data: article } = api.articles.getArticleBySlug.useQuery({ slug: slug as string });

  const theme = useTheme();

  return (
    <>
      {article ? <ArticleHead article={article} /> : null}
      <Box position='relative'>
        <Box
          sx={{
            position: 'absolute',
            left: {
              xs: '1rem',
              sm: '.5rem'
            }
          }}
        >
          <Link
            href='/insights'
            style={{
              textDecoration: 'none'
            }}
          >
            <Typography
              variant='caption'
              textTransform={'uppercase'}
              sx={{
                color: theme.palette.grey[700]
              }}
            >
              Insights &nbsp; /
            </Typography>
          </Link>
          <Typography
            variant='caption'
            textTransform={'uppercase'}
            sx={{
              ml: '.4rem'
            }}
          >
            &nbsp; {article?.title}
          </Typography>
        </Box>
        {article && <Article articleData={article} />}
      </Box>
    </>
  );
}

export default ArticlePage;

export async function getStaticPaths() {
  const articles = await prisma.article.findMany({
    select: {
      slug: true
    }
  });
  const paths = articles.map(article => ({
    params: { slug: article.slug }
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: {
      slug: params.slug
    }
  });

  const serializableArticle = {
    ...article,
    publishedAt: article!.publishedAt.toISOString()
  };

  return {
    props: {
      article: serializableArticle
    }
  };
}
