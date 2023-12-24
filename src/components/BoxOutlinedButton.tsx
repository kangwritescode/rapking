import { Box, SxProps } from '@mui/material';

export default function BoxOutlineButton({
  children,
  onClick,
  sx
}: {
  children: React.ReactNode | string;
  onClick?: () => void;
  sx?: SxProps;
}) {
  return (
    <Box
      component='a'
      onClick={e => {
        e.preventDefault();
        onClick && onClick();
      }}
      sx={{
        color: 'white',
        fontFamily: 'impact',
        fontSize: '1.5rem',
        letterSpacing: '0.2rem',
        textTransform: 'uppercase',
        padding: '1rem 2rem',
        border: '2px solid',
        borderColor: 'white',
        overflow: 'hidden',
        transition: '0.2s',
        cursor: 'pointer',
        '&:hover': {
          color: 'black',
          backgroundColor: 'white'
        },
        ...sx
      }}
    >
      {children}
    </Box>
  );
}
