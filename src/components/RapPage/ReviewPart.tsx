import { Stack, SxProps, Typography } from '@mui/material';
import FireRating from './FireRating';

interface ReviewSectionProps {
  title: string;
  subtitle: string;
  onChange: (rating: number) => void;
  defaultValue: number;
  sx?: SxProps;
}

function ReviewPart({ title, subtitle, onChange, defaultValue, sx }: ReviewSectionProps) {
  return (
    <Stack direction='row' alignItems='top' justifyContent='space-between' sx={sx}>
      <Stack>
        <Typography variant='h6' fontWeight={600}>
          {title}
        </Typography>
        <Typography variant='body2'>{subtitle}</Typography>
      </Stack>
      <FireRating
        defaultValue={defaultValue}
        precision={0.5}
        sx={{
          fontSize: '2.5rem',
          ml: '1rem',
          width: 'fit-content'
        }}
      />
    </Stack>
  );
}

export default ReviewPart;
