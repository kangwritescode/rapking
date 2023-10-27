import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Grid, SxProps, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Rap } from '@prisma/client';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateRapPayload, UpdateRapPayload } from 'src/server/api/routers/rap';
import { z } from 'zod';
import EditableRapBanner from './EditableCoverArt';
import RapTextEditor from './RapTextEditor';
import StatusChanger from './StatusChanger';

const EditorContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%'
}));

interface RapEditorProps {
  handleUpdate?: (rap: UpdateRapPayload) => void;
  handleCreate?: (rap: CreateRapPayload) => void;
  rapData?: Rap | null;
  onDisabledStateChanged?: (isDisabled: boolean) => void;
  onRapChange?: (payload: any) => void;
  sx?: SxProps;
}

const rapEditorFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must contain at least 3 character(s)')
    .max(50, 'Title must contain at most 50 character(s)'),
  content: z.string().max(3000)
});

export type RapEditorFormValues = z.infer<typeof rapEditorFormSchema>;

export default function RapEditor({ rapData, onDisabledStateChanged, onRapChange, sx }: RapEditorProps) {
  const {
    register,
    formState: { isValid, isSubmitting, isDirty, errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: { title: rapData?.title || '', content: rapData?.content || '' },
    resolver: zodResolver(rapEditorFormSchema),
    mode: 'onTouched'
  });

  const { title, content } = watch();

  useEffect(() => {
    if (onRapChange) {
      onRapChange({
        ...rapData,
        content,
        title
      });
    }
  }, [onRapChange, title, content, rapData]);

  useEffect(() => {
    if (rapData?.content && rapData?.title) {
      reset({
        title: rapData.title,
        content: rapData.content
      });
    }
  }, [rapData?.content, rapData?.title, reset]);

  useEffect(() => {
    if (onDisabledStateChanged) {
      onDisabledStateChanged(!isValid || isSubmitting || !isDirty);
    }
  }, [isValid, isSubmitting, onDisabledStateChanged, isDirty]);

  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content,
    onUpdate({ editor }) {
      setValue('content', editor.getHTML(), { shouldValidate: true, shouldDirty: true });
    }
  });

  return (
    <EditorContainer sx={{ ...sx }}>
      <Grid container wrap='nowrap' gap={6}>
        <Grid item xs={rapData ? 7 : 12}>
          <Box>
            {rapData && <StatusChanger rapId={rapData.id} status={rapData.status} sx={{ mb: '1rem' }} />}
            <TextField
              {...register?.('title')}
              label='Title'
              variant='filled'
              size='small'
              fullWidth
              error={Boolean(errors.title?.message)}
            />
            {errors.title?.message && (
              <Typography variant='caption' color='error'>
                {errors.title?.message}
              </Typography>
            )}
            <RapTextEditor sx={{ marginTop: '1.5rem' }} editor={editor} />
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
