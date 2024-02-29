import { Icon } from '@iconify/react';
import {
  Badge,
  Button,
  Divider,
  Stack,
  SxProps,
  Tab,
  Tabs,
  Typography,
  useTheme
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DashboardRaps from 'src/components/DashboardPage/DashboardRaps';
import ReviewRequestAlert from 'src/components/DashboardPage/ReviewRequestAlert';
import Footer from 'src/components/Footer';
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

  const { data: reviewRequestsCount } = api.reviewRequests.getReviewRequestsCount.useQuery();

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
    },
    {
      label: 'Review Inbox',
      icon: 'bi:inbox-fill',
      link: '/review-inbox'
    }
  ];

  const renderShortcut = (props: { label: string; icon: string; link: string; sx?: SxProps }) => {
    return (
      <Button
        key={props.label}
        startIcon={<Icon icon={props.icon} fontSize='2rem' />}
        variant='outlined'
        component={Link}
        href={props.link}
        color='primary'
        sx={{ wordBreak: 'keep-all', whiteSpace: 'nowrap', mb: '.75rem', ...props.sx }}
      >
        {props.label}
      </Button>
    );
  };

  return (
    <>
      <Stack
        sx={{
          padding: `2rem ${theme.spacing(6)} 0`,
          transition: 'padding .25s ease-in-out',
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4)
          },
          height: '100%',
          justifyContent: 'space-between'
        }}
      >
        <Stack
          sx={{
            width: {
              xs: '100%',
              md: '50rem',
              lg: '60rem'
            },
            m: 'auto',
            height: '100%'
          }}
        >
          <Typography variant='h6'>
            {greeting}, <strong>{userData?.username}</strong>
          </Typography>
          <Stack direction='row' alignItems='center' flexWrap='wrap' sx={{ mt: '1rem' }}>
            {shortcuts.map(shortcut => {
              if (shortcut.label === 'Review Inbox' && reviewRequestsCount) {
                return (
                  <Badge key={shortcut.label} badgeContent={reviewRequestsCount} color='error'>
                    {renderShortcut(shortcut)}
                  </Badge>
                );
              }

              return renderShortcut({
                label: shortcut.label,
                icon: shortcut.icon,
                link: shortcut.link,
                sx: { mr: '.5rem' }
              });
            })}
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
        <Footer
          sx={{
            mt: '5rem'
          }}
        />
      </Stack>
    </>
  );
}

export default DashboardPage;
