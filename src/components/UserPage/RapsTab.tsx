import { Box, Typography } from '@mui/material';
import { Rap, User } from '@prisma/client';
import RapCard from '../RapCard';

interface RapsTabProps {
  raps?: (Rap & { user: User })[] | null;
}

function RapsTab({ raps }: RapsTabProps) {
  return (
    <Box py={6} px={2}>
      {raps?.map(rap => (
        <RapCard key={rap.id} rap={rap} hideAvatar hideUsername showMenu />
      ))}
      {raps?.length === 0 && <Typography>No raps yet.</Typography>}
    </Box>
  );
}

export default RapsTab;
