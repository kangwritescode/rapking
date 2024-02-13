import { Icon } from '@iconify/react';
import { Rating, Stack, SxProps } from '@mui/material';

interface FireRatingProps {
  sx?: SxProps;
  defaultValue?: number;
  precision?: number;
  fontSize?: string;
  onChange?: (rating: number) => void;
}

function FireRating({ sx, defaultValue, precision, fontSize, onChange }: FireRatingProps) {
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
        name='customized-color'
        defaultValue={defaultValue}
        onChange={onRatingChange}
        getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
        precision={precision}
        icon={<Icon icon='mdi:fire' />}
        emptyIcon={<Icon icon='mdi:fire' />}
      />
    </Stack>
  );
}

export default FireRating;
