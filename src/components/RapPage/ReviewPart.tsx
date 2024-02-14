import { Stack, SxProps, Typography } from '@mui/material';
import { Decimal } from '@prisma/client/runtime';
import FireRating from './FireRating';

interface ReviewSectionProps {
  title: string;
  subtitle: string;
  onChange: (rating: number) => void;
  value?: number | Decimal;
  sx?: SxProps;
  readOnly?: boolean;
}

function ReviewPart({ title, subtitle, onChange, value, sx, readOnly }: ReviewSectionProps) {
  return (
    <Stack direction='row' alignItems='top' justifyContent='space-between' sx={sx}>
      <Stack>
        <Typography variant='h6' fontWeight={600}>
          {title}
        </Typography>
        <Typography variant='body2'>{subtitle}</Typography>
      </Stack>
      <FireRating
        value={value}
        precision={0.5}
        sx={{
          fontSize: '2.5rem',
          ml: '1rem',
          width: 'fit-content'
        }}
        onChange={onChange}
        readOnly={readOnly}
      />
    </Stack>
  );
}

export default ReviewPart;
