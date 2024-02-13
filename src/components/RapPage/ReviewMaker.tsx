import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { Rap, RapReview } from '@prisma/client';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import { z } from 'zod';
import GenericTipTapEditor from '../GenericTipTapEditor';
import ReviewPart from './ReviewPart';

interface ReviewMakerProps {
  rapData?: Rap | null;
  onSuccess?: () => void;
  defaultRapReview?: RapReview | null;
}

function ReviewMaker({ rapData, onSuccess, defaultRapReview }: ReviewMakerProps) {
  const { mutateAsync: postReview } = api.reviews.upsertReview.useMutation();

  const { lyricism, flow, originality, delivery, writtenReview } = defaultRapReview || {};

  const {
    control,
    setValue,
    getValues,
    reset,
    formState: { isValid, isDirty }
  } = useForm({
    defaultValues: {
      lyricism: lyricism || 0,
      flow: flow || 0,
      originality: originality || 0,
      delivery: delivery || 0,
      writtenReview: writtenReview || ''
    },
    resolver: zodResolver(
      z.object({
        lyricism: z.number().min(0.5),
        flow: z.number().min(0.5),
        originality: z.number().min(0.5),
        delivery: z.number().min(0.5).or(z.literal(0)).optional(),
        writtenReview: z.string().max(300).or(z.literal('')).optional()
      })
    ),
    mode: 'all'
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Leave a review...'
      }),
      CharacterCount.configure({
        limit: 300
      })
    ],
    onUpdate({ editor }) {
      setValue('writtenReview', editor.getText(), { shouldDirty: true });
    }
  });

  useEffect(() => {
    if (defaultRapReview) {
      reset({
        lyricism: Number(defaultRapReview.lyricism),
        flow: Number(defaultRapReview.flow),
        originality: Number(defaultRapReview.originality),
        delivery: Number(defaultRapReview.delivery),
        writtenReview: defaultRapReview.writtenReview || ''
      });
      editor?.commands.setContent(defaultRapReview.writtenReview || '');
    }
  }, [defaultRapReview, reset, editor]);

  const onSubmitHandler = async () => {
    const { lyricism, flow, originality, delivery, writtenReview } = getValues();
    const rapId = rapData?.id;

    if (rapId) {
      await postReview({
        lyricism: Number(lyricism),
        flow: Number(flow),
        originality: Number(originality),
        delivery: Number(delivery),
        writtenReview,
        rapId
      })
        .then(() => {
          onSuccess && onSuccess();
          if (defaultRapReview) {
            toast.success('Review updated successfully!');
          } else {
            toast.success('Review submitted successfully!');
          }
        })
        .catch(err => {
          toast.error(err.message);
        });
    }
  };

  return (
    <Stack
      sx={{
        p: '1rem 2rem',
        height: '100%',
        position: 'relative'
      }}
    >
      <Typography fontSize='1.75rem' fontWeight='600'>
        ajiashi's '{rapData?.title}' review
      </Typography>
      <Divider
        sx={{
          mt: '.5rem',
          mb: '1rem'
        }}
      />
      <Controller
        control={control}
        name='lyricism'
        render={({ field }) => (
          <ReviewPart
            title='Lyricism'
            subtitle='Rhymes, punchlines, literary devices, and structure.'
            onChange={field.onChange}
            value={field.value}
            sx={{ mb: '1rem' }}
          />
        )}
      />
      <Controller
        control={control}
        name='flow'
        render={({ field }) => (
          <ReviewPart
            title='Flow'
            subtitle='Rhythm, cadence, pace, and timing of the lyrics.'
            onChange={field.onChange}
            value={field.value}
            sx={{ mb: '1rem' }}
          />
        )}
      />
      <Controller
        control={control}
        name='originality'
        render={({ field }) => (
          <ReviewPart
            title='Originality'
            subtitle='Creativity, uniqueness, and innovation.'
            onChange={field.onChange}
            value={field.value}
            sx={{ mb: '1rem' }}
          />
        )}
      />
      <Controller
        control={control}
        name='delivery'
        render={({ field }) => (
          <ReviewPart
            title='Delivery (Optional)'
            subtitle='Vocal performance, emotion, and energy.'
            onChange={field.onChange}
            value={field.value}
            sx={{ mb: '1rem' }}
          />
        )}
      />

      <Typography variant='h6' fontWeight={600} mb='.5rem'>
        Written Review (Optional)
      </Typography>
      <GenericTipTapEditor editor={editor} />
      <Stack
        width='100%'
        sx={{
          mt: '1.5rem'
        }}
      >
        <Button
          sx={{
            flexGrow: 1
          }}
          variant='contained'
          disabled={!isValid || !isDirty}
          onClick={onSubmitHandler}
        >
          {defaultRapReview ? 'Update' : 'Submit'}
        </Button>
      </Stack>
    </Stack>
  );
}

export default ReviewMaker;
