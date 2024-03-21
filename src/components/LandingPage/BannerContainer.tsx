import { Box, Divider, Stack, SxProps } from '@mui/material';

interface BannerContainerProps {
  children?: React.ReactNode;
  sx?: SxProps;
}

function BannerContainer({ children, sx }: BannerContainerProps) {
  return (
    <>
      <Stack
        sx={{
          position: 'relative',
          background: 'black',
          alignItems: 'left',
          justifyContent: 'center',
          ...sx
        }}
      >
        {children}
        <Box
          position='absolute'
          height='100%'
          left='0'
          top='0'
          width='90%'
          sx={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 1),  rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.0))`,
            zIndex: 2
          }}
        />
        <Box position='absolute' height='100%' width='70%' right='0' top='0'>
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              backgroundColor: 'rgba(36, 24, 3, 0.159)',
              zIndex: 0
            }}
          />
          <Box
            component='video'
            src={'/videos/splash.webm'}
            autoPlay={true}
            loop={true}
            playsInline={true}
            muted
            sx={{
              objectFit: 'cover',
              height: '100%',
              zIndex: -10,
              top: 0,
              left: 0,
              width: '100%'
            }}
          />
        </Box>
      </Stack>
      <Divider />
    </>
  );
}

export default BannerContainer;
