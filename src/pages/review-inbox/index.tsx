import { Icon } from '@iconify/react';
import {
  Button,
  Checkbox,
  Stack,
  SxProps,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ReviewRequest } from '@prisma/client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Rap from 'src/components/RapPage/Rap';
import ReviewRequestComponent from 'src/components/ReviewInbox/ReviewRequest';
import { useRapStore } from 'src/stores/rapStore';
import { api } from 'src/utils/api';

interface RapViewerProps {
  rapId?: string;
  sx?: SxProps;
  backClickHandler?: () => void;
}

function RapViewer({ rapId, sx, backClickHandler }: RapViewerProps) {
  const { data: rapData } = api.rap.getRap.useQuery(
    { id: rapId as string },
    { enabled: Boolean(rapId) }
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!rapId) {
    return isMobile ? null : (
      <Stack height='100%' flexGrow='1' justifyContent='center'>
        <Typography
          fontSize={{
            xs: '2rem',
            lg: '2.5rem'
          }}
          textAlign='center'
          fontWeight='600'
        >
          Select a Review Request
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        ...sx
      }}
    >
      {isMobile ? (
        <Stack
          direction='row'
          sx={{
            pb: '1rem',
            width: '100%',
            justifyContent: 'flex-end'
          }}
        >
          <Button
            sx={{
              width: 'fit-content'
            }}
            color='secondary'
            variant='outlined'
            endIcon={<Icon icon='humbleicons:arrow-go-back' />}
            onClick={() => backClickHandler?.()}
          >
            Back to Inbox
          </Button>
        </Stack>
      ) : undefined}
      <Rap rapData={rapData} />
    </Stack>
  );
}

function ReviewInboxPage() {
  const theme = useTheme();

  const { data: reviewRequests } = api.reviewRequests.getReviewRequests.useQuery();

  const [selectedReviewRequest, setSelectedReviewRequest] = useState<ReviewRequest | null>(null);

  const setRapContext = useRapStore(state => state.setContext);

  useEffect(() => {
    setRapContext('review-inbox');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      selectedReviewRequest &&
      reviewRequests &&
      !reviewRequests.find(r => r.id === selectedReviewRequest.id)
    ) {
      setSelectedReviewRequest(null);
    }
  }, [reviewRequests, selectedReviewRequest]);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Checkboxes logic
  const [checked, setChecked] = useState<string[]>([]);
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  useEffect(() => {
    if (reviewRequests) {
      const totalReviewRequests = reviewRequests.length;
      const totalChecked = checked.length;

      if (totalChecked === 0) {
        setIsIndeterminate(false);
      } else if (totalChecked < totalReviewRequests) {
        setIsIndeterminate(true);
      } else {
        setIsIndeterminate(false);
      }
    }
  }, [checked, reviewRequests]);

  const handleParentCheckboxChange = () => {
    if (reviewRequests) {
      if (checked.length === reviewRequests.length || isIndeterminate) {
        setChecked([]); // Uncheck all
      } else {
        setChecked(reviewRequests.map(r => r.id)); // Check all
      }
    }
  };

  const { invalidate: invalidateReviewRequests } = api.useUtils().reviewRequests.getReviewRequests;
  const { mutateAsync: deleteReviewRequests } =
    api.reviewRequests.deleteReviewRequests.useMutation();

  const handleDeleteSelected = () => {
    if (checked.length > 0) {
      deleteReviewRequests(checked)
        .then(() => {
          invalidateReviewRequests();
          setChecked([]);
        })
        .catch(() => {
          toast.error('An error occurred while deleting the review requests');
        });
    }
  };

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
          width: isMobile ? '100%' : '32%',
          minWidth: isMobile ? '100%' : '32%',
          display: isMobile && selectedReviewRequest ? 'none' : 'flex'
        }}
      >
        <Stack
          textAlign='center'
          sx={{
            borderBottom: `2px solid ${theme.palette.divider}`
          }}
          py='1rem'
        >
          <Typography
            fontSize={{
              xs: '1.5rem',
              lg: '1.75rem'
            }}
            fontWeight='600'
          >
            Review Requests ({reviewRequests?.length})
          </Typography>
        </Stack>
        <Stack
          borderBottom={`2px solid ${theme.palette.divider}`}
          p='.25rem 1rem'
          flexDirection='row'
          alignItems='center'
        >
          <Checkbox
            color='secondary'
            indeterminate={isIndeterminate}
            checked={checked.length > 0 && !isIndeterminate}
            onChange={handleParentCheckboxChange}
          />
          {checked.length > 0 && (
            <Button
              sx={{
                ml: '1rem'
              }}
              size='small'
              color='error'
              onClick={handleDeleteSelected}
            >
              Delete Selected
            </Button>
          )}
        </Stack>
        {reviewRequests?.map(reviewRequest => (
          <ReviewRequestComponent
            key={reviewRequest.id}
            reviewRequest={reviewRequest}
            onClick={reviewRequest => setSelectedReviewRequest(reviewRequest)}
            isSelected={selectedReviewRequest?.id === reviewRequest.id}
            isChecked={checked.includes(reviewRequest.id)}
            handleCheckboxChange={
              checked.includes(reviewRequest.id)
                ? id => setChecked(prevChecked => prevChecked.filter(c => c !== id))
                : id => setChecked(prevChecked => [...prevChecked, id])
            }
          />
        ))}
      </Stack>
      <RapViewer
        sx={{
          flexGrow: 1,
          p: {
            xs: '1rem',
            lg: '2rem'
          }
        }}
        backClickHandler={() => setSelectedReviewRequest(null)}
        rapId={selectedReviewRequest?.rapId}
      />
    </Stack>
  );
}

export default ReviewInboxPage;
