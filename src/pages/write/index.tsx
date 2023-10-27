import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Rap } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { CreateRapPayload } from 'src/server/api/routers/rap';
import { removeTrailingAndLeadingPElements } from 'src/shared/editorHelpers';
import { api } from 'src/utils/api';
import RapEditor from '../../components/WritePage/RapEditor';
import WriteHeader from '../../components/WritePage/WriteHeader';

const PageContainer = styled(Container)(() => ({
  display: 'flex',
  justifyContent: 'top',
  alignItems: 'center',
  flexDirection: 'column'
}));

function WritePage() {
  const router = useRouter();
  const { status } = useSession();

  const { mutate: createRap, isLoading, isSuccess } = api.rap.createRap.useMutation();
  const [formIsInvalid, setFormIsInvalid] = useState(true);
  const [rap, setRap] = useState<CreateRapPayload | null>(null);

  const submitHandler = () => {
    if (status === 'unauthenticated') {
      return toast.error('You must be logged in to create a rap.');
    }
    if (rap) {
      const editedContent = removeTrailingAndLeadingPElements(rap.content);
      createRap(
        {
          title: rap.title,
          content: editedContent
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

  const onRapChangeHandler = useCallback((rap: CreateRapPayload) => {
    setRap(rap);
  }, []);

  return (
    <PageContainer>
      <WriteHeader
        sx={{
          width: '34rem'
        }}
        disabled={formIsInvalid || isLoading || isSuccess}
        onClickHandler={submitHandler}
      />
      <RapEditor
        sx={{ width: '34rem' }}
        handleCreate={submitHandler}
        onDisabledStateChanged={(isDisabled: boolean) => setFormIsInvalid(isDisabled)}
        onRapChange={onRapChangeHandler}
      />
    </PageContainer>
  );
}

export default WritePage;
