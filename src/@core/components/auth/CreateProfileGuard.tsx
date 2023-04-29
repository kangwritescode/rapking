// ** React Imports
import { ReactNode, ReactElement } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { api } from 'src/utils/api'

interface CreateProfileGuardProps {
    children: ReactNode
    fallback: ReactElement | null
}

const CreateProfileGuard = (props: CreateProfileGuardProps) => {
    const { children, fallback } = props
    const { status } = useSession();
    const router = useRouter()

    // queries
    const { data: profileData } = api.profile.getProfile.useQuery();

    const profileIsIncomplete = profileData === null
        || profileData?.username === null
        || profileData?.dob === null
        || profileData?.state === null
        || profileData?.city === null
        || profileData?.country === null
        || profileData?.sex === null

    if (status === 'loading') {
        return fallback
    }
    if (status === 'authenticated' && profileIsIncomplete && router.asPath !== '/create-profile/') {
        router.replace('/create-profile/')

        return <></>
    }
    if (status === 'authenticated' && !profileIsIncomplete && router.asPath === '/create-profile/') {
        router.replace('/')

        return <></>
    }
    
    return <>{children}</>
}

export default CreateProfileGuard