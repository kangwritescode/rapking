import { Box, Divider, Typography } from '@mui/material';
import { ArticleContainer } from 'src/components/Article';
import { ArticleCard } from 'src/components/ArticleCard';
import { api } from 'src/utils/api';

function InsightsPage() {
  const { data: articles } = api.articles.getAllArticles.useQuery({
    limit: undefined
  });

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
        RapKing Insights
      </Typography>
      <Typography component='h2' fontSize='1.25rem' fontWeight='600'>
        Articles, guides, interviews, and more!
      </Typography>
      <Divider
        sx={{
          mt: '.5rem',
          mb: '2rem'
        }}
      />
      <Box
        display='flex'
        sx={{
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}
      >
        {articles?.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            sx={{
              width: {
                xs: '100%',
                sm: '49%',
                position: 'relative'
              },
              mb: '2rem'
            }}
          />
        ))}
      </Box>
    </ArticleContainer>
  );
}

export default InsightsPage;
