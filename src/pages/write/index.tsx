import { Container } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import TextEditor from './TextEditor';
import TitleSettingsBar from './TitleSettingsBar';

const PageContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'top',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}))

const EditorContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginRight: 16,
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: 16,
  }
}))

function WritePage() {
  return (
    <PageContainer>
      <EditorContainer>
        <TitleSettingsBar sx={{mb: '2rem'}} />
        <TextEditor />
      </EditorContainer>
    </PageContainer>
  )
}

export default WritePage
