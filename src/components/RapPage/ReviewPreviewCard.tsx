import { Avatar, Button, Divider, Stack, Typography } from '@mui/material';
import { RapReview, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BUCKET_URL } from 'src/shared/constants';
import DeleteReviewButton from './DeleteReviewButton';
import FireRating from './FireRating';

interface ReviewPreviewCardProps {
  rapReview: RapReview & {
    reviewer: Partial<User>;
  };
  onReviewClick?: (review: RapReview & { reviewer: Partial<User> }) => void;
}

function ReviewPreviewCard({ rapReview, onReviewClick }: ReviewPreviewCardProps) {
  const user = rapReview.reviewer;

  const session = useSession();

  const isUserReview = session.data?.user?.id === rapReview.reviewerId;

  return (
    <>
      <Stack
        alignItems='left'
        width='100%'
        px='2rem'
        pb='2rem'
        sx={
          !isUserReview
            ? {
                '&:hover': {
                  backgroundColor: '#1f1f1f',
                  cursor: 'pointer'
                },
                '&:active': {
                  backgroundColor: '#222222'
                }
              }
            : undefined
        }
        onClick={!isUserReview ? onReviewClick && (() => onReviewClick(rapReview)) : undefined}
      >
        <Stack direction='row' position='relative' mb='.75rem' mt='2rem'>
          <Link href={`/u/${user.username}`} passHref style={{ textDecoration: 'none' }}>
            <Avatar
              {...(user?.profileImageUrl && {
                src: `${BUCKET_URL}/${user.profileImageUrl}`
              })}
              sx={{
                mr: 3
              }}
            />
          </Link>
          <Stack>
            <Link
              href={`/u/${user.username}`}
              passHref
              style={{
                textDecoration: 'none'
              }}
            >
              <Typography variant='body1' fontSize={14}>
                {user.username}
              </Typography>
            </Link>
            <Typography variant='body2'>{rapReview.createdAt.toLocaleDateString()}</Typography>
          </Stack>
        </Stack>
        <FireRating
          value={rapReview.total}
          readOnly
          precision={0.1}
          sx={{
            mb: '.5rem'
          }}
        />
        <Typography
          variant='caption'
          sx={{
            pointerEvents: 'none'
          }}
        >
          Lyricism: {String(rapReview?.lyricism)} &nbsp; • &nbsp; Flow: {String(rapReview?.flow)}{' '}
          &nbsp; • &nbsp; Originality: {String(rapReview?.originality)} &nbsp; • &nbsp; Delivery:{' '}
          {rapReview?.delivery ? String(rapReview?.delivery) : 'N/A'}
        </Typography>
        {rapReview.writtenReview ? (
          <Typography variant='body2' sx={{ mt: '1.5rem' }}>
            {rapReview.writtenReview}
          </Typography>
        ) : null}
        {isUserReview ? (
          <Stack direction='row' sx={{ mr: 'auto', mt: '2rem' }}>
            <Button
              variant='outlined'
              color='secondary'
              sx={{ mr: '.5rem' }}
              onClick={() => onReviewClick?.(rapReview)}
            >
              Edit Review
            </Button>
            <DeleteReviewButton reviewId={rapReview.id} />
          </Stack>
        ) : null}
      </Stack>
      <Divider
        sx={{
          width: 'calc(100% - 4rem)'
        }}
      />
    </>
  );
}

export default ReviewPreviewCard;
