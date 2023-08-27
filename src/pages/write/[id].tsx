import { useRouter } from "next/router";
import { api } from "src/utils/api";
import RapEditor from "./RapEditor";

const ExistingRap = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = api.rap.getRap.useQuery({ id: id as string });

  console.log({data})


  const updateRap = async (rap: any) => {
    console.log(rap)
  }

  return (
    <RapEditor handleSubmit={updateRap} defaultTitle={data?.title} defaultContent={data?.content} />
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
  await helpers.rap.getRap.prefetch({id: context.params?.id as string})

  return {
    props: {
      trpcState: helpers.dehydrate(),
    }
  }
}
