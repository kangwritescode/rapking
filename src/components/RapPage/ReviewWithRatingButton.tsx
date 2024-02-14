import { Icon } from '@iconify/react';
import { Box, IconButton } from '@mui/material';
import { api } from 'src/utils/api';

interface ReviewWithRatingButtonProps {
  onClick: () => void;
  rapId?: string;
}

function ReviewWithRatingButton({ onClick, rapId }: ReviewWithRatingButtonProps) {
  const { data: overallRatings } = api.reviews.getOverallRatings.useQuery(
    {
      rapId: rapId || ''
    },
    {
      enabled: !!rapId
    }
  );

  const { total } = overallRatings || {};

  return (
    <Box
      sx={{
        ml: 5,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <IconButton
        onClick={onClick}
        sx={{
          pr: 1
        }}
      >
        <Icon icon='mdi:fire' />
      </IconButton>
      {total || 0}
    </Box>
  );
}

export default ReviewWithRatingButton;
