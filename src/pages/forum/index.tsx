import { Stack, useTheme } from '@mui/material';
import Footer from 'src/components/Footer';
import Discussions from 'src/components/Forum/Discussions';
import ForumThreadCreator from 'src/components/Forum/ForumThreadCreator';

export const ForumViewWrapper = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <>
      <Stack
        width={{
          xs: '100%',
          md: 'fit-content'
        }}
        height='calc(100% - 3.75rem)'
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
          {children}
        </Stack>
      </Stack>
      <Footer />
    </>
  );
};

function Forum() {
  return (
    <ForumViewWrapper>
      <ForumThreadCreator />
      <Discussions sx={{ mt: '1rem', mb: '4rem' }} />
    </ForumViewWrapper>
  );
}

export default Forum;
