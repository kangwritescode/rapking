import { Box, Button, CardMedia, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import Footer from 'src/components/Footer';
import RapRoyaleDataGrid from 'src/components/RapRoyale/RapRoyaleDataGrid';

function RapRoyalePage() {
  const theme = useTheme();
  const router = useRouter();

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
        <Stack direction='row' alignItems='center' justifyContent='center'>
          <CardMedia component='img' image='/images/royale.jpeg' />
        </Stack>
        <Typography variant='h5' align='center' mt='1.5rem' mb='1rem' fontWeight='bold'>
          Rap Royale is a monthly rap competition.
        </Typography>
        <Stack direction='row' alignItems='center' justifyContent='center' mb='1.5rem'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => router.push(`/royale/clud70ke000000itm7g69v684`)}
          >
            View Current Rap Royale
          </Button>
        </Stack>
        <Box
          sx={{
            background: theme.palette.background.paper,
            p: '1.5rem'
          }}
        >
          <Typography fontWeight='600'>How it works:</Typography>
          <br />
          <Typography>Each competition...</Typography>
          <ul>
            <li>Starts on the first day of the month</li>
            <li>Ends on the last day of the month</li>
            <li>Has a new topic and/or unique set of constraints</li>
            <li>
              Only accepts original raps created during the competition period. No pre-written raps
            </li>
            <li>Submissions with the most votes (likes) win</li>
            <li>Top 2 entrants will be awarded a prize (prizes will vary month-to-month)</li>
          </ul>
        </Box>
        <Typography mt='1.5rem' mb='1.5rem' align='center'>
          👇 Select a Rap Royale below to view details and/or results 👇
        </Typography>
        <Box>
          <RapRoyaleDataGrid />
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default RapRoyalePage;
