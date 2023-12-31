import { Box, CardMedia, SxProps, Typography } from '@mui/material';
import { Article } from '@prisma/client';
import Link from 'next/link';
import { BUCKET_URL } from 'src/shared/constants';

export const ArticleCard = ({ article, sx }: { article: Article; sx?: SxProps }) => {
  const { title, subtitle } = article;

  return (
    <Box sx={sx}>
      <Link
        href={`insights/${article.slug}`}
        style={{
          textDecoration: 'none'
        }}
      >
        <CardMedia
          component='img'
          alt='Rap Guides'
          image={`${BUCKET_URL}/${article.bannerImage}`}
          sx={{
            height: '13rem'
          }}
        />
        <Typography mt='.75rem' fontWeight={600} fontSize='1.25rem'>
          {title}
        </Typography>
        <Typography variant='body2'>{subtitle}</Typography>
      </Link>
    </Box>
  );
};
