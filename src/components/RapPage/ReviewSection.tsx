import { Icon } from '@iconify/react';
import { Box, Button, Divider, IconButton, Stack, SxProps, Typography } from '@mui/material';
import { Rap, RapReview, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRapStore } from 'src/stores/rapStore';
import { api } from 'src/utils/api';
import FireRating from './FireRating';
import RapReviews from './RapReviews';
import ReviewMaker from './ReviewMaker';

interface ReviewSectionProps {
  rapData?: Rap | null;
  sx?: SxProps;
  onCloseHandler?: () => void;
}

function ReviewSection({ rapData, sx, onCloseHandler }: ReviewSectionProps) {
  const session = useSession();

  const [reviewMakerDefaultReview, setReviewMakerDefaultReview] = useState<
    (RapReview & { reviewer: Partial<User> }) | null
  >(null);
  const [showReviewMaker, setShowReviewMaker] = useState(false);

  const isOwner = session.data?.user?.id === rapData?.userId;

  const { data: currentUserReview, refetch: reloadReview } = api.reviews.currentUserReview.useQuery(
    { rapId: rapData?.id || '' },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false
    }
  );

  const { data: overallRatings, refetch: refetchOverallRatings } =
    api.reviews.getOverallRatings.useQuery({
      rapId: rapData?.id || ''
    });

  // On mount
  useEffect(() => {
    reloadReview();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showReviewMaker) {
      refetchOverallRatings();
    }
  }, [showReviewMaker, refetchOverallRatings]);

  const rapContext = useRapStore(state => state.context);

  return (
    <Stack sx={{ pt: '3rem', ...sx }}>
      {/* Top Right Nav Buttons */}
      {showReviewMaker ? (
        <Button
          onClick={() => {
            setReviewMakerDefaultReview(null);
            setShowReviewMaker(false);
          }}
          endIcon={<Icon icon='humbleicons:arrow-go-back' />}
          color='inherit'
          sx={theme => ({
            position: 'absolute',
            right: '1rem',
            top: '.75rem',
            color: theme.palette.text.secondary,
            textTransform: 'unset'
          })}
        >
          Go back
        </Button>
      ) : (
        <IconButton
          sx={{ position: 'absolute', right: '1rem', top: '.5rem' }}
          onClick={onCloseHandler}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      )}
      {/* Current View */}
      {showReviewMaker ? (
        <ReviewMaker
          rapData={rapData}
          onSuccess={() => {
            setReviewMakerDefaultReview(null);
            setShowReviewMaker(false);
            reloadReview();
            if (rapContext === 'review-inbox' && !currentUserReview) {
              onCloseHandler?.();
            }
          }}
          viewOnly={
            reviewMakerDefaultReview &&
            reviewMakerDefaultReview?.reviewerId !== session.data?.user?.id
              ? true
              : false
          }
          defaultRapReview={reviewMakerDefaultReview}
        />
      ) : (
        <>
          <Stack
            sx={{
              p: '0rem 2rem 2.5rem',
              mt: currentUserReview ? '' : '1.5rem'
            }}
          >
            <Typography fontSize='1.25rem' fontWeight='600'>
              Overall Rating ({overallRatings?.total})
            </Typography>
            <FireRating
              sx={{
                width: 'fit-content',
                pointerEvents: 'none',
                mt: '.25rem'
              }}
              fontSize='3.5rem'
              precision={0.1}
              value={Number(overallRatings?.total) || 0}
            />
            <Stack direction='row' alignItems='center' sx={{ mt: '.5rem' }}>
              <Typography
                variant='body2'
                sx={{
                  pointerEvents: 'none'
                }}
              >
                Lyricism: {overallRatings?.lyricism} &nbsp; • &nbsp; Flow: {overallRatings?.flow}{' '}
                &nbsp; • &nbsp; Originality: {overallRatings?.originality} &nbsp; • &nbsp; Delivery:{' '}
                {overallRatings?.delivery ? String(overallRatings?.delivery) : 'N/A'}
              </Typography>
            </Stack>
          </Stack>
          <Divider />
          {!currentUserReview && !isOwner && session.status === 'authenticated' ? (
            <Box bgcolor='#282828'>
              <Stack sx={{ m: '1.5rem 0rem 1rem' }} px='2rem'>
                <Typography fontSize='1rem' alignItems='center' display='flex'>
                  <Icon
                    icon='line-md:alert-loop'
                    style={{ fontSize: '1.5rem', marginRight: '.25rem' }}
                  />
                  You have not submitted a review yet.
                </Typography>
                <Button
                  variant='outlined'
                  color='secondary'
                  fullWidth
                  sx={{
                    textTransform: 'unset',
                    fontSize: '1rem',
                    mt: '1.5rem',
                    mb: '.5rem'
                  }}
                  onClick={() => setShowReviewMaker(true)}
                >
                  Leave a Review
                </Button>
              </Stack>
            </Box>
          ) : null}
          <RapReviews
            rapId={rapData?.id}
            reviewClickHandler={(review: RapReview & { reviewer: Partial<User> }) => {
              setShowReviewMaker(true);
              setReviewMakerDefaultReview(review);
            }}
          />
        </>
      )}
    </Stack>
  );
}

export default ReviewSection;
