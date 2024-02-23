import { Alert, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { Rap } from '@prisma/client';
import { useState } from 'react';
import { api } from 'src/utils/api';
import UserAvatar from '../UserAvatar';
import SendRequestButton from './SendRequestButton';

interface ReviewRequesterProps {
  rap?: Rap | null;
}

function ReviewRequester({ rap }: ReviewRequesterProps) {
  const [value, setValue] = useState<string | undefined>();

  const { data: usersData, isLoading } = api.user.searchUserByUsername.useQuery({
    text: value || '',
    limit: 3,
    excludeSelf: true
  });

  return (
    <>
      <Alert severity='info' sx={{ mb: '1rem' }}>
        You need credits to request a review. You can get credits by reviewing other raps.
      </Alert>
      <Typography
        variant='body1'
        sx={{
          mb: '1rem'
        }}
      >
        Credits Available: <b>0</b>
      </Typography>
      <TextField
        sx={{
          mb: '1.5rem'
        }}
        value={value}
        size='small'
        placeholder='Search RapKing User'
        fullWidth
        onChange={e => setValue(e.target.value)}
      />

      <Stack
        sx={{
          height: '14rem'
        }}
        alignItems='center'
        justifyContent='top'
      >
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
              <Typography ml='1rem' fontWeight='600'>
                {user.username}
              </Typography>
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
