import { Box, SxProps, useTheme } from '@mui/material';

interface VirtuosoStylesProps {
  children?: React.ReactNode;
  sx?: SxProps;
}

function VirtuosoStyles({ children, sx }: VirtuosoStylesProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        "& div[data-test-id='virtuoso-scroller']": {
          '&::-webkit-scrollbar': {
            width: '0.5rem'
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey[900]
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.grey[800],
            borderRadius: '1rem'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.grey[700]
          }
        },
        ...sx
      }}
    >
      {children}
    </Box>
  );
}

export default VirtuosoStyles;
