import { Alert, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from 'src/utils/api';

function ReviewRequestAlert() {
  const { data: reviewRequestsCount } = api.reviewRequests.getReviewRequestsCount.useQuery();
  const [reviewRequestsCountState, setReviewRequestsCountState] = useState(0);

  useEffect(() => {
    if (reviewRequestsCount) {
      setReviewRequestsCountState(reviewRequestsCount);
    }
  }, [reviewRequestsCount]);

  if (reviewRequestsCountState === 0) {
    return null;
  }

  return (
    <Alert severity='info' sx={{ my: '1rem' }}>
      <Typography variant='body2'>
        You have <strong>{reviewRequestsCount}</strong> raps to review. Go to{' '}
        <Link href='/review-inbox'>Review Request Inbox</Link>
      </Typography>
    </Alert>
  );
}

export default ReviewRequestAlert;
