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
import { removeTrailingAndLeadingPElements } from 'src/shared/editorHelpers';

const PageContainer = styled(Container)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'top',
  flexDirection: 'column',
}))

function WritePage() {

  const router = useRouter();

  const { mutate: createRap, isLoading, isSuccess } = api.rap.createRap.useMutation();
  const [formIsInvalid, setFormIsInvalid] = useState(true);
  const [rap, setRap] = useState<CreateRapPayload | null>(null);

  const submitHandler = () => {
    if (rap) {
      const editedContent = removeTrailingAndLeadingPElements(rap.content);
      createRap({
        title: rap.title,
        content: editedContent,
      }, {
        onError: (error) => {
          if (error.data?.code === 'UNAUTHORIZED') {
            toast.error('You must be logged in to create a rap.')
          }
          else {
            toast.error(error.message)
          }
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
        disabled={formIsInvalid || isLoading || isSuccess}
        onClickHandler={submitHandler}
      />
      <RapEditor
        handleCreate={submitHandler}
        onDisabledStateChanged={(isDisabled: boolean) => setFormIsInvalid(isDisabled)}
        onRapChange={onRapChangeHandler}
      />
    </PageContainer>
  )
}

export default WritePage;
