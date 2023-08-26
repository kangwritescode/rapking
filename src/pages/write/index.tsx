import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import RapEditor from './RapEditor';
import { Rap } from 'src/shared/types';

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

  const onSubmitHandler = (rap: Partial<Rap>) => {
    console.log(rap)
  }

  return (
    <PageContainer>
      <RapEditor handleSubmit={onSubmitHandler} />
    </PageContainer>
  )
}

export default WritePage
