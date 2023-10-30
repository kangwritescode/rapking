import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormControlLabel, Stack, Switch, SxProps, TextField } from '@mui/material';
import { Rap, RapStatus } from '@prisma/client';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CreateRapPayload, UpdateRapPayload } from 'src/server/api/routers/rap';
import { z } from 'zod';
import AddCoverArtField from '../AddCoverArtField';
import RapTextEditor from './RapTextEditor';

const rapEditorFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must contain at least 3 character(s)')
    .max(50, 'Title must contain at most 50 character(s)'),
  content: z.string().max(3000)
});

interface RapEditorProps {
  createRap?: (payload: CreateRapPayload) => void;
  updateRap?: (payload: UpdateRapPayload) => void;
  rapData?: Rap | null;
  sx?: SxProps;
  isLoading?: boolean;
}

export type RapEditorFormValues = z.infer<typeof rapEditorFormSchema>;

export default function RapEditor({ rapData, sx, createRap, isLoading, updateRap }: RapEditorProps) {
  const {
    register,
    formState: { isValid, isDirty, errors },
    reset,
    setValue,
    watch,
    control
  } = useForm({
    defaultValues: {
      title: rapData?.title || '',
      content: rapData?.content || '',
      published: rapData?.status === RapStatus.PUBLISHED ? true : false,
      coverArtUrl: rapData?.coverArtUrl || null
    },
    resolver: zodResolver(rapEditorFormSchema),
    mode: 'onTouched'
  });

  useEffect(() => {
    if (rapData) {
      reset({
        title: rapData.title,
        content: rapData.content,
        published: rapData?.status === RapStatus.PUBLISHED ? true : false,
        coverArtUrl: rapData?.coverArtUrl || null
      });
    }
  }, [rapData, reset]);

  const { content, title, coverArtUrl, published } = watch();
  const status = published ? RapStatus.PUBLISHED : RapStatus.DRAFT;

  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content,
    onUpdate({ editor }) {
      setValue('content', editor.getHTML(), { shouldValidate: true, shouldDirty: true });
    }
  });

  const handleSubmit = () => {
    createRap?.({
      title,
      content,
      status,
      coverArtUrl
    });
    updateRap?.({
      id: rapData?.id as string,
      title,
      content,
      status,
      coverArtUrl
    });
  };

  return (
    <Box sx={{ ...sx, display: 'flex' }}>
      <Box
        sx={{
          width: '30rem'
        }}
      >
        <TextField
          {...register?.('title')}
          label='Title'
          variant='filled'
          size='small'
          fullWidth
          error={Boolean(errors.title?.message)}
        />
        <RapTextEditor sx={{ marginTop: '1.5rem' }} editor={editor} />
      </Box>
      <Stack
        sx={{
          ml: '1.5rem'
        }}
        gap='1rem'
        width='16rem'
      >
        <Stack direction='row' justifyContent='space-between'>
          <Button variant='outlined' color='secondary' sx={{ mr: '1rem' }}>
            Settings
          </Button>
          <Button onClick={handleSubmit} size='medium' variant='contained' disabled={!isValid || !isDirty || isLoading}>
            {createRap ? 'Create Rap' : 'Update Rap'}
          </Button>
        </Stack>
        <Box sx={theme => ({ width: '100%', border: `1px solid ${theme.palette.grey[800]}`, py: '.5rem', px: '1rem' })}>
          <Controller
            name='published'
            control={control}
            render={({ field }) => {
              return (
                <FormControlLabel
                  sx={{
                    '.MuiFormControlLabel-label': {
                      opacity: field.value ? 1 : 0.5
                    }
                  }}
                  control={<Switch checked={field.value} onChange={field.onChange} />}
                  label='Published'
                />
              );
            }}
          />
        </Box>
        <AddCoverArtField
          setCoverArtUrl={(url: string | null) =>
            setValue('coverArtUrl', url, { shouldValidate: true, shouldDirty: true })
          }
          rapData={rapData}
        />
      </Stack>
    </Box>
  );
}
