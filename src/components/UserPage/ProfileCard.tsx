// ** MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// ** Third Party Imports

// ** Icon Imports
import { Icon } from '@iconify/react';
import { CircularProgress, useTheme } from '@mui/material';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import AddSocialDialog from './BioCard/AddSocialDialog';
import SocialLinks from './BioCard/SocialLinks';
import EditProfileDialog from './EditProfileDialog';
import EditableBanner from './EditableBanner';
import EditableProfilePhoto from './EditableProfilePhoto';
import FollowingButton from './FollowingButton';

interface ProfileCardProps {
  userData?: Partial<User> | null;
  isCurrentUser?: boolean;
}

const ProfileCard = ({ userData, isCurrentUser }: ProfileCardProps) => {
  const session = useSession();
  const router = useRouter();

  // State
  const [modalIsOpen, setIsModalIsOpen] = useState<boolean>(false);
  const [socialsModalIsOpen, setSocialsModalIsOpen] = useState(false);

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
            router.push('/auth');
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

  const { data: socialLinksData } = api.socialLink.getSocialLinkByUserId.useQuery(
    { userId: userData?.id || '' },
    {
      enabled: !!userData?.id
    }
  );

  const theme = useTheme();

  return (
    <>
      <AddSocialDialog
        isOpen={socialsModalIsOpen}
        onCloseHandler={() => setSocialsModalIsOpen(false)}
      />
      <EditProfileDialog isOpen={modalIsOpen} handleClose={() => setIsModalIsOpen(false)} />
      <Card
        sx={{
          position: 'relative',
          pb: 6,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <EditableBanner isEditable={isCurrentUser} userData={userData} />
        <CardContent
          sx={{
            pt: 0,
            display: 'flex',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            justifyContent: 'center',
            position: 'relative',
            mt: '-3.75rem'
          }}
        >
          <EditableProfilePhoto isEditable={isCurrentUser} userData={userData} />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              ml: 0,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <Typography
              fontSize='2rem'
              fontFamily='impact'
              sx={{
                mb: 4,
                mt: 4
              }}
            >
              {userData?.username}
            </Typography>
            <Typography
              variant='body1'
              color='text.secondary'
              width='85%'
              mb='1.5rem'
              textAlign='center'
            >
              {userData?.bio || `${userData?.username} has not set a bio yet.`}
            </Typography>
            <SocialLinks
              sx={{
                width: '80%',
                mb: 4
              }}
              socialLinks={socialLinksData || []}
              isCurrentUser={Boolean(isCurrentUser)}
              hideEditButtons
            />

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

export default ProfileCard;
