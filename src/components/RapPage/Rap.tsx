import {
  Avatar,
  CardMedia,
  Divider,
  Stack,
  SxProps,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Rap, User } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SCPlayer from 'src/components/SCPlayer';
import YTPlayer from 'src/components/YTPlayer';
import { BUCKET_URL } from 'src/shared/constants';
import RapBar from '../../components/RapPage/RapBar';
import TipTapContent from '../../components/TipTapContent';

interface RapProps {
  rapData?:
    | (Rap & {
        user: Partial<User>;
        collaborators: Partial<User>[];
        rapThread?: { threadId: string } | null;
      })
    | null;
  sx?: SxProps;
  context?: 'review-inbox';
}

function Rap({ rapData, sx }: RapProps) {
  const theme = useTheme();
  const router = useRouter();

  const { commentId } = router.query;

  const collaborators = rapData?.collaborators || [];
  const features = collaborators.map(c => (
    <Link
      key={c.id}
      href={`/u/${c.username}`}
      style={{
        textDecoration: 'none',
        color: theme.palette.secondary.light
      }}
    >
      {`${c.username}${collaborators.indexOf(c) === collaborators.length - 1 ? '' : ', '}`}
    </Link>
  ));

  const userData = rapData?.user;

  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack sx={sx}>
      <CardMedia
        component='img'
        alt='profile-header'
        image={
          rapData?.coverArtUrl
            ? `${BUCKET_URL}/${rapData?.coverArtUrl}`
            : `${BUCKET_URL}/default/cover-art.jpg`
        }
        sx={{
          marginBottom: 10,
          height: {
            xs: 200,
            sm: 250,
            md: 300
          }
        }}
      />
      <Typography variant='h4' fontWeight='bold'>
        {rapData?.title}{' '}
      </Typography>
      {collaborators.length ? (
        <span
          style={{
            fontSize: '1.5rem',
            fontWeight: 'normal',
            marginBottom: '1rem'
          }}
        >
          ft. {features}
        </span>
      ) : undefined}

      <Stack
        direction='row'
        mt={theme.spacing(4)}
        mb={theme.spacing(4)}
        alignItems='center'
        justifyContent='space-between'
      >
        <Stack direction='row'>
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
                mr: theme.spacing(4),
                width: 50,
                height: 50,
                cursor: 'pointer'
              }}
            />
          </Link>
          <Stack>
            <Link
              onClick={() => router.push(`/u/${userData?.username}`)}
              style={{ textDecoration: 'none' }}
              href={`/u/${userData?.username}`}
            >
              <Typography fontWeight='bold'>{userData?.username}</Typography>
            </Link>
            <Typography>{rapData?.dateCreated.toLocaleDateString()}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
      <RapBar
        rapData={rapData}
        threadId={rapData?.rapThread?.threadId}
        defaultCommentDrawerIsOpen={Boolean(commentId)}
      />
      <Divider />
      {rapData?.soundcloudUrl ? (
        <SCPlayer
          sx={{
            mt: '1.75rem',
            height: '7.25rem'
          }}
          showArtwork
          url={rapData?.soundcloudUrl}
        />
      ) : undefined}
      {rapData?.youtubeVideoId ? (
        <YTPlayer
          sx={{
            mt: '1.75rem',
            height: isMobileView ? '15rem' : '24rem'
          }}
          videoId={rapData?.youtubeVideoId}
        />
      ) : undefined}
      {rapData?.content && (
        <TipTapContent sx={{ marginTop: theme.spacing(2) }} content={rapData.content} />
      )}
    </Stack>
  );
}

export default Rap;
