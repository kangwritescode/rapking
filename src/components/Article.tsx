import { Icon } from '@iconify/react';
import { Box, CardMedia, Divider, Stack, Typography } from '@mui/material';
import { Article } from '@prisma/client';
import React, { useEffect } from 'react';
import sanitize from 'sanitize-html';
import { BUCKET_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';

interface Props {
  children?: React.ReactNode;
  articleData?: Article;
}

export function ArticleContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      height='100%'
      width='100%'
      pt={{
        xs: '1.75rem',
        sm: '2rem',
        md: '3rem'
      }}
      px={{
        xs: '1rem',
        sm: '2rem',
        md: '6rem',
        lg: '16%',
        xl: '20%',
        transition: 'padding 0.3s ease-in-out'
      }}
    >
      {children}
    </Box>
  );
}

function Article({ articleData }: Props) {
  const { content, bannerImage, title, subtitle, slug } = articleData || {};

  const sanitizedContent = sanitize(content || '');

  const { mutate: incrementArticleView } = api.articles.incrementViews.useMutation();

  useEffect(() => {
    try {
      incrementArticleView({ slug: slug! });
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!articleData) return null;

  return (
    <ArticleContainer>
      <CardMedia
        sx={{
          height: {
            xs: '10rem',
            sm: '13rem',
            md: '16rem'
          }
        }}
        component='img'
        alt='Article Banner'
        image={`${BUCKET_URL}/${bannerImage}`}
      />
      <Typography component='h1' fontSize='3rem' fontFamily='impact' mb='1rem' mt='1.5rem'>
        {title}
      </Typography>
      <Typography component='h2' fontSize='1.5rem' mt='-1.5rem' fontWeight={600}>
        {subtitle}
      </Typography>
      <Divider sx={{ mt: '2rem' }} />
      <Stack direction='row' pl='.75rem' py='.5rem' alignItems='center'>
        <Icon icon='gg:eye' fontSize='1.25rem' style={{ marginRight: '.5rem' }} />

        {articleData.viewCount}
      </Stack>
      <Divider sx={{ mb: '3rem' }} />
      <Box
        component='div'
        dangerouslySetInnerHTML={{
          __html: sanitizedContent
        }}
      />
    </ArticleContainer>
  );
}
export default Article;
