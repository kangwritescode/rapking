import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import RapEditor from './RapEditor';
import { RapMutatePayload } from 'src/shared/types';
import { api } from 'src/utils/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

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

    try {
      const createdRap = await profileMutation.mutateAsync(rap, {
        onError: (error) => {
          console.log(error)
          toast.error(error.message, {
            position: 'bottom-left',
          })
        }
      })

      // on successful update
      if (createdRap) {
        toast.success('Rap Created Successfully!', {
          position: 'bottom-left',
        })
        router.push(`/write/${createdRap.id}`)
      }
      else {
        throw new Error('Failed to update location')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <PageContainer>
      <RapEditor handleSubmit={createRap} />
    </PageContainer>
  )
}

export default WritePage
