import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import React, { useCallback, useState } from 'react'
import RapEditor from './RapEditor';
import { api } from 'src/utils/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Rap } from '@prisma/client';
import WriteHeader from './WriteHeader';
import { CreateRapPayload } from 'src/server/api/routers/rap';

const PageContainer = styled(Container)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'top',
  flexDirection: 'column',
}))

function WritePage() {

  const router = useRouter();

  const { mutate: createProfile } = api.rap.createRap.useMutation();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [rap, setRap] = useState<CreateRapPayload | null>(null);

  const submitHandler = () => {
    if (rap) {
      createProfile(rap, {
        onError: (error) => {
          toast.error(error.message)
        },
        onSuccess: (data: Rap) => {
          toast.success('Rap Created Successfully!')
          router.push(`/write/${data.id}`)
        }
      })
    }
  }

  const onRapChangeHandler = useCallback((rap: CreateRapPayload) => {
    setRap(rap)
  }, [])

  return (
    <PageContainer>
      <WriteHeader
        disabled={buttonDisabled}
        onClickHandler={submitHandler}
      />
      <RapEditor
        handleCreate={submitHandler}
        onDisabledStateChanged={(isDisabled: boolean) => setButtonDisabled(isDisabled)}
        onRapChange={onRapChangeHandler}
      />
    </PageContainer>
  )
}

export default WritePage;
