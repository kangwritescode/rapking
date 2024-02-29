import { Stack, useTheme } from '@mui/material';
import Discussions from 'src/components/Forum/Discussions';
import ForumThreadCreator from 'src/components/Forum/ForumThreadCreator';

function Forum() {
  const theme = useTheme();

  return (
    <Stack
      width={{
        xs: '100%',
        md: 'fit-content'
      }}
      height='100%'
      mx='auto'
      sx={{
        padding: `1.5rem ${theme.spacing(6)} 1rem`,
        transition: 'padding .25s ease-in-out',
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        }
      }}
    >
      <Stack
        width={{
          xs: '100%',
          md: '42rem'
        }}
      >
        <ForumThreadCreator />
        <Discussions sx={{ mt: '1rem' }} />
      </Stack>
    </Stack>
  );
}

export default Forum;
