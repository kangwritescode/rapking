import { Alert, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { Rap } from '@prisma/client';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';

interface RapPromoterProps {
  rap?: Rap | null;
  cancelClickHandler: () => void;
}

function RapPromoter({ rap, cancelClickHandler }: RapPromoterProps) {
  const { data: currentUserData } = api.user.getCurrentUser.useQuery();
  const { mutate: createPromotion } = api.promotions.createPromotion.useMutation({
    onSuccess: () => {
      cancelClickHandler();
    },
    onError: err => {
      toast.error(err.message);
    }
  });

  const { data: promotion, isLoading } = api.promotions.getCurrentActivePromotion.useQuery(
    {
      rapId: rap?.id || ''
    },
    {
      enabled: !!rap?.id
    }
  );

  const handlePromoteRap = () => {
    if (!rap?.id) return;
    createPromotion({ rapId: rap?.id });
  };

  if (isLoading) {
    return (
      <Stack direction='row' justifyContent='center' alignItems='center'>
        <CircularProgress color='inherit' />
      </Stack>
    );
  }

  if (promotion) {
    return (
      <>
        <Alert severity='info' sx={{ mb: '1rem' }}>
          This rap is currently being promoted until {new Date(promotion.endsAt).toDateString()}.
        </Alert>
        <Stack direction='row' justifyContent='flex-end'>
          <Button variant='text' color='error' onClick={cancelClickHandler}>
            Close
          </Button>
        </Stack>
      </>
    );
  }

  return (
    <>
      {currentUserData?.promotionTokens === 0 && (
        <Alert severity='info' sx={{ mb: '1rem' }}>
          You need credits to request a review. You can get credits by winning competitions or
          purchashing credits (coming soon!).
        </Alert>
      )}
      <Typography
        variant='body1'
        sx={{
          mb: '1rem'
        }}
      >
        Promotion Credits Available: <b>{currentUserData?.promotionTokens}</b>
      </Typography>
      <Divider sx={{ mb: '1rem' }} />
      <Typography
        variant='body2'
        sx={{
          mb: '2rem'
        }}
      >
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>
            This will use <strong>1</strong> promotion credit.
          </li>
          <li>Your rap will be promoted to the top of the feed for 1 week.</li>
        </ul>
      </Typography>
      <Stack direction='row' justifyContent='flex-end' spacing={2}>
        <Button variant='outlined' color='error' onClick={cancelClickHandler}>
          Cancel
        </Button>
        <Button
          disabled={!rap?.id || !currentUserData?.promotionTokens}
          variant='contained'
          color='primary'
          onClick={handlePromoteRap}
        >
          Promote '{rap?.title}'
        </Button>
      </Stack>
    </>
  );
}

export default RapPromoter;
