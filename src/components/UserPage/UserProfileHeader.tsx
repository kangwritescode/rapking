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
import { useSession } from 'next-auth/react';
import { ReactNode, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import FollowersModal from '../FollowersModal/FollowersModal';
import EditProfileDialog from './EditProfileDialog';
import EditableBanner from './EditableBanner';
import EditableProfilePhoto from './EditableProfilePhoto';
import FollowingButton from './FollowingButton';

const FollowersText = ({ text, onClick }: { text: string | ReactNode; onClick: () => void }) => {
  return (
    <Typography
      onClick={onClick}
      variant='caption'
      sx={{
        ':hover': {
          cursor: 'pointer',
          textDecoration: 'underline'
        }
      }}
    >
      {text}
    </Typography>
  );
};

interface UserProfileHeaderProps {
  userData?: Partial<User> | null;
  isCurrentUser?: boolean;
}

const UserProfileHeader = ({ userData, isCurrentUser }: UserProfileHeaderProps) => {
  const session = useSession();

  // State
  const [modalIsOpen, setIsModalIsOpen] = useState<boolean>(false);
  const [followingUser, setFollowingUser] = useState<Partial<User> | null>();
  const [followedUser, setFollowedUser] = useState<Partial<User> | null>();

  // Queries

  const { data: currentUserData } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: !!session.data?.user?.id
  });

  const { data: followData } = api.userFollows.getFollow.useQuery(
    { followerId: currentUserData?.id || '', followedId: userData?.id || '' },
    {
      enabled: !!currentUserData?.id && !!userData?.id
    }
  );

  const { data: userFollowersCount } = api.userFollows.getFollowersCount.useQuery(
    { userId: userData?.id || '' },
    {
      enabled: !!userData?.id
    }
  );

  const { data: userFollowingCount } = api.userFollows.getFollowingCount.useQuery(
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

  return (
    <>
      <EditProfileDialog isOpen={modalIsOpen} handleClose={() => setIsModalIsOpen(false)} />
      <FollowersModal
        isOpen={!!followedUser || !!followingUser}
        followedUser={followedUser}
        followingUser={followingUser}
        handleClose={() => {
          setFollowedUser(undefined);
          setFollowingUser(undefined);
        }}
      />
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
              <Typography
                variant='h5'
                sx={{
                  mb: 0
                }}
              >
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
                  <FollowersText
                    text={`${userFollowersCount || 0} Followers`}
                    onClick={() => setFollowedUser(userData)}
                  />
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
                  <FollowersText text={`${userFollowingCount || 0} Following`} onClick={() => {}} />
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
  );
};

export default UserProfileHeader;
