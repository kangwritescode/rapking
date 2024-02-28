import { Icon } from '@iconify/react';
import { Alert, Stack, Typography, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function VerifyRequestPage() {
  const theme = useTheme();

  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <Stack
      sx={{
        alignItems: 'center',
        height: '100vh',
        pt: '2rem'
      }}
    >
      <Icon icon='tabler:crown' color={theme.palette.secondary.main} height={60} width={60} />
      <Stack
        width={{
          xs: 'calc(100% - 2rem)',
          sm: '26rem'
        }}
        padding='1.5rem 2rem'
        bgcolor='background.paper'
        border={`1px solid ${theme.palette.grey[800]}`}
        mt='1rem'
        borderRadius={2}
      >
        <Typography fontSize='1.25rem' mb='1.5rem' align='center' fontWeight={600}>
          Check your email
        </Typography>
        <Typography variant='body1' mb='1rem'>
          A sign in link has been sent to your email address.
        </Typography>
        <Alert severity='info'>
          If you don't see the email, check other places it might be, like your junk, spam, social,
          or other folders.
        </Alert>
      </Stack>
    </Stack>
  );
}

export default VerifyRequestPage;

VerifyRequestPage.getLayout = (page: React.Component) => page;
