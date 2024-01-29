import { Icon } from '@iconify/react';
import { Button, Card, SxProps, Typography, useTheme } from '@mui/material';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { api } from 'src/utils/api';
import AddSocialDialog from './AddSocialDialog';
import EditBioDialog from './EditBioDialog';
import SocialLinks from './SocialLinks';

interface BioCardProps {
  userData?: Partial<User> | null;
  sx?: SxProps;
}

function BioCard({ userData, sx }: BioCardProps) {
  const theme = useTheme();
  const { data } = useSession();
  const isCurrentUser = data?.user?.id === userData?.id;

  const [socialsModalIsOpen, setSocialsModalIsOpen] = useState(false);
  const [bioModalIsOpen, setBioModalIsOpen] = useState(false);

  const { data: socialLinksData } = api.socialLink.getSocialLinkByUserId.useQuery(
    { userId: userData?.id || '' },
    {
      enabled: !!userData?.id
    }
  );

  return (
    <>
      <AddSocialDialog
        isOpen={socialsModalIsOpen}
        onCloseHandler={() => setSocialsModalIsOpen(false)}
      />
      {userData && bioModalIsOpen && (
        <EditBioDialog
          userData={userData}
          isOpen={true}
          onCloseHandler={() => setBioModalIsOpen(false)}
        />
      )}
      <Card
        sx={{
          wordBreak: 'break-word',
          ...sx
        }}
      >
        <Typography
          variant='body1'
          sx={{
            mb: theme.spacing(1)
          }}
        >
          Bio
        </Typography>
        <Typography
          variant='body1'
          color='text.secondary'
          sx={{
            mb: theme.spacing(2)
          }}
        >
          {userData?.bio || 'Add a bio.'}
        </Typography>
        {isCurrentUser && (
          <Button
            color='secondary'
            size='small'
            variant='outlined'
            startIcon={<Icon icon='mdi:pencil-outline' />}
            onClick={() => setBioModalIsOpen(true)}
            sx={{
              borderRadius: '20px'
            }}
            disabled={!isCurrentUser}
          >
            Edit
          </Button>
        )}
        {(socialLinksData && socialLinksData.length && !isCurrentUser) ||
          (isCurrentUser && (
            <Typography
              variant='body1'
              sx={{
                mb: theme.spacing(2),
                mt: theme.spacing(4)
              }}
            >
              Socials
            </Typography>
          ))}
        <SocialLinks isCurrentUser={isCurrentUser} socialLinks={socialLinksData || []} />
        {socialLinksData && socialLinksData.length < 5 && isCurrentUser && (
          <Button
            onClick={() => setSocialsModalIsOpen(true)}
            variant='outlined'
            color='secondary'
            startIcon={<Icon icon='zondicons:add-outline' />}
            disabled={!isCurrentUser}
            size='small'
            sx={{
              position: 'relative',
              borderRadius: '20px'
            }}
          >
            Add link
          </Button>
        )}
      </Card>
    </>
  );
}

export default BioCard;
