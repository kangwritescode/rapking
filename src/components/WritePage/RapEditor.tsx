import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Stack, SxProps, TextField, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';
import { Rap, RapStatus } from '@prisma/client';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateRapPayload, UpdateRapPayload } from 'src/server/api/routers/rap';
import { z } from 'zod';
import AddCoverArtField from '../AddCoverArtField';
import AddSCButton from './AddSCButton';
import PublishedField from './PublishedField';
import RapTextEditor from './RapTextEditor';

const rapEditorFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must contain at least 3 character(s)')
    .max(50, 'Title must contain at most 50 character(s)'),
  content: z.string().max(3000),
  published: z.boolean(),
  coverArtUrl: z.string().nullable(),
  soundcloudUrl: z.string()
});

interface RapEditorProps {
  createRap?: (payload: CreateRapPayload) => void;
  updateRap?: (payload: UpdateRapPayload) => void;
  rapData?: Rap | null;
  sx?: SxProps;
  isLoading?: boolean;
  submitButtonIsDisabled?: boolean;
  storedRapDraft?: Partial<Rap>;
  setStoredRapDraft?: (value: Partial<Rap>) => void;
}

export type RapEditorFormValues = z.infer<typeof rapEditorFormSchema>;

const useRapEditorForm = (rapData?: Rap | null, storedRapDraft?: Partial<Rap>) => {
  return useForm({
    defaultValues: {
      title: rapData?.title || storedRapDraft?.title || '',
      content: rapData?.content || storedRapDraft?.content || '',
      published:
        rapData?.status === RapStatus.PUBLISHED || storedRapDraft?.status === RapStatus.PUBLISHED,
      coverArtUrl: rapData?.coverArtUrl || storedRapDraft?.coverArtUrl || null,
      soundcloudUrl: rapData?.soundcloudUrl || storedRapDraft?.soundcloudUrl || ''
    },
    resolver: zodResolver(rapEditorFormSchema),
    mode: 'onTouched'
  });
};

export default function RapEditor({
  rapData,
  sx,
  createRap,
  isLoading,
  updateRap,
  submitButtonIsDisabled,
  storedRapDraft,
  setStoredRapDraft
}: RapEditorProps) {
  const { register, formState, reset, setValue, watch, control } = useRapEditorForm(
    rapData,
    storedRapDraft
  );
  const { isValid, isDirty, errors } = formState;

  // We receive fresh data onmount and after successful mutation - thus, reset form
  useEffect(() => {
    if (rapData) {
      reset({
        title: rapData.title,
        content: rapData.content,
        published: rapData?.status === RapStatus.PUBLISHED ? true : false,
        coverArtUrl: rapData?.coverArtUrl || null,
        soundcloudUrl: rapData?.soundcloudUrl || ''
      });
    }
  }, [rapData, reset]);

  const { content, title, coverArtUrl, published, soundcloudUrl } = watch();
  const status = published ? RapStatus.PUBLISHED : RapStatus.DRAFT;

  // Update Local Storage
  useEffect(() => {
    if (setStoredRapDraft) {
      setStoredRapDraft({
        title,
        content,
        status,
        coverArtUrl,
        soundcloudUrl
      });
    }
  }, [content, title, coverArtUrl, setStoredRapDraft, status, soundcloudUrl]);

  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })],
    content,
    onUpdate({ editor }) {
      setValue('content', editor.getHTML(), {
        shouldValidate: true,
        shouldDirty: true
      });
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

  const renderSettingsAndSubmitButton = () => (
    <Stack
      direction='row'
      justifyContent={isTabletView ? 'flex-end' : 'space-between'}
      mb={isTabletView ? '1.5rem' : '0'}
    >
      <Button variant='outlined' color='secondary' sx={{ mr: '1rem' }} disabled>
        Settings
      </Button>
      <Button
        onClick={handleSubmit}
        size='medium'
        variant='contained'
        disabled={!isValid || (!!updateRap && !isDirty) || isLoading || submitButtonIsDisabled}
        sx={{
          whiteSpace: 'nowrap'
        }}
      >
        {createRap ? 'Create Rap' : 'Update Rap'}
      </Button>
    </Stack>
  );

  const theme = useTheme();
  const isTabletView = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        ...(isTabletView && { flexDirection: 'column' }),
        width: '100%',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Box>{isTabletView && renderSettingsAndSubmitButton()}</Box>
      <Box
        sx={{
          width: isTabletView ? '100%' : '30rem'
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
          ...(!isTabletView && { ml: '1.5rem' }),
          ...(isTabletView && { mt: '1.5rem' })
        }}
        gap='1rem'
        width={isTabletView ? '100%' : '16rem'}
      >
        {!isTabletView && renderSettingsAndSubmitButton()}
        <Box
          sx={theme => ({
            width: '100%',
            border: `1px solid ${theme.palette.grey[800]}`,
            py: '.5rem',
            px: '1rem'
          })}
        >
          <PublishedField control={control} />
        </Box>
        <AddCoverArtField
          setCoverArtUrl={(url: string | null) =>
            setValue('coverArtUrl', url, {
              shouldValidate: true,
              shouldDirty: true
            })
          }
          coverArtUrlData={rapData?.coverArtUrl || storedRapDraft?.coverArtUrl || null}
        />
        <AddSCButton rapId={rapData?.id} soundCloudUrlData={rapData?.soundcloudUrl} />
      </Stack>
    </Box>
  );
}
