import { Stack } from '@mui/material';
import { RapReview, User } from '@prisma/client';
import { api } from 'src/utils/api';
import ReviewPreviewCard from './ReviewPreviewCard';

interface RapReviewsProps {
  rapId?: string;
  reviewClickHandler?: (review: RapReview & { reviewer: Partial<User> }) => void;
}

function RapReviews({ rapId, reviewClickHandler }: RapReviewsProps) {
  const { data: rapReviews } = api.reviews.getRapReviewsWithUserReview.useQuery({
    rapId: rapId || ''
  });

  return (
    <Stack alignItems='center' pb='4rem'>
      {rapReviews?.map(review => (
        <ReviewPreviewCard key={review.id} rapReview={review} onReviewClick={reviewClickHandler} />
      ))}
    </Stack>
  );
}

export default RapReviews;
