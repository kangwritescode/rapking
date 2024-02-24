import { Icon } from '@iconify/react';
import { Button, Divider, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DashboardRaps from 'src/components/DashboardPage/DashboardRaps';
import ReviewRequestAlert from 'src/components/DashboardPage/ReviewRequestAlert';
import { api } from 'src/utils/api';

const greetings = ['Welcome back', `What's good`, `What's up`];

function DashboardPage() {
  // ** Hooks
  const theme = useTheme();

  // ** Queries
  const { data: userData } = api.user.getCurrentUser.useQuery();

  // ** State
  const [tab, setTab] = useState(0);
  const [greeting, setGreeting] = useState('Welcome back');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
  }, []);

  const shortcuts = [
    {
      label: 'View Profile',
      icon: 'bi:person-fill',
      link: `/u/${userData?.username}`
    },
    {
      label: 'Account Settings',
      icon: 'bi:gear-fill',
      link: '/settings'
    }
  ];

  return (
    <Stack
      sx={{
        padding: `2rem ${theme.spacing(6)} 2rem`,
        transition: 'padding .25s ease-in-out',
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        }
      }}
    >
      <Stack
        sx={{
          width: {
            xs: '100%',
            md: '50rem',
            lg: '60rem'
          },
          m: 'auto'
        }}
      >
        <Typography variant='h6'>
          {greeting}, <strong>{userData?.username}</strong>
        </Typography>
        <Stack direction='row' alignItems='center' sx={{ mt: '1rem', mb: '.75rem' }}>
          {shortcuts.map((shortcut, index) => (
            <Button
              key={index}
              startIcon={<Icon icon={shortcut.icon} fontSize='2rem' />}
              variant='text'
              size='small'
              component={Link}
              href={shortcut.link}
              color='primary'
              sx={{ mr: '.5rem' }}
            >
              {shortcut.label}
            </Button>
          ))}
        </Stack>
        <Divider />
        <ReviewRequestAlert />
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
          <Tab label='Raps' />
        </Tabs>
        <Divider />
        {tab === 0 && <DashboardRaps />}
      </Stack>
    </Stack>
  );
}

export default DashboardPage;
