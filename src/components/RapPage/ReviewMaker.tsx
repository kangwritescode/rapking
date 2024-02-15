import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Divider, Stack, Typography } from '@mui/material';
import { Rap, RapReview, User } from '@prisma/client';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import { z } from 'zod';
import GenericTipTapEditor from '../GenericTipTapEditor';
import ReviewPart from './ReviewPart';

interface ReviewMakerProps {
  rapData?: Rap | null;
  onSuccess?: () => void;
  defaultRapReview?: (RapReview & { reviewer: Partial<User> }) | null;
  viewOnly?: boolean;
}

function ReviewMaker({ rapData, onSuccess, defaultRapReview, viewOnly }: ReviewMakerProps) {
  const { mutateAsync: postReview, isLoading } = api.reviews.upsertReview.useMutation();

  // ** Invalidators
  const { invalidate: invalidateUserHasReviewed } = api.useUtils().reviews.userHasReviewed;

  const session = useSession();

  const reviewerId = defaultRapReview?.reviewerId || session.data?.user?.id;

  const {
    control,
    setValue,
    getValues,
    reset,
    formState: { isValid, isDirty }
  } = useForm({
    defaultValues: {
      lyricism: defaultRapReview?.lyricism || 0,
      flow: defaultRapReview?.flow || 0,
      originality: defaultRapReview?.originality || 0,
      delivery: defaultRapReview?.delivery || 0,
      writtenReview: defaultRapReview?.writtenReview || ''
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
    },
    editable: !viewOnly
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
    if (viewOnly) return;

    const { lyricism, flow, originality, delivery, writtenReview } = getValues();
    const rapId = rapData?.id;

    if (rapId && reviewerId) {
      await postReview({
        lyricism: Number(lyricism),
        flow: Number(flow),
        originality: Number(originality),
        delivery: delivery ? Number(delivery) : undefined,
        writtenReview,
        rapId,
        reviewerId
      })
        .then(() => {
          onSuccess && onSuccess();
          if (defaultRapReview) {
            toast.success('Review updated successfully!');
          } else {
            invalidateUserHasReviewed();
            toast.success('Review submitted successfully!');
          }
        })
        .catch(err => {
          toast.error(err.message);
        });
    }
  };

  const reviewParts: Array<{
    name: 'lyricism' | 'flow' | 'originality' | 'delivery';
    title: string;
    subtitle: string;
  }> = useMemo(
    () => [
      {
        name: 'lyricism',
        title: 'Lyricism',
        subtitle: 'Rhymes, punchlines, literary devices, and structure.'
      },
      {
        name: 'flow',
        title: 'Flow',
        subtitle: 'Rhythm, cadence, pace, and timing of the lyrics.'
      },
      {
        name: 'originality',
        title: 'Originality',
        subtitle: 'Creativity, uniqueness, and innovation.'
      },
      {
        name: 'delivery',
        title: `Delivery ${viewOnly ? '' : '(Optional)'}`,
        subtitle: 'Vocal performance, emotion, and energy.'
      }
    ],
    [viewOnly]
  );

  return (
    <Stack
      sx={{
        p: '1rem 2rem',
        height: '100%',
        position: 'relative'
      }}
    >
      <Typography fontSize='1.75rem' fontWeight='600'>
        {defaultRapReview?.reviewer.username} '{rapData?.title}' review
      </Typography>
      <Divider
        sx={{
          mt: '.5rem',
          mb: '1rem'
        }}
      />
      {reviewParts.map((part, index) => (
        <Controller
          key={index}
          control={control}
          name={part.name}
          render={({ field }) => (
            <ReviewPart
              title={part.title}
              subtitle={part.subtitle}
              onChange={field.onChange}
              value={Number(field.value)}
              sx={{ mb: '1rem' }}
              readOnly={viewOnly}
            />
          )}
        />
      ))}
      {/* If viewOnly mode and there is no written review, don't show the written review section */}
      {viewOnly && !Boolean(editor?.getText()) ? undefined : (
        <>
          <Typography variant='h6' fontWeight={600} mb='.5rem'>
            Written Review {!viewOnly ? '(Optional)' : null}
          </Typography>
          <GenericTipTapEditor editor={editor} />
        </>
      )}
      {!viewOnly ? (
        <Stack
          width='100%'
          sx={{
            mt: '1.5rem'
          }}
        >
          <LoadingButton
            sx={{
              flexGrow: 1
            }}
            variant='contained'
            loading={isLoading}
            disabled={!isValid || !isDirty || viewOnly}
            onClick={onSubmitHandler}
          >
            {defaultRapReview ? 'Update' : 'Submit'}
          </LoadingButton>
        </Stack>
      ) : null}
    </Stack>
  );
}

export default ReviewMaker;
