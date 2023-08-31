import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import RapEditor from './RapEditor';
import { api } from 'src/utils/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Rap } from '@prisma/client';
import { CreateRapPayload } from 'src/server/api/routers/rap';

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

  const submitHandler = (rap: CreateRapPayload) => {
    profileMutation.mutate(rap, {
      onError: (error) => {
        toast.error(error.message)
      },
      onSuccess: (data: Rap) => {
        toast.success('Rap Created Successfully!')
        router.push(`/write/${data.id}`)
      }
    })
  }

  return (
    <PageContainer>
      <RapEditor handleCreate={submitHandler} />
    </PageContainer>
  )
}

export default WritePage
