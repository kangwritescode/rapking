import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Divider, Stack, TextField, Typography, useTheme } from '@mui/material';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from 'src/components/Footer';
import { z } from 'zod';

const emailSchema = z.string().email();

function AuthPage() {
  const [providers, setProviders] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [isEmailSigningIn, setIsEmailSigningIn] = useState(false);

  const router = useRouter();
  const { error } = router.query;

  const session = useSession();

  useEffect(() => {
    (async () => {
      const fetchedProviders = await getProviders();
      setProviders(fetchedProviders as any);
    })();
  }, []);

  const handleEmailSignIn = async () => {
    try {
      setIsEmailSigningIn(true);
      await signIn('email', { email });
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsEmailSigningIn(false);
    }
  };

  const buttonInfo = (providerName: string) => {
    switch (providerName) {
      case 'Discord':
        return {
          bgcolor: '#5865F2',
          color: 'white',
          icon: 'ic:baseline-discord'
        };
      case 'Google':
        return {
          bgcolor: 'white',
          color: 'black',
          icon: 'logos:google-gmail'
        };
      case 'Email':
        return {
          bgcolor: '#333333',
          color: 'white',
          icon: 'mdi:email'
        };
      default:
        return {
          bgcolor: '#1976D2',
          color: 'white',
          icon: 'mdi:account'
        };
    }
  };

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [session, router]);

  const theme = useTheme();

  const isValidEmail = emailSchema.safeParse(email).success;

  return (
    <>
      <Stack sx={{ width: '100%', height: 'calc(100vh - 3.75rem)' }} alignItems='center' pt='2rem'>
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
            Continue with
          </Typography>
          <Typography variant='subtitle1' fontSize='.75rem' id='email'>
            Email
          </Typography>
          <TextField
            aria-labelledby='email'
            placeholder='Type your email'
            size='small'
            sx={{
              mb: '.75rem'
            }}
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
          {error && (
            <Alert severity='error' sx={{ mb: '1rem' }}>
              There was an error signing in. Please try again or contact support.
            </Alert>
          )}

          <LoadingButton
            variant='contained'
            startIcon={<Icon icon='mdi:email' />}
            onClick={handleEmailSignIn}
            fullWidth
            sx={{
              mb: '1.5rem'
            }}
            disabled={!email || !isValidEmail}
            loading={isEmailSigningIn}
          >
            Continue
          </LoadingButton>
          <Box>
            <Divider
              sx={{
                mb: '1.5rem'
              }}
            >
              <Typography px='.25rem' variant='caption' fontSize='.75rem' textTransform='uppercase'>
                or
              </Typography>
            </Divider>
          </Box>
          {providers &&
            Object.values(providers).map((provider: any) => {
              const { bgcolor, color, icon } = buttonInfo(provider.name);

              if (provider.name === 'Email') return null;

              return (
                <Button
                  key={provider.name}
                  variant='contained'
                  startIcon={<Icon icon={icon} />}
                  sx={{
                    bgcolor,
                    color,
                    '&:hover': {
                      bgcolor: bgcolor,
                      opacity: 0.9
                    },
                    mb: '.75rem'
                  }}
                  onClick={() => signIn(provider.id)}
                  fullWidth
                >
                  Continue with {provider.name}
                </Button>
              );
            })}
        </Stack>
      </Stack>
      <Footer />
    </>
  );
}

export default AuthPage;

AuthPage.getLayout = (page: React.Component) => page;
