// ** MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// ** Third Party Imports

// ** Icon Imports
import { Icon } from '@iconify/react';
import { CircularProgress } from '@mui/material';
import { User } from '@prisma/client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import EditProfileDialog from './EditProfileDialog';
import EditableBanner from './EditableBanner';
import EditableProfilePhoto from './EditableProfilePhoto';
import FollowingButton from './FollowingButton';

interface UserProfileHeaderProps {
  userData?: User | null;
  currentUserData?: User | null;
}

const UserProfileHeader = ({ userData, currentUserData }: UserProfileHeaderProps) => {
  // State
  const [modalIsOpen, setIsModalIsOpen] = useState<boolean>(false);

  // Queries
  const { data: followData } = api.userFollows.getFollow.useQuery(
    { followerId: currentUserData?.id || '', followedId: userData?.id || '' },
    {
      enabled: !!currentUserData?.id && !!userData?.id
    }
  );
  const { data: userFollowsData } = api.userFollows.getFollowersCount.useQuery(
    { userId: userData?.id || '' },
    {
      enabled: !!userData?.id
    }
  );
  const { data: userFollowersData } = api.userFollows.getFollowersCount.useQuery(
    { userId: userData?.id || '' },
    {
      enabled: !!userData?.id
    }
  );

  // Mutations
  const { mutate: createFollow, isLoading: createFollowIsLoading } =
    api.userFollows.createFollow.useMutation();
  const { mutate: deleteFollow, isLoading: deleteFollowIsLoading } =
    api.userFollows.deleteFollow.useMutation();

  // Invalidators
  const { invalidate: invalidateFollowsQuery } = api.useContext().userFollows;

  // Handlers
  const followButtonClickHandler = () => {
    createFollow(
      { followerId: currentUserData?.id || '', followedId: userData?.id || '' },
      {
        onSuccess: () => {
          invalidateFollowsQuery();
        },
        onError: error => {
          if (error.data?.code === 'UNAUTHORIZED') {
            toast.error('You must be logged in to follow a user.');
          } else {
            toast.error(error.message);
          }
        }
      }
    );
  };

  const unfollowButonClickHandler = () => {
    deleteFollow(
      { followerId: currentUserData?.id || '', followedId: userData?.id || '' },
      {
        onSuccess: () => {
          invalidateFollowsQuery();
        }
      }
    );
  };

  const isCurrentUser = currentUserData?.id === userData?.id;

  return userData ? (
    <>
      <EditProfileDialog isOpen={modalIsOpen} handleClose={() => setIsModalIsOpen(false)} />
      <Card>
        <EditableBanner isEditable={isCurrentUser} userData={userData} />
        <CardContent
          sx={{
            pt: 0,
            mt: -8,
            display: 'flex',
            alignItems: 'flex-end',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}
        >
          <EditableProfilePhoto isEditable={isCurrentUser} userData={userData} />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row'
              },
              ml: { xs: 0, md: 6 },
              alignItems: {
                xs: 'center',
                md: 'flex-end'
              },
              flexWrap: ['wrap', 'nowrap'],
              justifyContent: ['center', 'space-between']
            }}
          >
            <Box
              sx={{
                mb: {
                  xs: 6,
                  md: 0
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: {
                  xs: 'center',
                  md: 'flex-start'
                }
              }}
            >
              <Typography variant='h5' sx={{ mb: 0 }}>
                {userData?.username}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: ['center', 'flex-start']
                }}
              >
                <Box
                  sx={{
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant='caption'>{userFollowsData || 0} Followers</Typography>
                </Box>
                <Typography mr='.5rem' color='gray'>
                  |
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { color: 'text.secondary' }
                  }}
                >
                  <Typography variant='caption'>{userFollowersData} Following</Typography>
                </Box>
              </Box>
            </Box>
            {isCurrentUser ? (
              <Button
                sx={{ borderRadius: '20px' }}
                variant='outlined'
                color='secondary'
                onClick={() => setIsModalIsOpen(true)}
                size='small'
                startIcon={<Icon icon='mdi:pencil-outline' />}
              >
                Edit Profile
              </Button>
            ) : followData ? (
              <FollowingButton
                isLoading={deleteFollowIsLoading}
                unfollowClickHandler={unfollowButonClickHandler}
              />
            ) : (
              <Button
                variant='contained'
                color='primary'
                onClick={followButtonClickHandler}
                disabled={createFollowIsLoading}
                {...(!createFollowIsLoading
                  ? { startIcon: <Icon icon='mdi:account-plus-outline' /> }
                  : {})}
                sx={{ minWidth: '8rem' }}
              >
                {createFollowIsLoading ? (
                  <CircularProgress color='inherit' size='1.5rem' />
                ) : (
                  'Follow'
                )}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </>
  ) : null;
};

export default UserProfileHeader;
