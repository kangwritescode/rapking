import { styled } from '@mui/material/styles'
import TextEditor from './TextEditor';
import TitleBar from './TitleBar';
import { useState } from 'react';
import { RapMutatePayload } from 'src/shared/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Rap } from '@prisma/client';
import { Button, Stack } from '@mui/material';
import StatusPill from './StatusPill';

// import Icon from 'src/@core/components/icon'

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
  rapData?: Rap | null;
  submitButtonText?: string;
}

const rapEditorFormSchema = z.object({
  title: z.string().min(3).max(20),
})

export type RapEditorFormValues = z.infer<typeof rapEditorFormSchema>

export default function RapEditor(props: RapEditorProps) {

  const {
    handleSubmit,
    rapData,
    submitButtonText
  } = props;

  const [content, setContent] = useState(rapData?.content || '')

  const {
    register,
    getValues,
  } = useForm({
    defaultValues: { title: rapData?.title || '' },
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
      <Stack
        direction='row'
        pb='1rem'
        justifyContent='flex-end'>
        <Button
          onClick={onSubmitHandler}
          size='medium'
          variant='contained'>
          Create
        </Button>
        {/* <Button
            sx={{
              marginLeft: '1rem',
              whiteSpace: 'nowrap'
            }}
            size='medium'
            variant='contained'>
            <Icon icon='ic:baseline-settings' fontSize={20} />
          </Button> */}
      </Stack>
      <StatusPill status='DRAFT' sx={{mb: '1rem'}} />
      <TitleBar
        sx={{ mb: '2rem' }}
        onClick={onSubmitHandler}
        register={register}
        submitButtonText={submitButtonText}
        isEditMode={!!rapData}
      />
      <TextEditor
        content={content}
        onChange={(content: string) => setContent(content)} />
    </EditorContainer>
  );
}
