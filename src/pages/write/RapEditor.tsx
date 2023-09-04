import { styled } from '@mui/material/styles'
import TextEditor from './TextEditor';
import TitleBar from './TitleBar';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Rap } from '@prisma/client';
import { Box, Grid } from '@mui/material';
import StatusChanger from './StatusChanger';
import EditableRapBanner from './EditableCoverArt';
import { CreateRapPayload, UpdateRapPayload } from 'src/server/api/routers/rap';

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
  handleUpdate?: (rap: UpdateRapPayload) => void;
  handleCreate?: (rap: CreateRapPayload) => void;
  rapData?: Rap | null;
  onDisabledStateChanged?: (isDisabled: boolean) => void;
  onRapChange?: (payload: any) => void;
}

const rapEditorFormSchema = z.object({
  title: z.string().min(3).max(50).regex(/^[a-zA-Z0-9 ]*$/, 'Must only include letters and numbers'),
})

export type RapEditorFormValues = z.infer<typeof rapEditorFormSchema>

export default function RapEditor(props: RapEditorProps) {

  const {
    rapData,
    onDisabledStateChanged,
    onRapChange
  } = props;

  const [content, setContent] = useState(rapData?.content || '')

  const {
    register,
    formState: {
      isValid,
      isSubmitting
    },
    watch
  } = useForm({
    defaultValues: { title: rapData?.title || '' },
    resolver: zodResolver(rapEditorFormSchema)
  })

  const { title } = watch();

  useEffect(() => {
    if (onRapChange) {
      onRapChange({
        ...rapData,
        content,
        title
      })
    }
  }, [onRapChange, title, content, rapData])

  useEffect(() => {
    if (onDisabledStateChanged) {
      onDisabledStateChanged(!isValid || isSubmitting)
    }
  }, [isValid, isSubmitting, onDisabledStateChanged])

  return (
    <EditorContainer>
      <Grid container wrap='nowrap' gap={6}>
        <Grid item xs={rapData ? 7 : 12}>
          <Box>
            {rapData && (
              <StatusChanger
                rapId={rapData.id}
                status={rapData.status}
                sx={{ mb: '1rem' }} />
            )}
            <TitleBar
              sx={{ mb: '2rem' }}
              register={register}
            />
            <TextEditor
              content={content}
              onChange={(content: string) => setContent(content)} />
          </Box>
        </Grid>
        {rapData && (
          <Grid item xs={5} pt={10}>
            <EditableRapBanner rapData={rapData} isEditable />
          </Grid>
        )}
      </Grid>
    </EditorContainer>
  );
}
