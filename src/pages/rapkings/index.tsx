import { Box, Typography, useTheme } from '@mui/material';
import Footer from 'src/components/Footer';

function RapKingsPage() {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          padding: `2rem ${theme.spacing(6)}`,
          transition: 'padding .25s ease-in-out',
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4)
          },
          position: 'relative',
          height: `calc(100% - 3.5rem)`
        }}
      >
        <Typography component='h1' fontSize='2rem' fontFamily='impact' mb='1rem'>
          RapKings
        </Typography>
        <Typography variant='body1' maxWidth='40rem' mb='1rem'>
          Starting February 1st, 2024, RapKing will start posting the users with the most points
          from the previous months, years, etc. here.
        </Typography>
        <Box
          component='iframe'
          src='https://giphy.com/embed/xThtasSYZqQ3mpFXIA'
          allowFullScreen
          sx={{
            width: {
              xs: '100%',
              sm: '34rem'
            },
            height: {
              xs: '16rem',
              sm: '20rem'
            },
            border: 'none'
          }}
        />
        <Typography variant='body1' mt='1rem' mb='1rem'>
          Stay tuned.
        </Typography>
      </Box>
      <Footer />
    </>
  );
}

export default RapKingsPage;
