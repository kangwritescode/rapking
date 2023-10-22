// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports


// ** Icon Imports
import { Icon } from '@iconify/react'
import { User } from '@prisma/client'
import EditableBanner from './EditableBanner'
import EditableProfilePhoto from './EditableProfilePhoto'
import EditProfileDialog from './EditProfileDialog'
import { useState } from 'react'
import { api } from 'src/utils/api'
import FollowingButton from './FollowingButton'
import { CircularProgress } from '@mui/material'

interface UserProfileHeaderProps {
  userData?: User | null;
  currentUserData?: User | null;
}

const UserProfileHeader = ({ userData, currentUserData }: UserProfileHeaderProps) => {

  // State
  const [modalIsOpen, setIsModalIsOpen] = useState<boolean>(false)

  // Queries
  const { data: followData } = api.userFollows.getFollow.useQuery({ followerId: currentUserData?.id || '', followedId: userData?.id || '' }, {
    enabled: !!currentUserData?.id && !!userData?.id
  })

  // Mutations
  const { mutate: createFollow, isLoading: createFollowIsLoading } = api.userFollows.createFollow.useMutation();
  const { mutate: deleteFollow, isLoading: deleteFollowIsLoading } = api.userFollows.deleteFollow.useMutation();

  // Invalidators
  const { invalidate: invalidateFollowsQuery } = api.useContext().userFollows

  // Handlers
  const followButtonClickHandler = () => {
    createFollow({ followerId: currentUserData?.id || '', followedId: userData?.id || '' }, {
      onSuccess: () => {
        invalidateFollowsQuery()
      }
    })
  }

  const unfollowButonClickHandler = () => {
    deleteFollow({ followerId: currentUserData?.id || '', followedId: userData?.id || '' }, {
      onSuccess: () => {
        invalidateFollowsQuery()
      }
    })
  }

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
              ml: { xs: 0, md: 6 },
              alignItems: 'flex-end',
              flexWrap: ['wrap', 'nowrap'],
              justifyContent: ['center', 'space-between']
            }}
          >
            <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
              <Typography variant='h5' sx={{ mb: 4 }}>
                {userData?.username}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: ['center', 'flex-start']
                }}
              >
                <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                  <Icon icon='material-symbols:male' />
                  <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>
                    {userData.sex === 'male' ? 'Male' : 'Female'}
                  </Typography>
                </Box>
                <Box sx={{ mr: 5, display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                  <Icon icon='mdi:map-marker-outline' />
                  <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>{userData?.city + ', ' + userData?.state}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1, color: 'text.secondary' } }}>
                  <Icon icon='mdi:calendar-blank' />
                  <Typography sx={{ ml: 1, color: 'text.secondary', fontWeight: 600 }}>
                    Joined {userData?.createdAt && userData.createdAt.toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {isCurrentUser ? (
              <Button
                sx={{ borderRadius: "20px" }}
                variant='outlined'
                color="secondary"
                onClick={() => setIsModalIsOpen(true)}
                startIcon={
                  <Icon icon='mdi:pencil-outline' />
                }>
                Edit Profile
              </Button>
            ) : followData ?
              <FollowingButton isLoading={deleteFollowIsLoading} unfollowClickHandler={unfollowButonClickHandler} />
              :
              <Button
                variant='contained'
                color='primary'
                onClick={followButtonClickHandler}
                disabled={createFollowIsLoading}
                {...(!createFollowIsLoading ? { startIcon: <Icon icon='mdi:account-plus-outline' /> } : {})}
                sx={{ minWidth: '8rem' }}
              >
                {createFollowIsLoading ? <CircularProgress color='inherit' size='1.5rem' /> : 'Follow'}
              </Button>}
          </Box>
        </CardContent>
      </Card>
    </>
  ) : null
}

export default UserProfileHeader

