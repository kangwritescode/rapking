import { Box } from '@mui/material';
import { Rap, User } from '@prisma/client';
import RapCard from '../RapCard';

interface RapsTabProps {
  raps?: (Rap & { user: User })[] | null;
  isCurrentUser?: boolean;
}

function RapsTab({ raps, isCurrentUser }: RapsTabProps) {
  return (
    <Box py={6} px={2}>
      {raps?.map(rap => (
        <RapCard key={rap.id} rap={rap} hideAvatar hideUsername showMenu={isCurrentUser} />
      ))}
    </Box>
  );
}

export default RapsTab;
