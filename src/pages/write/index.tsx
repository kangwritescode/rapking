import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import RapEditor from './RapEditor';
import { RapCreate } from 'src/shared/types';
import { api } from 'src/utils/api';
import { toast } from 'react-hot-toast';

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

  const profileMutation = api.rap.createRap.useMutation();

  const onSubmitHandler = async (rap: RapCreate) => {

    try {
      const createdRap = await profileMutation.mutateAsync(rap)

      // on successful update
      if (createdRap) {
        toast.success('Rap Created Successfully!', {
          position: 'bottom-left',
        })
        console.log(createdRap)
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
      <RapEditor handleSubmit={onSubmitHandler} />
    </PageContainer>
  )
}

export default WritePage
