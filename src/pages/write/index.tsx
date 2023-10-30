import { Container } from '@mui/material';
import { Rap } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { CreateRapPayload } from 'src/server/api/routers/rap';
import { removeTrailingAndLeadingPElements } from 'src/shared/editorHelpers';
import { api } from 'src/utils/api';
import RapEditor from '../../components/WritePage/RapEditor';

function WritePage() {
  const router = useRouter();
  const { status } = useSession();

  const { mutate, isLoading } = api.rap.createRap.useMutation();

  const createRap = (rap: CreateRapPayload) => {
    if (status === 'unauthenticated') {
      return toast.error('You must be logged in to create a rap.');
    }
    if (rap) {
      const editedContent = removeTrailingAndLeadingPElements(rap.content);
      mutate(
        {
          title: rap.title,
          content: editedContent,
          status: rap.status,
          coverArtUrl: rap.coverArtUrl
        },
        {
          onError: error => {
            if (error.data?.code === 'UNAUTHORIZED') {
              toast.error('You must be logged in to create a rap.');
            } else {
              toast.error(error.message);
            }
          },
          onSuccess: (data: Rap) => {
            toast.success('Rap Created Successfully!');
            router.push(`/write/${data.id}`);
          }
        }
      );
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <RapEditor isLoading={isLoading} createRap={createRap} />
    </Container>
  );
}

export default WritePage;
