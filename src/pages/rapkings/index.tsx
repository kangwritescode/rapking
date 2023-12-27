import { Box, useTheme } from '@mui/material';

function RapKingsPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: `0 ${theme.spacing(6)}`,
        transition: 'padding .25s ease-in-out',
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        }
      }}
    >
      Coming Soon!
    </Box>
  );
}

export default RapKingsPage;
