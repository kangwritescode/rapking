import { Box, Typography, useTheme } from '@mui/material';

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
        },
        position: 'relative',
        height: '100%'
      }}
    >
      <Typography
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        Coming Soon!
      </Typography>
    </Box>
  );
}

export default RapKingsPage;
