import { Box, Button, Container, Stack, Switch, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Rap } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import DropzoneInput from 'src/components/DropzoneInput';
import { CreateRapPayload } from 'src/server/api/routers/rap';
import { removeTrailingAndLeadingPElements } from 'src/shared/editorHelpers';
import { api } from 'src/utils/api';
import RapEditor from '../../components/WritePage/RapEditor';

const PageContainer = styled(Container)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'top',
  flexDirection: 'row'
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
      <Box width='34rem'>
        <RapEditor
          handleCreate={submitHandler}
          onDisabledStateChanged={(isDisabled: boolean) => setFormIsInvalid(isDisabled)}
          onRapChange={onRapChangeHandler}
        />
      </Box>
      <Stack
        sx={{
          ml: '1.5rem'
        }}
        gap='1rem'
        width='16rem'
      >
        <Stack direction='row' justifyContent='space-between'>
          <Button variant='outlined' color='secondary' sx={{ mr: '1rem' }}>
            Settings
          </Button>
          <Button
            onClick={submitHandler}
            size='medium'
            variant='contained'
            disabled={formIsInvalid || isLoading || isSuccess}
          >
            Create Rap
          </Button>
        </Stack>
        <Box sx={theme => ({ width: '100%', border: `1px solid ${theme.palette.grey[800]}`, padding: '.5rem' })}>
          <Switch />{' '}
          <Typography
            component='span'
            sx={{
              pointerEvents: 'none'
            }}
          >
            Publish
          </Typography>
        </Box>
        <Box sx={theme => ({ border: `1px solid ${theme.palette.grey[800]}` })}>
          <DropzoneInput />
        </Box>
      </Stack>
    </PageContainer>
  );
}

export default WritePage;
