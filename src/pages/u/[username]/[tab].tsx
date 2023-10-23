// ** React Imports
import { useState, useEffect, ReactElement, SyntheticEvent } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Components
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import { Icon } from '@iconify/react'

// ** Components
import { api } from 'src/utils/api'
import RapsTab from './RapsTab'
import UserProfileHeader from './UserProfileHeader'
import ProfileTab from './ProfileTab'

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
    }
  }
}))

const UserProfile = () => {

  // Session
  const session = useSession();

  // ** Hooks
  const router = useRouter()
  const hideText = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const { username, tab } = router.query;

  // ** Queries
  const { data: userData } = api.user.findByUsername.useQuery({ username: username as string }, {
    enabled: Boolean(username)
  });
  const { data: rapsData } = api.rap.getRapsByUser.useQuery({ userId: userData?.id || '' });
  const { data: currentUserData } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!session.data?.user?.id,
  });

  // ** State
  const [activeTab, setActiveTab] = useState<string>(String(tab))
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/u/${username}/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (userData) {
      setIsLoading(false)
    }
  }, [userData])

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(String(tab))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const tabContentList: { [key: string]: ReactElement } = {
    raps: <RapsTab raps={rapsData} />,
    profile: <ProfileTab userData={userData} />
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader userData={userData} currentUserData={currentUserData} />
      </Grid>
      {activeTab === undefined ? null : (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <TabList
                  variant='scrollable'
                  scrollButtons='auto'
                  onChange={handleChange}
                  aria-label='customized tabs example'
                >
                  <Tab
                    value='profile'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon fontSize={20} icon='iconamoon:profile-fill' />
                        {!hideText && 'Profile'}
                      </Box>
                    }
                  />
                  <Tab
                    value='raps'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon fontSize={20} icon='material-symbols:post' />
                        {!hideText && 'Raps'}
                      </Box>
                    }
                  />
                </TabList>
              </Grid>
              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
                {isLoading ? (
                  <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <CircularProgress sx={{ mb: 4 }} />
                    <Typography>Loading...</Typography>
                  </Box>
                ) : (
                  <TabPanel sx={{ p: 0 }} value={activeTab}>
                    {tabContentList[activeTab]}
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      )}
    </Grid>
  )
}

export default UserProfile

import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext } from 'next';
import { appRouter } from 'src/server/api/root';
import superjson from 'superjson';
import { createTRPCContext } from 'src/server/api/trpc'
import { useSession } from 'next-auth/react'

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const { username } = context.query;

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: superjson,
  });
  await helpers.user.findByUsername.prefetch({ username })

  return {
    props: {
      trpcState: helpers.dehydrate(),
    }
  }
}
