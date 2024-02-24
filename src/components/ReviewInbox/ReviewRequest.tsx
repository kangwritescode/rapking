import { Checkbox, Stack, Typography, useTheme } from '@mui/material';
import { Rap, ReviewRequest, User } from '@prisma/client';
import SquareRapCoverImage from '../SquareRapCoverImage';

interface ReviewRequestProps {
  reviewRequest: ReviewRequest & { rap: Partial<Rap>; requester: Partial<User> };
  onClick?: (id: ReviewRequest | null) => void;
  isSelected?: boolean;
}

function ReviewRequest({ reviewRequest, onClick, isSelected }: ReviewRequestProps) {
  const theme = useTheme();

  const handleClick = () => {
    if (!onClick) return;
    if (isSelected) {
      onClick(null);
    } else {
      onClick(reviewRequest);
    }
  };

  return (
    <Stack
      direction='row'
      alignItems='center'
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: '1rem',
        px: '1rem',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: isSelected ? theme.palette.action.selected : theme.palette.action.hover
        },
        backgroundColor: isSelected ? theme.palette.action.selected : 'unset'
      }}
      tabIndex={0}
      onClick={handleClick}
    >
      <Checkbox
        color='secondary'
        sx={{
          mr: '1rem'
        }}
      />
      <SquareRapCoverImage coverArtUrl={reviewRequest.rap.coverArtUrl} size={40} borderRadius={1} />
      <Stack ml='1rem'>
        <Typography fontWeight='600'>
          {reviewRequest.requester.username} - {reviewRequest.rap.title}
        </Typography>
        <Typography variant='caption'>
          {new Date(reviewRequest.createdAt).toLocaleDateString()}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default ReviewRequest;
