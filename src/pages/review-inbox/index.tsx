import { Checkbox, Stack, Typography, useTheme } from '@mui/material';
import { ReviewRequest } from '@prisma/client';
import { useState } from 'react';
import Rap from 'src/components/RapPage/Rap';
import ReviewRequestComponent from 'src/components/ReviewInbox/ReviewRequest';
import { api } from 'src/utils/api';

interface RapViewerProps {
  rapId?: string;
}

function RapViewer({ rapId }: RapViewerProps) {
  const { data: rapData } = api.rap.getRap.useQuery(
    { id: rapId as string },
    { enabled: Boolean(rapId) }
  );

  if (!rapId) {
    return (
      <Stack height='100%' justifyContent='center'>
        <Typography fontSize='2.5rem' textAlign='center' fontWeight='600'>
          Select a Review Request
        </Typography>
      </Stack>
    );
  }

  return <Rap rapData={rapData} />;
}

function ReviewInboxPage() {
  const theme = useTheme();

  const { data: reviewRequests } = api.reviewRequests.getReviewRequests.useQuery();

  const [selectedReviewRequest, setSelectedReviewRequest] = useState<ReviewRequest | null>(null);

  return (
    <Stack
      direction='row'
      sx={{
        height: '100%',
        position: 'relative',
        width: '100%',
        borderLeft: {
          xs: 'unset',
          lg: `1px solid ${theme.palette.divider}`,
          xl: `2px solid ${theme.palette.divider}`
        },
        borderRight: {
          xs: 'unset',
          lg: `1px solid ${theme.palette.divider}`,
          xl: `2px solid ${theme.palette.divider}`
        }
      }}
    >
      <Stack
        sx={{
          borderRight: `2px solid ${theme.palette.divider}`,
          width: '32%',
          minWidth: '32%'
        }}
      >
        <Stack
          textAlign='center'
          sx={{ borderBottom: `2px solid ${theme.palette.divider}` }}
          py='1rem'
        >
          <Typography fontSize='2rem' fontWeight='600'>
            Review Requests ({reviewRequests?.length})
          </Typography>
        </Stack>
        <Stack
          borderBottom={`2px solid ${theme.palette.divider}`}
          p='0rem 1rem'
          flexDirection='row'
        >
          <Checkbox color='secondary' />
        </Stack>
        {reviewRequests?.map(reviewRequest => (
          <ReviewRequestComponent
            key={reviewRequest.id}
            reviewRequest={reviewRequest}
            onClick={reviewRequest => setSelectedReviewRequest(reviewRequest)}
          />
        ))}
      </Stack>
      <Stack
        flexGrow='1'
        p={{
          xs: '1rem',
          lg: '2rem'
        }}
      >
        <RapViewer rapId={selectedReviewRequest?.rapId} />{' '}
      </Stack>
    </Stack>
  );
}

export default ReviewInboxPage;
