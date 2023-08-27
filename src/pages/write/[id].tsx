import { useRouter } from "next/router";
import { api } from "src/utils/api";
import RapEditor from "./RapEditor";
import { toast } from "react-hot-toast";
import { RapMutatePayload } from "src/shared/types";

const ExistingRap = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: rapData } = api.rap.getRap.useQuery({ id: id as string });
  const { mutate: updateRap } = api.rap.updateRap.useMutation();

  const submitHandler = (rap: RapMutatePayload) => {
    updateRap({
      id: id as string,
      ...rap
    }, {
      onError: (error: any) => {
        toast.error(error.message, {
          position: 'bottom-left',
        })
      },
      onSuccess: () => {
        toast.success('Updated Rap!', {
          position: 'bottom-left',
        })
      }
    })
  }

  return (
    <RapEditor
      handleSubmit={submitHandler}
      rapData={rapData}
    />
  );
}

export default ExistingRap;

import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext } from 'next';
import { appRouter } from 'src/server/api/root';
import superjson from 'superjson';
import { createTRPCContext } from 'src/server/api/trpc'


export async function getServerSideProps(context: GetServerSidePropsContext) {

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createTRPCContext(context),
    transformer: superjson,
  });
  await helpers.rap.getRap.prefetch({ id: context.params?.id as string })

  return {
    props: {
      trpcState: helpers.dehydrate(),
    }
  }
}
