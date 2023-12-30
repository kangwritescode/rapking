import { Box, CardMedia, Divider, SxProps, Typography, useTheme } from '@mui/material';
import { Article } from '@prisma/client';
import Link from 'next/link';
import { ArticleContainer } from 'src/components/Article';
import { BUCKET_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';

const ArticleCard = ({ article, sx }: { article: Article; sx?: SxProps }) => {
  const { title, subtitle } = article;

  return (
    <Box sx={sx}>
      <Link
        href={`guides/${article.slug}`}
        style={{
          textDecoration: 'none'
        }}
      >
        <CardMedia
          component='img'
          alt='Rap Guides'
          image={`${BUCKET_URL}/${article.bannerImage}`}
        />
        <Typography mt='.75rem' mb='.25rem' fontWeight={600} fontSize='1.25rem'>
          {title}
        </Typography>
        <Typography variant='body2'>{subtitle}</Typography>
      </Link>
    </Box>
  );
};

function GuidesPage() {
  const theme = useTheme();

  const { data: articles } = api.articles.getAllArticles.useQuery({
    limit: undefined
  });

  return (
    <ArticleContainer>
      <CardMedia
        component='img'
        alt='Rap Guides'
        image='/images/pages/studio.webp'
        sx={{
          height: {
            xs: '10rem',
            sm: '13rem',
            md: '16rem',
            border: `1px solid ${theme.palette.grey[900]}`
          }
        }}
      />
      <Typography
        component='h1'
        fontSize='4rem'
        fontFamily='impact'
        mb='1rem'
        mt='3rem'
        position='relative'
        zIndex={1}
        lineHeight='2.5rem'
      >
        Rap Guides
      </Typography>
      <Typography component='h2' fontSize='1.25rem' fontWeight='600'>
        Articles and guides to help you become a better writer, rapper, and producer.
      </Typography>
      <Divider
        sx={{
          mt: '.5rem',
          mb: '3rem'
        }}
      />
      <Box>
        {articles?.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            sx={{
              width: {
                xs: '100%',
                sm: '50%',
                position: 'relative'
              }
            }}
          />
        ))}
      </Box>
    </ArticleContainer>
  );
}

export default GuidesPage;
