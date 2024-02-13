import { Icon } from '@iconify/react';
import { Box, Button, Divider, IconButton, Stack, SxProps, Typography } from '@mui/material';
import { Rap } from '@prisma/client';
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

  const { data: rapReview, refetch } = api.reviews.getReview.useQuery(
    { rapId: rapData?.id || '' },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false
    }
  );

  useEffect(() => {
    refetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            refetch();
          }}
          defaultRapReview={rapReview}
        />
      ) : (
        <>
          <Box bgcolor='#282828'>
            <Stack sx={{ m: '2rem 0rem 1.5rem' }} px='2rem'>
              <Typography fontSize='1.2rem'>You have not submitted a review yet.</Typography>
              <Button
                variant='text'
                color='secondary'
                sx={{
                  width: 'fit-content',
                  ml: '-.6rem',
                  textTransform: 'unset',
                  fontSize: '1.2rem',
                  pt: '0rem'
                }}
                onClick={() => setShowReviewMaker(true)}
              >
                Leave a review
              </Button>
            </Stack>
          </Box>
          <Stack
            sx={{
              p: '1rem 2rem 3rem',
              mt: '1.5rem'
            }}
          >
            <Typography fontSize='1.25rem' fontWeight='600'>
              Overall Rating (4.5)
            </Typography>
            <FireRating
              sx={{
                width: 'fit-content',
                pointerEvents: 'none',
                mt: '.25rem'
              }}
              fontSize='3.5rem'
            />
            <Stack direction='row' alignItems='center' sx={{ mt: '1rem' }}>
              <Typography
                variant='body2'
                sx={{
                  pointerEvents: 'none'
                }}
              >
                Lyricism: 4.5 &nbsp; • &nbsp; Flow: 4.5 &nbsp; • &nbsp; Originality: 4.5 &nbsp; •
                &nbsp; Delivery: 4.5
              </Typography>
            </Stack>
          </Stack>
          <Divider />
          <RapReviews />
        </>
      )}
    </Stack>
  );
}

export default ReviewSection;
