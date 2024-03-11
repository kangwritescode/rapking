import { Container, useTheme } from '@mui/material';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import sanitize from 'sanitize-html';
import Footer from 'src/components/Footer';
import { UpdateRapPayload } from 'src/server/api/routers/rap';
import { prisma } from 'src/server/db';
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
    const updatedRap = {
      ...rap,
      content: sanitize(rap.content ?? '', {
        allowedTags: ['p', 'br', 'b', 'i', 'strong', 'u', 'a']
      })
    };
    if (rap) {
      mutate(updatedRap, {
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
    <>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: `2.5rem ${theme.spacing(6)}`,
          transition: 'padding .25s ease-in-out',
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4)
          }
        }}
      >
        {rapData && <RapEditor updateRap={updateRap} rapData={rapData} isLoading={isLoading} />}
      </Container>
      <Footer sx={{ mt: '1rem' }} />
    </>
  );
};

export default ExistingRap;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  const { id } = context.query;

  if (id) {
    const rap = await prisma.rap.findUnique({
      where: {
        id: id as string
      }
    });

    if (!rap) {
      return {
        notFound: true
      };
    }

    if (session?.user?.id !== rap.userId) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      };
    }
  }

  return {
    props: {
      id: id as string
    }
  };
}
