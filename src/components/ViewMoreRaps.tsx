import { Avatar, Box, CardMedia, Stack, SxProps, Typography, useTheme } from '@mui/material';
import { Rap } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import sanitize from 'sanitize-html';
import { BUCKET_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';
import TipTapContent from './TipTapContent';

const ViewMoreRap = ({
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
      <TipTapContent
        sx={{
          mt: '-1rem'
        }}
        content={formattedContent}
      />
    </Stack>
  );
};

function ViewMoreRaps({ sx }: { sx?: SxProps }) {
  const { data: randomRapsData } = api.rap.getRandomRaps.useQuery({ limit: 4 });

  return (
    <Stack
      direction='column'
      alignItems='center'
      padding={{
        xs: '2rem 1rem',
        md: '2.5rem'
      }}
    >
      <Stack sx={sx} width={{ xs: '100%', md: '40rem' }} mx='auto'>
        <Typography variant='h4' fontFamily='impact' sx={{ mb: '2rem' }}>
          View More Raps
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(10rem, 1fr))',
            rowGap: '2.5rem',
            columnGap: '2rem'
          }}
        >
          {randomRapsData?.map(rap => (
            <ViewMoreRap key={rap.id} rap={rap} />
          ))}
        </Box>
      </Stack>
    </Stack>
  );
}

export default ViewMoreRaps;
