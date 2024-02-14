import { Icon } from '@iconify/react';
import { Rating, Stack, SxProps } from '@mui/material';
import { Decimal } from '@prisma/client/runtime';

interface FireRatingProps {
  sx?: SxProps;
  value?: number | Decimal;
  precision?: number;
  fontSize?: string;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

function FireRating({ sx, value, precision, fontSize, onChange, readOnly }: FireRatingProps) {
  const onRatingChange = (_: any, newValue: number | null) => {
    onChange && newValue && onChange(newValue);
  };

  return (
    <Stack
      alignItems='center'
      justifyContent='center'
      sx={{
        bgcolor: '#232323',
        p: '.25rem .5rem',
        width: 'fit-content',
        height: 'fit-content',
        ...sx
      }}
    >
      <Rating
        sx={{
          '& .MuiRating-iconFilled': {
            color: 'orange'
          },
          '& .MuiRating-iconHover': {
            color: 'orange'
          },
          fontSize: fontSize || '2.5rem'
        }}
        value={Number(value)}
        onChange={onRatingChange}
        precision={precision}
        icon={<Icon icon='mdi:fire' />}
        emptyIcon={<Icon icon='mdi:fire' />}
        readOnly={readOnly}
      />
    </Stack>
  );
}

export default FireRating;
