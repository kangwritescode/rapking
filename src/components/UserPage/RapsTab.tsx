import { Box, Divider, Typography } from '@mui/material';
import { Rap, User } from '@prisma/client';
import { Fragment } from 'react';
import RapCard from '../RapCard';

interface RapsTabProps {
  raps?: (Rap & { user: User })[] | null;
  isCurrentUser?: boolean;
}

function RapsTab({ raps, isCurrentUser }: RapsTabProps) {
  return (
    <Box py={6} px={2}>
      {raps?.map(rap => (
        <Fragment key={rap.id}>
          <RapCard rap={rap} showMenu={isCurrentUser} />
          <Divider
            sx={{
              my: 8
            }}
          />
        </Fragment>
      ))}
      {raps?.length === 0 && <Typography>No raps yet.</Typography>}
    </Box>
  );
}

export default RapsTab;
