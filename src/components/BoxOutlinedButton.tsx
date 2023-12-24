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
        position: 'relative',
        width: 'fit-content',
        display: 'inline-block',
        textDecoration: 'none',
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
        zIndex: 5,
        cursor: 'pointer',
        '&:hover': {
          color: 'black',
          backgroundColor: 'white',
          '&::before': {
            transform: 'translateX(0%)'
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',

          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          transition: '0.2s',
          zIndex: -1
        },
        ...sx
      }}
    >
      {children}
    </Box>
  );
}
