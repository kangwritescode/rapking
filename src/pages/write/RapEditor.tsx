import { styled } from '@mui/material/styles'
import TextEditor from './TextEditor';
import TitleSettingsBar from './TitleSettingsBar';
import { useState } from 'react';
import { RapMutatePayload } from 'src/shared/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import StatusPill from './StatusPill';

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
  handleSubmit: (rap: RapMutatePayload) => void;
  defaultTitle?: string;
  defaultContent?: string;
}

const rapEditorFormSchema = z.object({
  title: z.string().min(3).max(20),
})

export type RapEditorFormValues = z.infer<typeof rapEditorFormSchema>

export default function RapEditor({ handleSubmit, defaultTitle = '', defaultContent = '' }: RapEditorProps) {

  const [content, setContent] = useState(defaultContent)

  const {
    register,
    getValues,
  } = useForm({
    defaultValues: { title: defaultTitle },
    resolver: zodResolver(rapEditorFormSchema)
  })

  const onSubmitHandler = () => {
    const { title } = getValues();
    handleSubmit({
      content,
      title
    })
  }

  return (
    <EditorContainer>
      <StatusPill status='DRAFT' sx={{marginBottom: '1rem'}} />
      <TitleSettingsBar
        sx={{ mb: '2rem' }}
        onClick={onSubmitHandler}
        register={register}
      />
      <TextEditor
        content={content}
        onChange={(content: string) => setContent(content)} />
    </EditorContainer>
  );
}
