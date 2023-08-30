// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { User } from '@prisma/client'
import EditableBanner from './EditableBanner'
import EditableProfilePhoto from './EditableProfilePhoto'

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
  ) : null
}

export default UserProfileHeader
