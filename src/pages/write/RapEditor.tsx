import { styled } from '@mui/material/styles'
import TextEditor from './TextEditor';
import TitleBar from './TitleBar';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Rap } from '@prisma/client';
import { Box, Button, Grid, Stack } from '@mui/material';
import { Icon } from '@iconify/react';
import StatusChanger from './StatusChanger';
import EditableRapBanner from './EditableCoverArt';
import { RapMutatePayload } from 'src/shared/types';

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

const EditorHeader = styled(Stack)(() => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  paddingBottom: '1rem',
}))

interface RapEditorProps {
  handleSubmit: (rap: RapMutatePayload) => void;
  rapData?: Rap | null;
}

const rapEditorFormSchema = z.object({
  title: z.string().min(3).max(50).regex(/^[a-zA-Z0-9 ]*$/, 'Must only include letters and numbers'),
})

export type RapEditorFormValues = z.infer<typeof rapEditorFormSchema>

export default function RapEditor(props: RapEditorProps) {

  const {
    handleSubmit,
    rapData,
  } = props;

  const [content, setContent] = useState(rapData?.content || '')

  const {
    register,
    getValues,
    formState: {
      isValid,
      isSubmitting
    }
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
      <EditorHeader>
        {rapData && (
          <Button
            sx={{
              marginRight: '1rem',
              whiteSpace: 'nowrap'
            }}
            size='medium'
            variant='outlined'>
            <Icon icon='ic:baseline-settings' fontSize={20} />
          </Button>
        )}
        <Button
          onClick={onSubmitHandler}
          size='medium'
          variant='contained'
          disabled={!isValid || isSubmitting}>
          {rapData ? 'Update' : 'Create'}
        </Button>

      </EditorHeader>
      <Grid container wrap='nowrap' gap={6}>
        <Grid item xs={7}>
          <Box>
            {rapData && (
              <StatusChanger
                rapId={rapData.id}
                status={rapData.status}
                sx={{ mb: '1rem' }} />
            )}
            <TitleBar
              sx={{ mb: '2rem' }}
              onClick={onSubmitHandler}
              register={register}
            />
            <TextEditor
              content={content}
              onChange={(content: string) => setContent(content)} />
          </Box>
        </Grid>
        <Grid item xs={5} pt={10}>
          <EditableRapBanner />
        </Grid>
      </Grid>
    </EditorContainer>
  );
}
