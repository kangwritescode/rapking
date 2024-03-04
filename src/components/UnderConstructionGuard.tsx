import { Icon } from '@iconify/react';
import { Stack, Typography, useTheme } from '@mui/material';

interface UnderConstructionGuardProps {
  children: React.ReactNode;
}

function UnderConstructionGuard({ children }: UnderConstructionGuardProps) {
  const theme = useTheme();
  if (process.env.NEXT_PUBLIC_IS_UNDER_CONSTRUCTION === 'true') {
    return (
      <Stack height='100vh' width='100vw' alignItems='center' justifyContent='center'>
        <Icon icon='tabler:crown' color={theme.palette.secondary.main} height={60} width={60} />
        <Typography variant='h5' fontWeight='600' mt={2}>
          RapKing is under construction
        </Typography>
        <Typography variant='subtitle1' color='text.secondary' mt={2}>
          Stay tuned
        </Typography>
      </Stack>
    );
  }

  return <>{children}</>;
}

export default UnderConstructionGuard;
