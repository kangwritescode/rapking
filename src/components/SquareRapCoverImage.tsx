import { CardMedia } from '@mui/material';
import { BUCKET_URL } from 'src/shared/constants';

interface SquareRapCoverImageProps {
  coverArtUrl?: string | null;
  onClick?: () => void;
  size?: number;
  borderRadius?: number;
}

function SquareRapCoverImage({
  coverArtUrl,
  onClick,
  size,
  borderRadius = 2
}: SquareRapCoverImageProps) {
  return (
    <CardMedia
      component='img'
      alt='rap-cover-art'
      onClick={onClick}
      image={coverArtUrl ? `${BUCKET_URL}/${coverArtUrl}` : `${BUCKET_URL}/default/cover-art.jpg`}
      sx={{
        height: size,
        width: size,
        borderRadius: borderRadius,
        cursor: 'pointer'
      }}
    />
  );
}

export default SquareRapCoverImage;
