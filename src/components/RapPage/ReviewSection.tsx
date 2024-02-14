import { Icon } from '@iconify/react';
import { Box, Button, Divider, IconButton, Stack, SxProps, Typography } from '@mui/material';
import { Rap, RapReview } from '@prisma/client';
import { useEffect, useState } from 'react';
import { api } from 'src/utils/api';
import FireRating from './FireRating';
import RapReviews from './RapReviews';
import ReviewMaker from './ReviewMaker';

interface ReviewSectionProps {
  rapData?: Rap | null;
  sx?: SxProps;
  closeButtonHandler?: () => void;
}

function ReviewSection({ rapData, sx, closeButtonHandler }: ReviewSectionProps) {
  const [showReviewMaker, setShowReviewMaker] = useState<boolean>(false);
  const [reviewMakerDefaultReview, setReviewMakerDefaultReview] = useState<RapReview | null>(null);

  const { data: rapReview, refetch: reloadReview } = api.reviews.getReview.useQuery(
    { rapId: rapData?.id || '' },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false
    }
  );

  const { data: overallRatings, refetch: refetchOverallRatings } =
    api.reviews.getOverallRatings.useQuery({
      rapId: rapData?.id || ''
    });

  useEffect(() => {
    reloadReview();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rapReview) {
      setReviewMakerDefaultReview(rapReview);
    }
  }, [rapReview]);

  useEffect(() => {
    if (!showReviewMaker) {
      refetchOverallRatings();
    }
  }, [showReviewMaker, refetchOverallRatings]);

  return (
    <Stack sx={{ pt: '3rem', ...sx }}>
      {showReviewMaker ? (
        <Button
          onClick={() => setShowReviewMaker(false)}
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
          onClick={closeButtonHandler}
        >
          <Icon icon='mdi:close' />
        </IconButton>
      )}
      {showReviewMaker ? (
        <ReviewMaker
          rapData={rapData}
          onSuccess={() => {
            setShowReviewMaker(false);
            reloadReview();
          }}
          defaultRapReview={reviewMakerDefaultReview}
        />
      ) : (
        <>
          {rapReview ? null : (
            <Box bgcolor='#282828'>
              <Stack sx={{ m: '1.5rem 0rem 1rem' }} px='2rem'>
                <Typography fontSize='1rem'>You have not submitted a review yet.</Typography>
                <Button
                  variant='text'
                  color='secondary'
                  sx={{
                    width: 'fit-content',
                    ml: '-.6rem',
                    textTransform: 'unset',
                    fontSize: '1rem',
                    pt: '0rem'
                  }}
                  onClick={() => setShowReviewMaker(true)}
                >
                  Leave a review
                </Button>
              </Stack>
            </Box>
          )}
          <Stack
            sx={{
              p: '1rem 2rem 3rem',
              mt: rapReview ? '' : '1.5rem'
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
                {overallRatings?.delivery}
              </Typography>
            </Stack>
          </Stack>
          <Divider />
          <RapReviews rapId={rapData?.id} />
        </>
      )}
    </Stack>
  );
}

export default ReviewSection;
