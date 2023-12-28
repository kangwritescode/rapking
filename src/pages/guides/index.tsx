import { Box, Typography, useTheme } from '@mui/material';

function GuidesPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: `2rem ${theme.spacing(6)}`,
        transition: 'padding .25s ease-in-out',
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        },
        position: 'relative',
        height: '100%'
      }}
    >
      <Typography component='h1' fontSize='2rem' fontFamily='impact' mb='1rem'>
        Guides
      </Typography>
      <Typography>Coming Soon!</Typography>
    </Box>
  );
}

export default GuidesPage;
