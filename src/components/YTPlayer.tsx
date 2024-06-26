import { Box, SxProps } from '@mui/material';

interface YTPlayerProps {
  videoId: string | null;
  sx?: SxProps;
}

function YTPlayer({ videoId, sx }: YTPlayerProps) {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        ...sx,
        border: 'none'
      }}
      component='iframe'
      src={`https://www.youtube.com/embed/${videoId}`}
      title='YouTube video player'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
    />
  );
}

export default YTPlayer;
