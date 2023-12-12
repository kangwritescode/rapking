import { CircularProgress, Stack } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect } from 'react';
import VideoBackground from 'src/components/UI/VideoBackground';
import { api } from 'src/utils/api';

interface CreateProfileGuardProps {
  children: ReactNode;
}

const CreateProfileGuard: React.FC<CreateProfileGuardProps> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();
  const {
    data: profileIsComplete,
    fetchStatus,
    isLoading
  } = api.user.getProfileIsComplete.useQuery(undefined, {
    enabled: status === 'authenticated'
  });

  const isDataLoading = status === 'loading' || (fetchStatus !== 'idle' && isLoading);

  useEffect(() => {
    if (isDataLoading) return;

    if (status === 'authenticated') {
      if (!profileIsComplete && router.asPath !== '/create-profile/') {
        router.replace('/create-profile/');
      } else if (profileIsComplete && router.asPath === '/create-profile/') {
        router.replace('/');
      }
    }
  }, [status, profileIsComplete, router, isDataLoading]);

  return isDataLoading ? (
    <>
      <VideoBackground
        videoSrc='/videos/nafla-blows.webm'
        imageSrc='/images/nafla-blows.jpg'
        filterColor='rgba(19, 13, 3, 0.8)'
      />
      <Stack alignItems='center' height='100vh' justifyContent='center'>
        <CircularProgress
          disableShrink
          color='inherit'
          sx={{
            mb: 3
          }}
        />
        Loading RapKing...
      </Stack>
    </>
  ) : (
    children
  );
};

export default CreateProfileGuard;
