import { useRouter } from "next/router";
import { api } from "src/utils/api";
import RapEditor from "./RapEditor";
import { toast } from "react-hot-toast";
import { useCallback, useState } from "react";
import { UpdateRapPayload } from "src/server/api/routers/rap";
import { Container, styled } from "@mui/material";
import WriteHeader from "./WriteHeader";

const PageContainer = styled(Container)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'top',
  flexDirection: 'column',
}))


const ExistingRap = () => {
  const router = useRouter();
  const { id } = router.query;

  // Queries
  const { data: rapData } = api.rap.getRap.useQuery({ id: id as string });

  // Mutations
  const { mutate: updateRap } = api.rap.updateRap.useMutation();

  // State
  const [updateRapPayload, setUpdateRapPayload] = useState<UpdateRapPayload | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // Invalidaters
    // Invalidaters
    const { invalidate: invalidateRapQuery } = api.useContext().rap.getRap;

  const submitHandler = () => {
    if (updateRapPayload) {
      updateRap(updateRapPayload, {
        onError: (error) => {
          toast.error(error.message)
        },
        onSuccess: () => {
          toast.success('Rap Updated Successfully!')
          invalidateRapQuery({ id: id as string });
        }
      })
    }
  }

  const onRapChangeHandler = useCallback((rapPayload: UpdateRapPayload) => {
    setUpdateRapPayload(rapPayload)
  }, [])

  return (
    <PageContainer>
      <WriteHeader
        disabled={buttonDisabled}
        onClickHandler={submitHandler}
        rapData={rapData}
      />
      {rapData && (
        <RapEditor
          handleUpdate={submitHandler}
          rapData={rapData}
          onRapChange={onRapChangeHandler}
          onDisabledStateChanged={(isDisabled: boolean) => setButtonDisabled(isDisabled)}
        />
      )}
    </PageContainer>
  );
}

export default ExistingRap;
