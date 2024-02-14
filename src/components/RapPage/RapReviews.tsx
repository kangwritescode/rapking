import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { RapReview, User } from '@prisma/client';
import Link from 'next/link';
import { BUCKET_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';
import FireRating from './FireRating';

interface PreviewCardProps {
  rapReview: RapReview & {
    reviewer: Partial<User>;
  };
}

function PreviewCard({ rapReview }: PreviewCardProps) {
  const user = rapReview.reviewer;

  return (
    <>
      <Stack>
        <Stack direction='row' position='relative' mb='.75rem'>
          <Link href={`/u/${user.username}`} passHref style={{ textDecoration: 'none' }}>
            <Avatar
              {...(user?.profileImageUrl && {
                src: `${BUCKET_URL}/${user.profileImageUrl}`
              })}
              sx={{
                mr: 3
              }}
            />
          </Link>
          <Stack>
            <Link
              href={`/u/${user.username}`}
              passHref
              style={{
                textDecoration: 'none'
              }}
            >
              <Typography variant='body1' fontSize={14}>
                {user.username}
              </Typography>
            </Link>
            <Typography variant='body2'>{rapReview.createdAt.toLocaleDateString()}</Typography>
          </Stack>
        </Stack>
        <FireRating
          value={rapReview.total}
          readOnly
          sx={{
            mb: '.5rem'
          }}
        />
        <Typography
          variant='caption'
          sx={{
            pointerEvents: 'none'
          }}
        >
          Lyricism: {String(rapReview?.lyricism)} &nbsp; • &nbsp; Flow: {String(rapReview?.flow)}{' '}
          &nbsp; • &nbsp; Originality: {String(rapReview?.originality)} &nbsp; • &nbsp; Delivery:{' '}
          {String(rapReview?.delivery)}
        </Typography>
        <Typography variant='body2' sx={{ mt: '1.5rem' }}>
          "{rapReview.writtenReview}"
        </Typography>
      </Stack>
      <Divider sx={{ mt: '2rem' }} />
    </>
  );
}

interface RapReviewsProps {
  rapId?: string;
}

function RapReviews({ rapId }: RapReviewsProps) {
  const { data: rapReviews } = api.reviews.getRapReviewsWithUserReview.useQuery({
    rapId: rapId || ''
  });

  return (
    <Box
      sx={{
        p: '2rem'
      }}
    >
      {rapReviews?.map(review => (
        <PreviewCard key={review.id} rapReview={review} />
      ))}
    </Box>
  );
}

export default RapReviews;
