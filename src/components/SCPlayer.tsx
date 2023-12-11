import { Box, SxProps } from '@mui/material';

interface SCPlayerProps {
  url: string;
  showArtwork?: boolean;
  sx?: SxProps;
}

function SCPlayer({ url, showArtwork, sx }: SCPlayerProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        ...sx,
        border: 'none'
      }}
      component='iframe'
      width='100%'
      src={`https://w.soundcloud.com/player/?url=${url}?show_artwork=${
        showArtwork ?? false
      }&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false`}
    />
  );
}

export default SCPlayer;
