import { Box, CardMedia, Divider, Typography } from '@mui/material';
import { Article } from '@prisma/client';
import React from 'react';
import sanitize from 'sanitize-html';
import { BUCKET_URL } from 'src/shared/constants';

interface Props {
  children?: React.ReactNode;
  articleData?: Article | null;
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
  if (!articleData) return null;

  const { content, bannerImage, title, subtitle } = articleData;

  const sanitizedContent = sanitize(content);

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
        alt='Rap Guides'
        image={`${BUCKET_URL}/${bannerImage}`}
      />
      <Typography component='h1' fontSize='3rem' fontFamily='impact' mb='1rem' mt='1.5rem'>
        {title}
      </Typography>
      <Typography component='h2' fontSize='1.5rem' mt='-1.5rem' fontWeight={600}>
        {subtitle}
      </Typography>
      <Divider sx={{ mt: '.5rem', mb: '3rem' }} />
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
