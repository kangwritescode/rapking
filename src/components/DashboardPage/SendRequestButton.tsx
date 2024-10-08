import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';

interface SendRequestButtonProps {
  requestedUserId?: string | null;
  rapId?: string | null;
}

function SendRequestButton({ requestedUserId, rapId }: SendRequestButtonProps) {
  const { data: requestExists } = api.reviewRequests.reviewRequestExists.useQuery(
    {
      reviewerId: requestedUserId || '',
      rapId: rapId || ''
    },
    {
      enabled: !!requestedUserId && !!rapId
    }
  );
  const { mutate: createReviewRequest, isLoading } =
    api.reviewRequests.createReviewRequest.useMutation();

  // Invalidators
  const { invalidate: invalidateReviewExists } = api.useUtils().reviewRequests.reviewRequestExists;
  const { invalidate: invalidateCurrentUser } = api.useUtils().user.getCurrentUser;
  const { invalidate: invalidatePotentialReviewers } =
    api.useUtils().reviewRequests.getPotentialReviewers;

  const handleSendRequest = () => {
    if (requestExists) return;
    createReviewRequest(
      { requestedUserId: requestedUserId || '', rapId: rapId || '' },
      {
        onSuccess: () => {
          toast.success('Request Sent');
          invalidateReviewExists();
          invalidateCurrentUser();
          invalidatePotentialReviewers();
        },
        onError: err => {
          toast.error(err.message);
        }
      }
    );
  };

  return (
    <LoadingButton
      variant='outlined'
      color='secondary'
      disabled={requestExists}
      loading={isLoading}
      onClick={handleSendRequest}
    >
      {requestExists ? 'Request Sent' : 'Send Request'}
    </LoadingButton>
  );
}

export default SendRequestButton;
