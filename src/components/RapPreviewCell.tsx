import { Avatar, CardMedia, Stack, Typography, useTheme } from '@mui/material';
import { Rap } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import sanitize from 'sanitize-html';
import { BUCKET_URL } from 'src/shared/constants';
import RapBar from './RapPage/RapBar';
import TipTapContent from './TipTapContent';
import { Collaborator } from './WritePage/RapEditor';

const RapPreviewCell = ({
  rap
}: {
  rap: Rap & {
    user: {
      username: string | null;
      profileImageUrl: string | null;
    };
    collaborators: Array<Collaborator>;
  };
}) => {
  const router = useRouter();
  const theme = useTheme();

  const userData = rap?.user || {};

  const formattedContent = sanitize(rap.content || '');

  const features =
    rap?.collaborators?.map(c => (
      <span key={c.id}>
        {' '}
        {`${c.username}${
          rap?.collaborators.indexOf(c) === rap?.collaborators.length - 1 ? '' : ', '
        }`}
      </span>
    )) || [];

  return (
    <Stack>
      <Link href={`/rap/${rap.id}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component='img'
          alt='profile-header'
          image={
            rap?.coverArtUrl
              ? `${BUCKET_URL}/${rap?.coverArtUrl}`
              : `${BUCKET_URL}/default/cover-art.jpg`
          }
          sx={{
            height: {
              xs: 130,
              sm: 150,
              md: 170
            }
          }}
        />
      </Link>
      <Stack
        direction='row'
        alignItems='center'
        sx={{
          mt: 3.5,
          mb: 1
        }}
      >
        <Link style={{ textDecoration: 'none' }} href={`/u/${userData?.username}`}>
          <Avatar
            {...(userData?.profileImageUrl && {
              src: `${BUCKET_URL}/${userData.profileImageUrl}`
            })}
            alt='profile-picture'
            sx={{
              mr: theme.spacing(2),
              width: 20,
              height: 20,
              cursor: 'pointer'
            }}
          />
        </Link>
        <Link style={{ textDecoration: 'none' }} href={`/u/${userData?.username}`}>
          <Typography>{userData?.username}</Typography>
        </Link>
      </Stack>

      <Link href={`/rap/${rap.id}`} style={{ textDecoration: 'none' }}>
        <Typography fontSize='1.5rem' fontWeight='bold'>
          {rap.title} {features.length ? <span>(ft. {features})</span> : undefined}
        </Typography>
        <TipTapContent
          maxLength={30}
          sx={{
            mt: '-1rem',
            color: theme.palette.text.secondary
          }}
          content={formattedContent}
        />
      </Link>
      <RapBar
        sx={{
          mt: -2.5,
          ml: -2.5
        }}
        rapData={rap}
        commentClickHandler={() => router.push(`/rap/${rap.id}`)}
        reviewClickHandler={() => router.push(`/rap/${rap.id}`)}
      />
    </Stack>
  );
};

export default RapPreviewCell;
