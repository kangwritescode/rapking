import { Box, Button, CardMedia, Chip, Divider, Stack, Typography, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Footer from 'src/components/Footer';
import RoyaleSubmitDialog from 'src/components/RapRoyale/RoyaleSubmitDialog';
import SubmissionsDataGrid from 'src/components/RapRoyale/SubmissionsDataGrid';
import { api } from 'src/utils/api';

function RoyalePage() {
  const theme = useTheme();
  const router = useRouter();

  const session = useSession();
  const userId = session.data?.user?.id || '';

  const { id } = router.query;

  const { data: royaleData } = api.royales.get.useQuery({ id: (id as string) || '' });

  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const submissions = royaleData?.submissions || [];

  const userHasSubmitted = submissions.some(sub => sub.userId === userId);

  return (
    <>
      <RoyaleSubmitDialog
        isOpen={dialogIsOpen}
        handleClose={() => setDialogIsOpen(false)}
        royale={royaleData}
      />
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
        <Box
          sx={{
            background: theme.palette.background.paper,
            p: '1.5rem',
            mt: '1.5rem'
          }}
        >
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Typography variant='h4' component='h1' fontWeight='600'>
              {royaleData?.title}
            </Typography>
          </Stack>
          <Divider sx={{ mt: '1rem', mb: '1rem' }} />
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            sx={{
              mb: '1rem'
            }}
          >
            <span>
              <strong>Competition Period:</strong>{' '}
              {royaleData?.startDate.toLocaleDateString() || new Date().toLocaleDateString()} -{' '}
              {royaleData?.endDate.toLocaleDateString() || new Date().toLocaleDateString()} (PST)
            </span>
            <span>
              Status:{' '}
              <Chip
                label={royaleData?.status === 'NOT_STARTED' ? 'NOT STARTED' : royaleData?.status}
                size='small'
                color={
                  royaleData?.status === 'OPEN'
                    ? 'success'
                    : royaleData?.status === 'NOT_STARTED'
                    ? 'default'
                    : 'error'
                }
              />
            </span>
          </Stack>
          <Divider sx={{ mt: '1rem', mb: '1rem' }} />
          <div dangerouslySetInnerHTML={{ __html: royaleData?.details || '' }} />
          <Stack direction='row' alignItems='center' justifyContent='center'>
            <Button
              variant='contained'
              color='primary'
              sx={{
                my: '1rem'
              }}
              onClick={() => setDialogIsOpen(true)}
              disabled={userHasSubmitted || royaleData?.status !== 'OPEN'}
            >
              {userHasSubmitted
                ? 'Submission Accepted'
                : royaleData?.status === 'NOT_STARTED'
                ? 'Royale Not Started'
                : 'Submit a Rap'}
            </Button>
          </Stack>
        </Box>
        <Typography variant='h5' mt='1.5rem' mb='1rem' fontWeight='bold'>
          All Submissions {submissions.length > 0 ? `(${submissions.length})` : ''}
        </Typography>
        <SubmissionsDataGrid submissions={submissions} />
      </Box>
      <Footer />
    </>
  );
}

export default RoyalePage;
