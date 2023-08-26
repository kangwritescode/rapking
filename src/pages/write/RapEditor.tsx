import { styled } from '@mui/material/styles'
import TextEditor from './TextEditor';
import TitleSettingsBar from './TitleSettingsBar';
import { useState } from 'react';
import { Rap } from '@prisma/client';

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

interface RapEditorProps {
  handleSubmit: (rap: Partial<Rap>) => void;
}

export default function RapEditor({ handleSubmit }: RapEditorProps) {

  const [content, setContent] = useState('')
  const [title, setTitle] = useState('');

  const onSubmitHandler = () => {
    handleSubmit({
      content,
      title
    })
  }

  return (
    <EditorContainer>
      <TitleSettingsBar
        sx={{ mb: '2rem' }}
        onClick={onSubmitHandler}
        onTitleChange={(title: string) => setTitle(title)}
      />
      <TextEditor
        onChange={(content: string) => setContent(content)} />
    </EditorContainer>
  );
}
