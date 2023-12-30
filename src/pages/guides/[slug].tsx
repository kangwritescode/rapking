import { Box, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Article from 'src/components/Article';
import { api } from 'src/utils/api';

function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;
  const { data: article } = api.articles.getArticleBySlug.useQuery({ slug: slug as string });

  const theme = useTheme();

  return (
    <Box position='relative'>
      <Box
        sx={{
          position: 'absolute',
          left: '.5rem'
        }}
      >
        <Link
          href='/guides'
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
            Guides &nbsp; /
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
      <Article articleData={article} />
    </Box>
  );
}

export default ArticlePage;
