import { Container, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { UpdateRapPayload } from 'src/server/api/routers/rap';
import { api } from 'src/utils/api';
import RapEditor from '../../components/WritePage/RapEditor';

const ExistingRap = () => {
  const theme = useTheme();
  const router = useRouter();
  const { id } = router.query;

  // Queries
  const { data: rapData, refetch } = api.rap.getRap.useQuery(
    { id: id as string },
    { enabled: false }
  );

  // Mutations
  const { mutate, isLoading } = api.rap.updateRap.useMutation();

  // Effects
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [refetch, id]);

  const updateRap = (rap: UpdateRapPayload) => {
    if (rap) {
      mutate(rap, {
        onError: error => {
          toast.error(error.message);
        },
        onSuccess: () => {
          toast.success('Rap Updated Successfully');
          refetch();
        }
      });
    }
  };

  return (
    <Container
      sx={{
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
      }}
    >
      {rapData && <RapEditor updateRap={updateRap} rapData={rapData} isLoading={isLoading} />}
    </Container>
  );
};

export default ExistingRap;
