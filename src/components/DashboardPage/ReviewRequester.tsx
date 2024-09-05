import { Alert, CircularProgress, Stack, Typography } from '@mui/material';
import { Rap } from '@prisma/client';
import { getFormattedDate } from 'src/@core/utils/get-formatted-date';
import { api } from 'src/utils/api';
import UserAvatar from '../UserAvatar';
import SendRequestButton from './SendRequestButton';

interface ReviewRequesterProps {
  rap?: Rap | null;
}

function ReviewRequester({ rap }: ReviewRequesterProps) {
  const { data: usersData, isLoading } = api.reviewRequests.getPotentialReviewers.useQuery({
    rapId: rap?.id || ''
  });

  const { data: currentUserData } = api.user.getCurrentUser.useQuery();

  return (
    <>
      {currentUserData?.reviewRequestTokens === 0 && (
        <Alert severity='info' sx={{ mb: '1rem' }}>
          You need credits to request a review. You can get credits by reviewing other raps.
        </Alert>
      )}
      <Typography
        variant='body1'
        sx={{
          mb: '1rem'
        }}
      >
        Credits Available: <b>{currentUserData?.reviewRequestTokens}</b>
      </Typography>
      <Stack alignItems='center' justifyContent='top'>
        {usersData?.map(user => (
          <Stack
            key={user.id}
            bgcolor={theme => theme.palette.grey[900]}
            p='1rem 1.5rem'
            mb='.5rem'
            width='100%'
            direction='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <Stack direction='row' alignItems='center'>
              <UserAvatar url={user?.profileImageUrl} size={40} />
              <Stack ml='1rem' direction='column' alignItems='flex-start'>
                <Typography fontWeight='600'>{user.username}</Typography>
                <Typography variant='caption' color='text.secondary'>
                  {`Active ${getFormattedDate(user.lastOnline)}`}
                </Typography>
              </Stack>
            </Stack>
            <SendRequestButton rapId={rap?.id} requestedUserId={user.id} />
          </Stack>
        ))}
        {isLoading && <CircularProgress color='inherit' />}
        {usersData?.length === 0 && !isLoading && <Typography>No users found</Typography>}
      </Stack>
    </>
  );
}

export default ReviewRequester;
