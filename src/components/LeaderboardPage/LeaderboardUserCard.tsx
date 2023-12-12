import { Avatar, Box, Card, Stack, SxProps, Typography } from '@mui/material';
import { User } from '@prisma/client';
import { BUCKET_URL } from 'src/shared/constants';
import RapCardChip from '../RapCardChip';

interface LeaderboardUserCardProps {
  userData?: User | null;
  sx?: SxProps;
}
function LeaderboardUserCard({ userData, sx }: LeaderboardUserCardProps) {
  const formattedAge = userData?.dob ?? new Date();
  const age = new Date().getFullYear() - new Date(formattedAge).getFullYear();

  return (
    <Card
      sx={{
        pr: '1rem',
        pl: '2.5rem',
        py: '1.25rem',
        height: 'fit-content',
        ...sx,
        position: 'relative'
      }}
    >
      <Stack direction='row' alignItems='center' height='100%'>
        <Avatar
          alt='Profile avatar */'
          {...(userData?.profileImageUrl && {
            src: `${BUCKET_URL}/${userData.profileImageUrl}`
          })}
          sx={{ width: '6rem', height: '6rem' }}
        />
        <Stack ml='1rem' height='100%' justifyContent='space-between'>
          <Stack>
            <Typography variant='body1' fontSize='1.25rem' fontWeight='bold'>
              {userData?.username}
            </Typography>
            <Box mb='1rem'>
              <Typography variant='caption' fontWeight='bold'>
                {userData?.sex === 'male' ? 'M' : 'F'}
              </Typography>
              {' | '}
              <Typography variant='caption' fontWeight='bold'>
                {age}
              </Typography>
              {' | '}
              <Typography variant='caption' fontWeight='bold'>
                {`${userData?.city}, ${userData?.state}`}
              </Typography>
            </Box>
            <RapCardChip
              size='small'
              label={userData?.region || ''}
              sx={{ width: 'fit-content' }}
            />
          </Stack>
        </Stack>
        <Stack
          direction='row'
          alignItems='center'
          sx={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: '3.5rem'
          }}
        >
          <Typography
            color='grey.100'
            sx={{
              fontFamily: 'PressStart2P'
            }}
            fontSize='2.5rem'
          >
            {String(userData?.points)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export default LeaderboardUserCard;
