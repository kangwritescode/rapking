import { styled } from '@mui/material/styles'
import RapTextEditor from './RapTextEditor';
import TitleBar from './TitleBar';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Rap } from '@prisma/client';
import { Box, Grid } from '@mui/material';
import StatusChanger from './StatusChanger';
import EditableRapBanner from './EditableCoverArt';
import { CreateRapPayload, UpdateRapPayload } from 'src/server/api/routers/rap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';

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
  title: z.string()
  .min(3, 'Title must contain at least 3 character(s)')
  .max(50, 'Title must contain at most 50 character(s)'),
  content: z.string().max(3000)
})

export type RapEditorFormValues = z.infer<typeof rapEditorFormSchema>

export default function RapEditor({
  rapData,
  onDisabledStateChanged,
  onRapChange
}: RapEditorProps) {

  const {
    register,
    formState: {
      isValid,
      isSubmitting,
      isDirty,
      errors
    },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: { title: rapData?.title || '', content: rapData?.content || '' },
    resolver: zodResolver(rapEditorFormSchema),
    mode: "onTouched",
  })

  const { title, content } = watch();

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
    if (rapData?.content && rapData?.title) {
      reset({
        title: rapData.title,
        content: rapData.content
      })
    }
  }, [rapData?.content, rapData?.title, reset])

  useEffect(() => {
    if (onDisabledStateChanged) {
      onDisabledStateChanged(!isValid || isSubmitting || !isDirty)
    }
  }, [isValid, isSubmitting, onDisabledStateChanged, isDirty]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate({ editor }) {
      setValue('content', editor.getHTML(), { shouldValidate: true, shouldDirty: true })
    }
  });

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
              errorMessage={errors.title?.message}
            />
            <RapTextEditor
              editor={editor}
            />
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
