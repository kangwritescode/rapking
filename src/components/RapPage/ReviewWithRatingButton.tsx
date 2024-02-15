import { Box } from '@mui/material';
import { api } from 'src/utils/api';
import ColoredIconButton from '../ColoredIconButton';

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
  const { data: userHasReviewed } = api.reviews.userHasReviewed.useQuery(
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
      <ColoredIconButton
        onClick={onClick}
        sx={{ pr: 1 }}
        icon='mdi:fire'
        iconColor='orange'
        isColored={userHasReviewed}
      />
      {total || 0}
    </Box>
  );
}

export default ReviewWithRatingButton;
