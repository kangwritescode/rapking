import { useRouter } from "next/router";
import { api } from "src/utils/api";

const ExistingRap = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = api.rap.getRap.useQuery({ id: id as string});

  console.log(data)


  return (
    <div>
      hello govna {JSON.stringify(data)}
    </div>
  );
}

export default ExistingRap;
