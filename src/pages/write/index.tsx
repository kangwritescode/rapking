import { Container, Card } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import TextEditor from './TextEditor';

const PageContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'top',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
    },
}))

const EditorContainer = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
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
                <TextEditor contentMinHeight={300} contentWidth={400} />
            </EditorContainer>
            <Card>hello</Card>
        </PageContainer>
    )
}

export default WritePage