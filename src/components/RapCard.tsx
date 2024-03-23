import { Avatar, Box, Stack, SxProps, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Promotion, Rap, User } from '@prisma/client';
import { convert } from 'html-to-text';
import { useRouter } from 'next/router';
import sanitize from 'sanitize-html';
import { BUCKET_URL } from 'src/shared/constants';
import { formatRapCardDate } from 'src/shared/utils';
import RapCardChip from './RapCardChip';
import SquareRapCoverImage from './SquareRapCoverImage';
import RapCardMenu from './UserPage/RapCardMenu';
import { Collaborator } from './WritePage/RapEditor';

interface RapCardProps {
  rap: Rap & {
    user: Partial<User>;
    collaborators: Array<Collaborator>;
    promotions: [Partial<Promotion>] | null;
  };
  sx?: SxProps;
  hideAvatar?: boolean;
  hideUsername?: boolean;
  showMenu?: boolean;
  showChips?: boolean;
  contentMaxLength?: number;
}

function RapCard({
  rap,
  sx,
  hideAvatar,
  hideUsername,
  showMenu,
  showChips,
  contentMaxLength
}: RapCardProps) {
  const {
    id,
    title,
    dateCreated,
    coverArtUrl,
    content,
    user: userData,
    collaborators,
    promotions
  } = rap;

  const isPromoted =
    promotions && promotions.some(p => p.endsAt && new Date(p.endsAt) > new Date());

  const theme = useTheme();
  const router = useRouter();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumView = useMediaQuery(theme.breakpoints.down('md'));

  const navigateToProfile = () => {
    router.push(`/u/${userData?.username}`);
  };

  const navigateToRap = () => {
    router.push(`/rap/${id}`);
  };

  const sanitizedContent = sanitize(content, {
    allowedTags: ['p', 'br', 'b', 'i', 'strong', 'u', 'a']
  });
  let formattedContent = convert(sanitizedContent);
  const maxLength = contentMaxLength
    ? contentMaxLength
    : isMobileView
    ? 50
    : isMediumView
    ? 100
    : 160;

  if (formattedContent.length > maxLength) {
    formattedContent = `${formattedContent.slice(0, maxLength)}...`;
  }

  const features = collaborators?.map(c => (
    <span key={c.id}>
      {' '}
      {`${c.username}${collaborators.indexOf(c) === collaborators.length - 1 ? '' : ', '}`}
    </span>
  ));

  return (
    <Box position='relative' sx={{ ...sx }}>
      <Stack direction='row' alignItems='center' pb={theme.spacing(2)}>
        {!hideAvatar && (
          <Avatar
            onClick={navigateToProfile}
            {...(userData?.profileImageUrl && {
              src: `${BUCKET_URL}/${userData.profileImageUrl}`
            })}
            alt='profile-picture'
            sx={{
              width: 24,
              height: 24,
              cursor: 'pointer',
              marginRight: theme.spacing(2),
              position: 'relative'
            }}
          />
        )}
        {!hideUsername && (
          <Typography fontSize='.875rem' onClick={navigateToProfile} sx={{ cursor: 'pointer' }}>
            {' '}
            {userData?.username}&nbsp;·&nbsp;{' '}
          </Typography>
        )}
        <Typography
          fontSize='.875rem'
          onClick={navigateToRap}
          sx={{
            cursor: 'pointer'
          }}
        >
          {formatRapCardDate(dateCreated)}
        </Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Box
          pr={theme.spacing(8)}
          sx={{
            wordWrap: 'break-word'
          }}
          width='calc(100% - 120px)'
        >
          <Typography
            fontSize='1.25rem'
            fontWeight='bold'
            onClick={navigateToRap}
            sx={{
              cursor: 'pointer'
            }}
          >
            {title} {features.length ? <span>(ft. {features})</span> : undefined}
          </Typography>
          <Typography
            sx={{
              cursor: 'pointer'
            }}
            onClick={navigateToRap}
          >
            {formattedContent}
          </Typography>
          <Stack direction='row' justifyContent='space-between' height='2rem' mt='2rem'>
            {showChips && (
              <Box>
                {isPromoted && (
                  <RapCardChip
                    label='Promoted'
                    sx={{
                      mr: theme.spacing(2),
                      color: theme.palette.info.light
                    }}
                  />
                )}
                <RapCardChip label={userData.country || ''} />
              </Box>
            )}
            <Box>{showMenu && <RapCardMenu rapId={rap.id} />}</Box>
          </Stack>
        </Box>
        <SquareRapCoverImage coverArtUrl={coverArtUrl} onClick={navigateToRap} size={100} />
      </Stack>
    </Box>
  );
}

export default RapCard;
