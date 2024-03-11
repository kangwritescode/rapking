import { CircularProgress, Stack } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from 'src/utils/api';

const incompleteProfilePaths = ['/create-profile', '/create-profile/', '/rules', '/rules/'];

const CreateProfileGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [profileIsComplete, setProfileIsComplete] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  const router = useRouter();

  const { data: userData, isLoading: isUserDataLoading } = api.user.getCurrentUser.useQuery();

  useEffect(() => {
    // Check if session or user data is still loading
    if (status === 'loading' || isUserDataLoading) {
      setIsLoading(true);

      return;
    }

    setProfileIsComplete(session?.user?.profileIsComplete || userData?.profileIsComplete || false);
    setUsername(session?.user?.username || userData?.username || '');

    setIsLoading(false);
  }, [status, session, userData, isUserDataLoading]);

  useEffect(() => {
    if (isLoading) return;

    const shouldRedirectToCreateProfile = !profileIsComplete && status === 'authenticated';

    if (shouldRedirectToCreateProfile && !incompleteProfilePaths.includes(router.pathname)) {
      router.push('/create-profile/');
    } else if (!shouldRedirectToCreateProfile && router.pathname === '/create-profile') {
      router.push(`/u/${username}`);
    }
  }, [isLoading, profileIsComplete, username, router, status]);

  if (isLoading && status === 'authenticated') {
    return (
      <Stack
        sx={{
          height: '100vh',
          width: '100vw',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress
          sx={{
            mb: '1rem'
          }}
          color='secondary'
        />
        RapKing is Loading...
      </Stack>
    );
  }

  return <>{children}</>;
};

export default CreateProfileGuard;
