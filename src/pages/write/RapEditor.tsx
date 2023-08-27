import { styled } from '@mui/material/styles'
import TextEditor from './TextEditor';
import TitleSettingsBar from './TitleSettingsBar';
import { useState } from 'react';
import { RapCreate } from 'src/shared/types';

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
  handleSubmit: (rap: RapCreate) => void;
  defaultTitle?: string;
  defaultContent?: string;
}

export default function RapEditor({ handleSubmit, defaultTitle = '', defaultContent = '' }: RapEditorProps) {

  const [content, setContent] = useState(defaultContent)
  const [title, setTitle] = useState(defaultTitle);

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
        defaultTitle={defaultTitle}
        onTitleChange={(title: string) => setTitle(title)}
      />
      <TextEditor
        defaultContent={defaultContent}
        onChange={(content: string) => setContent(content)} />
    </EditorContainer>
  );
}
