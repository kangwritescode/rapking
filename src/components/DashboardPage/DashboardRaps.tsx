import { Icon } from '@iconify/react';
import { Box, Button, Divider } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Fragment } from 'react';
import { api } from 'src/utils/api';
import DashboardRap from './DashboardRap';

function DashboardRaps() {
  const session = useSession();
  const { data: rapsData } = api.rap.getRapsByUser.useQuery({
    userId: session.data?.user.id || ''
  });

  return (
    <Box pt='1rem'>
      <Link href='/write' passHref>
        <Button
          startIcon={<Icon icon='mdi:plus' />}
          color='secondary'
          variant='text'
          size='small'
          sx={{ mb: '1rem' }}
        >
          Create New Rap
        </Button>
      </Link>
      {rapsData?.map((rap, i) => (
        <Fragment key={rap.id}>
          <Divider />
          <DashboardRap rap={rap} />
          {i === rapsData.length - 1 && <Divider />}
        </Fragment>
      ))}
    </Box>
  );
}

export default DashboardRaps;
