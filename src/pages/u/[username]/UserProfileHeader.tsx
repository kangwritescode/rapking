// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { User } from '@prisma/client'
import EditableBanner from './EditableBanner'
import { CDN_URL } from 'src/shared/constants'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '100px',
  border: `5px solid ${theme.palette.common.white}`,
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

interface UserProfileHeaderProps {
  userData?: User | null;
  isCurrentUser?: boolean;
}

const UserProfileHeader = ({ userData, isCurrentUser }: UserProfileHeaderProps) => {

  return userData ? (
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
        <ProfilePicture
          src={userData?.profileImageUrl || CDN_URL + '/default/profile-male-default.jpg'}
          alt='profile-picture'
        />
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
              variant='contained'
              startIcon={
                <Icon icon='mdi:pencil' fontSize={20} />
              }>
              Edit Profile
            </Button>
          ) : undefined}
        </Box>
      </CardContent>
    </Card>
  ): null
}

export default UserProfileHeader
