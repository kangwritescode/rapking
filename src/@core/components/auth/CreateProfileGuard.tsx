import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { api } from 'src/utils/api';
import FallbackSpinner from '../spinner';

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

  return isDataLoading ? <FallbackSpinner /> : children;
};

export default CreateProfileGuard;
