import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { api } from 'src/utils/api';

interface CreateProfileGuardProps {
    children: ReactNode;
}

const CreateProfileGuard: React.FC<CreateProfileGuardProps> = ({ children }) => {
    const { status } = useSession();
    const router = useRouter();
    const { data: profileIsComplete, isLoading: isProfileLoading } = api.user.getProfileIsComplete.useQuery();

    // Ensuring both session and profile data are settled
    const isDataLoading = status === 'loading' || isProfileLoading;

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

    return children;
};

export default CreateProfileGuard;
