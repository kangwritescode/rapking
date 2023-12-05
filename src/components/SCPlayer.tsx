import { Box } from '@mui/material';

interface SCPlayerProps {
  url: string;
}

function SCPlayer({ url }: SCPlayerProps) {
  return (
    <Box
      mt='1rem'
      component='iframe'
      width='100%'
      height='6.25rem'
      src={`https://w.soundcloud.com/player/?url=${url}?show_artwork=true&auto_play=false&hide_related=true&show_comments=true&show_user=true&show_reposts=false`}
    />
  );
}

export default SCPlayer;
