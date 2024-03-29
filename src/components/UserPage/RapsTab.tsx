import { Box, Divider, SxProps, Typography } from '@mui/material';
import { Promotion, Rap, User } from '@prisma/client';
import { Fragment } from 'react';
import RapCard from '../RapCard';
import { Collaborator } from '../WritePage/RapEditor';

interface RapsTabProps {
  raps?:
    | (Rap & {
        user: Partial<User>;
        collaborators: Array<Collaborator>;
        promotions?: Array<Partial<Promotion>>;
      })[]
    | null;
  isCurrentUser?: boolean;
  sx?: SxProps;
}

function RapsTab({ raps, isCurrentUser, sx }: RapsTabProps) {
  return (
    <Box py={6} px={2} sx={sx}>
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
      {raps?.length === 0 && <Typography>No public raps.</Typography>}
    </Box>
  );
}

export default RapsTab;
