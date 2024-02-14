import { Button } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import AlertDialog from '../AlertDialog';

interface DeleteReviewButtonProps {
  reviewId: number;
}

function DeleteReviewButton({ reviewId }: DeleteReviewButtonProps) {
  const { mutateAsync: deleteReview, isLoading } = api.reviews.deleteReview.useMutation();

  const { invalidate: invalidateRapReviews } = api.useUtils().reviews.getRapReviewsWithUserReview;
  const { invalidate: invalidateCurrentUserReview } = api.useUtils().reviews.currentUserReview;
  const { invalidate: invalidateOverallRatings } = api.useUtils().reviews.getOverallRatings;

  const [open, setOpen] = useState(false);

  const handleDeleteReview = async () => {
    await deleteReview({ reviewId })
      .then(() => {
        invalidateRapReviews();
        invalidateCurrentUserReview();
        invalidateOverallRatings();
        setOpen(false);
      })
      .catch(() => {
        toast.error('Failed to delete review');
      });
  };

  return (
    <>
      <AlertDialog
        isOpen={open}
        handleClose={() => setOpen(false)}
        dialogText='Are you sure you want to delete this review?'
        dialogTitle='Delete Review'
        cancelButtonProps={{ color: 'inherit' }}
        submitButtonProps={{ color: 'error' }}
        actionButtonText='Delete Review'
        isLoading={isLoading}
        onSubmitHandler={handleDeleteReview}
      />
      <Button
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        variant='outlined'
        color='error'
      >
        Delete Review
      </Button>
    </>
  );
}

export default DeleteReviewButton;
