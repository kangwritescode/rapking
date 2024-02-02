import { Box, SxProps, Typography } from '@mui/material';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { api } from 'src/utils/api';
import AddSocialDialog from './UserPage/BioCard/AddSocialDialog';
import SocialLinks from './UserPage/BioCard/SocialLinks';

interface SocialLinksFieldProps {
  userData?: User | null;
  sx?: SxProps;
}

function SocialLinksField({ userData, sx }: SocialLinksFieldProps) {
  const [socialsModalIsOpen, setSocialsModalIsOpen] = useState(false);

  const session = useSession();
  const isCurrentUser = session.data?.user?.id === userData?.id;
  const { data: socialLinksData } = api.socialLink.getSocialLinkByUserId.useQuery(
    { userId: userData?.id || '' },
    {
      enabled: !!userData?.id
    }
  );

  return (
    <Box
      sx={{
        ...sx
      }}
    >
      <Typography sx={{ mb: '.5rem' }}>Socials</Typography>
      <AddSocialDialog
        isOpen={socialsModalIsOpen}
        onCloseHandler={() => setSocialsModalIsOpen(false)}
      />
      <SocialLinks
        sx={{
          width: '80%',
          mb: 4,
          justifyContent: 'flex-start'
        }}
        socialLinks={socialLinksData || []}
        isCurrentUser={Boolean(isCurrentUser)}
        addLinkClickHandler={() => setSocialsModalIsOpen(true)}
      />
    </Box>
  );
}

export default SocialLinksField;
