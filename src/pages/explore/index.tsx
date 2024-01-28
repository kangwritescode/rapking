import { Box, Stack, Tab, Tabs, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { CountryFilter, SexFilter, SortByValue, TimeFilter } from 'src/server/api/routers/rap';
import FeedBar from '../../components/ExplorePage/FeedBar';

import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Feed from '../../components/ExplorePage/Feed';

const ExploreHead = () => (
  <Head>
    <title key='title'>Explore - RapKing</title>
    <meta name='description' content='Write, judge, and discuss raps.' />
    <meta property='og:title' content='Explore - RapKing' />
    <meta property='og:description' content='Write, judge, and discuss raps.' />
    <meta property='og:url' content='https://rapking.io/explore' />
    <meta property='og:image' content='https://rapking.io/images/crown.svg' />
    <meta property='og:type' content='website' />
    <meta property='og:site_name' content='RapKing' />
    <meta property='og:locale' content='en_US' />
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content='Explore - RapKing' />
    <meta name='twitter:description' content='Write, judge, and discuss raps.' />
    <meta name='twitter:image' content='https://rapking.io/images/crown.svg' />
    <meta name='twitter:domain' content='rapking.io' />
    <link rel='canonical' href='https://rapking.io/explore' />
  </Head>
);

function ExplorePage() {
  const theme = useTheme();
  const { status } = useSession();
  const { query } = useRouter();
  const queryCountryFilter = query['us-country'] as CountryFilter;

  // Tabs
  const [tab, setTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  // Feed
  const [sortByValue, setSortByValue] = useState<SortByValue>('NEWEST');
  const [countryFilter, setCountryFilter] = useState<CountryFilter>(queryCountryFilter || 'ALL');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL');
  const [sexFilter, setSexFilter] = useState<SexFilter>('ANY');
  const followingFilter = tab === 1;

  return (
    <>
      <ExploreHead />
      <Stack
        alignItems='center'
        sx={{
          margin: 'auto',
          height: '100%',
          padding: `1.5rem ${theme.spacing(6)}`,
          transition: 'padding .25s ease-in-out',
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4)
          }
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: '1rem',
            width: ['100%', '90%', '80%'],
            maxWidth: '45rem',
            mx: 'auto'
          }}
        >
          <Tabs
            value={tab}
            onChange={handleChange}
            sx={{
              ['& .Mui-selected']: {
                color: theme.palette.grey[100] + ' !important'
              },
              ['& .MuiTabs-indicator']: {
                backgroundColor: theme.palette.grey[100]
              }
            }}
          >
            <Tab label='All' />
            {status === 'authenticated' && <Tab label='Following' />}
          </Tabs>
        </Box>
        <FeedBar
          sx={{ mb: '2rem', width: ['100%', '90%', '80%'], maxWidth: '45rem', mx: 'auto' }}
          onSortAndFilterChange={({ sortBy, countryFilter, timeFilter, sexFilter }) => {
            setSortByValue(sortBy);
            setCountryFilter(countryFilter);
            setTimeFilter(timeFilter);
            setSexFilter(sexFilter);
          }}
        />
        <Feed
          sortBy={sortByValue}
          countryFilter={countryFilter}
          timeFilter={timeFilter}
          followingFilter={followingFilter}
          sexFilter={sexFilter}
        />
      </Stack>
    </>
  );
}

export default ExplorePage;

import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  const redirectToCreateProfilePage =
    session && (!session?.user.profileIsComplete || !session?.user.isWhitelisted);

  if (redirectToCreateProfilePage) {
    return {
      redirect: {
        destination: '/create-profile/',
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};
