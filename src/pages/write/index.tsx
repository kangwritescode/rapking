import { Container } from '@mui/material';
import { Rap } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import sanitize from 'sanitize-html';
import Footer from 'src/components/Footer';
import { CreateRapPayload } from 'src/server/api/routers/rap';
import { removeTrailingAndLeadingPElements } from 'src/shared/editorHelpers';
import { api } from 'src/utils/api';
import useLocalStorage from 'use-local-storage';
import RapEditor, { Collaborator } from '../../components/WritePage/RapEditor';

function WritePage() {
  const router = useRouter();
  const { status } = useSession();

  const { mutate, isLoading, isSuccess } = api.rap.createRap.useMutation();

  // Local Storage
  const [storedRapDraft, setStoredRapDraft] = useLocalStorage<
    Partial<Rap & { collaborators: Array<Collaborator> }>
  >('rap-draft', {});

  const createRap = (rap: CreateRapPayload) => {
    if (status === 'unauthenticated') {
      router.push('/auth/');

      return;
    }
    if (rap) {
      const editedContent = removeTrailingAndLeadingPElements(rap.content);
      const sanitizedContent = sanitize(editedContent, {
        allowedTags: ['p', 'br', 'b', 'i', 'strong', 'u', 'a']
      });
      mutate(
        {
          title: rap.title,
          content: sanitizedContent,
          status: rap.status,
          coverArtUrl: rap.coverArtUrl,
          soundcloudUrl: rap.soundcloudUrl,
          youtubeVideoId: rap.youtubeVideoId
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
            setStoredRapDraft(undefined);
            toast.success('Rap Created Successfully!');
            router.push(`/write/${data.id}`);
          }
        }
      );
    }
  };

  return (
    <>
      <Container
        sx={theme => ({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: ` 2.5rem ${theme.spacing(6)}`,
          transition: 'padding .25s ease-in-out',
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4)
          }
        })}
      >
        <RapEditor
          isLoading={isLoading}
          createRap={createRap}
          submitButtonIsDisabled={isSuccess}
          storedRapDraft={storedRapDraft}
          setStoredRapDraft={setStoredRapDraft}
        />
      </Container>
      <Footer sx={{ mt: '1rem' }} />
    </>
  );
}

export default WritePage;
