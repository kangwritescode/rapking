import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { api } from 'src/utils/api';

interface CreateProfileGuardProps {
  children: ReactNode;
}

const CreateProfileGuard: React.FC<CreateProfileGuardProps> = ({ children }) => {
  const router = useRouter();
  const session = useSession();

  const [profileIsComplete, setProfileIsComplete] = useState(false);
  const [isInWhitelist, setIsInWhitelist] = useState(false);

  const { status, data: sessionData } = session;

  const {
    data: profileIsCompleteData,
    fetchStatus,
    isLoading
  } = api.user.getProfileIsComplete.useQuery(undefined, {
    enabled: status === 'authenticated'
  });

  const { data: whiteListData } = api.whitelist.userIsInWhitelist.useQuery();

  useEffect(() => {
    setProfileIsComplete(sessionData?.user.profileIsComplete || (profileIsCompleteData ?? false));
    setIsInWhitelist(whiteListData ?? false);
  }, [profileIsCompleteData, sessionData?.user.profileIsComplete, whiteListData]);

  const isDataLoading = status === 'loading' || (fetchStatus !== 'idle' && isLoading);

  useEffect(() => {
    if (isDataLoading) return;

    if (status === 'authenticated') {
      if ((!profileIsComplete || !isInWhitelist) && router.asPath !== '/create-profile/') {
        router.replace('/create-profile/');
      } else if (profileIsComplete && router.asPath === '/create-profile/') {
        router.replace('/');
      }
    }
  }, [
    status,
    profileIsComplete,
    router,
    isDataLoading,
    isInWhitelist,
    sessionData?.user.profileIsComplete
  ]);

  return children;
};

export default CreateProfileGuard;
