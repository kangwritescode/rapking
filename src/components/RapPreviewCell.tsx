import { Avatar, CardMedia, Stack, Typography, useTheme } from '@mui/material';
import { Rap } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import sanitize from 'sanitize-html';
import { BUCKET_URL } from 'src/shared/constants';
import RapBar from './RapPage/RapBar';
import TipTapContent from './TipTapContent';

const RapPreviewCell = ({
  rap
}: {
  rap: Rap & {
    user: {
      username: string | null;
      profileImageUrl: string | null;
    };
  };
}) => {
  const router = useRouter();
  const theme = useTheme();

  const userData = rap?.user || {};
  const contentMaxLength = 30;

  let formattedContent = sanitize(rap.content || '');
  if (rap.content.length > contentMaxLength) {
    formattedContent = `${rap.content.slice(0, contentMaxLength)}...`;
  }

  return (
    <Stack>
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
      <Stack
        direction='row'
        alignItems='center'
        sx={{
          mt: 4.5,
          mb: 4
        }}
      >
        <Link
          onClick={() => router.push(`/u/${userData?.username}`)}
          style={{ textDecoration: 'none' }}
          href={`/u/${userData?.username}`}
        >
          <Avatar
            {...(userData?.profileImageUrl && {
              src: `${BUCKET_URL}/${userData.profileImageUrl}`
            })}
            alt='profile-picture'
            onClick={() => router.push(`/u/${userData?.username}`)}
            sx={{
              mr: theme.spacing(2),
              width: 20,
              height: 20,
              cursor: 'pointer'
            }}
          />
        </Link>
        <Link
          onClick={() => router.push(`/u/${userData?.username}`)}
          style={{ textDecoration: 'none' }}
          href={`/u/${userData?.username}`}
        >
          <Typography>{userData?.username}</Typography>
        </Link>
      </Stack>
      <Typography fontSize='1.5rem' fontWeight='bold'>
        {rap.title}
      </Typography>
      <Link href={`/rap/${rap.id}`} style={{ textDecoration: 'none' }}>
        <TipTapContent
          sx={{
            mt: '-1rem',
            color: theme.palette.text.secondary
          }}
          content={formattedContent}
        />
      </Link>
      <RapBar
        sx={{
          '& .fire-icon-button': {
            paddingLeft: 0
          }
        }}
        rapData={rap}
        commentClickHandler={() => router.push(`/rap/${rap.id}`)}
      />
    </Stack>
  );
};

export default RapPreviewCell;
