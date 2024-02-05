import { Box, CardMedia, Stack, Typography, useTheme } from '@mui/material';
import { Rap } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BUCKET_URL } from 'src/shared/constants';
import { formatRapCardDate } from 'src/shared/utils';
import { api } from 'src/utils/api';
import AlertDialog from '../AlertDialog';
import IconLink from '../IconLink';

interface DashboardRapProps {
  rap: Rap;
}

function DashboardRap({ rap }: DashboardRapProps) {
  const { coverArtUrl, title, dateCreated, id } = rap;

  const theme = useTheme();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { mutate: deleteRap, isLoading } = api.rap.deleteRap.useMutation();
  const { invalidate: invalidateRaps } = api.useContext().rap.getRapsByUser;

  return (
    <>
      <AlertDialog
        isOpen={modalIsOpen}
        handleClose={() => setModalIsOpen(false)}
        dialogTitle={`Delete '${title}'?`}
        dialogText={`This action not reversible. Delete '${title}' forever?`}
        submitButtonProps={{
          color: 'error'
        }}
        onSubmitHandler={() =>
          deleteRap(
            { id },
            {
              onSuccess: () => {
                invalidateRaps();
              },
              onError: () => {
                toast.error('Something went wrong. Please try again.');
              }
            }
          )
        }
        actionButtonText='Delete Rap'
        isLoading={isLoading}
      />
      <Stack direction='row' px='.5rem' pt='1rem' pb='.75rem'>
        <Link href={`/rap/${id}`} passHref>
          <CardMedia
            component='img'
            alt='rap-cover-art'
            image={
              coverArtUrl ? `${BUCKET_URL}/${coverArtUrl}` : `${BUCKET_URL}/default/cover-art.jpg`
            }
            sx={{
              height: 60,
              width: 60,
              borderRadius: '8px',
              cursor: 'pointer',
              mr: '1rem'
            }}
          />
        </Link>
        <Stack>
          <Typography fontWeight='600'>
            <Box
              component={Link}
              href={`/write/${id}`}
              sx={{
                textDecoration: 'none',
                color: theme.palette.text.primary,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {title}
            </Box>
          </Typography>
          <Typography variant='caption'>
            {formatRapCardDate(dateCreated)} · {`${rap.likesCount} likes`} ·{' '}
            <Typography
              component='span'
              variant='caption'
              color={rap.status === 'DRAFT' ? theme.palette.error.dark : theme.palette.success.main}
            >
              {`${rap.status === 'PUBLISHED' ? 'Published' : 'Draft'}`}
            </Typography>
          </Typography>
          <Stack direction='row' spacing={1} alignItems='center'>
            <IconLink
              href={`/write/${rap.id}`}
              icon='typcn:pencil'
              text='Edit'
              color={theme.palette.secondary.main}
              gap={theme.spacing(1)}
              fontSize='.875rem'
            />
            &nbsp;
            {`·`}
            <IconLink
              onClick={() => setModalIsOpen(true)}
              icon='icon-park-outline:delete-five'
              text='Delete'
              color={theme.palette.secondary.main}
              gap={theme.spacing(1)}
              fontSize='.875rem'
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
export default DashboardRap;
