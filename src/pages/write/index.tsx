import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import RapEditor from './RapEditor';
import { RapMutatePayload } from 'src/shared/types';
import { api } from 'src/utils/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Rap } from '@prisma/client';

const PageContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'top',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}))

function WritePage() {

  const router = useRouter();
  const profileMutation = api.rap.createRap.useMutation();

  const createRap = (rap: RapMutatePayload) => {
    profileMutation.mutate(rap, {
      onError: (error) => {
        toast.error(error.message, {
          position: 'bottom-left',
        })
      },
      onSuccess: (data: Rap) => {
        toast.success('Rap Created Successfully!', {
          position: 'bottom-left',
        })
        router.push(`/write/${data.id}`)
      }
    })
  }

  return (
    <PageContainer>
      <RapEditor submitButtonText='Create' handleSubmit={createRap} />
    </PageContainer>
  )
}

export default WritePage
