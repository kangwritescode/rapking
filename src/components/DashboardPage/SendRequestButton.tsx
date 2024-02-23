import { Button } from '@mui/material';
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

  const handleSendRequest = () => {
    if (requestExists) return;
    createReviewRequest(
      { requestedUserId: requestedUserId || '', rapId: rapId || '' },
      {
        onSuccess: () => {
          toast.success('Request Sent');
          invalidateReviewExists();
        }
      }
    );
  };

  return (
    <Button
      variant='outlined'
      color='secondary'
      disabled={requestExists || isLoading}
      onClick={handleSendRequest}
    >
      {requestExists ? 'Request Sent' : 'Send Request'}
    </Button>
  );
}

export default SendRequestButton;
