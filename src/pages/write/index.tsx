import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import RapEditor from './RapEditor';
import { RapMutatePayload } from 'src/shared/types';
import { api } from 'src/utils/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Rap } from 'src/shared/schemas';

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

  const createRap = async (rap: RapMutatePayload) => {

    profileMutation.mutateAsync(rap, {
      onError: (error) => {
        console.log(error)
        toast.error(error.message, {
          position: 'bottom-left',
        })
      },
      onSuccess: (data: Rap) => {
        if (data) {
          toast.success('Rap Created Successfully!', {
            position: 'bottom-left',
          })
          router.push(`/write/${data.id}`)
        }
        else {
          throw new Error('Failed to update location')
        }
      }
    })
  }

  return (
    <PageContainer>
      <RapEditor handleSubmit={createRap} />
    </PageContainer>
  )
}

export default WritePage
