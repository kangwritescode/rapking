import { Icon } from '@iconify/react';
import { Button, Card, SxProps, Typography, useTheme } from '@mui/material'
import { User } from '@prisma/client';
import React, { useState } from 'react'
import AddSocialDialog from './AddSocialDialog';
import { api } from 'src/utils/api';
import SocialLinks from './SocialLinks';

interface BioCardProps {
  userData?: User | null;
  sx?: SxProps;
}

function BioCard({ userData, sx }: BioCardProps) {
  const theme = useTheme();

  const [socialsModalIsOpen, setSocialsModalIsOpen] = useState(false);

  const { data: socialLinksData } = api.socialLink.getSocialLinkByUserId.useQuery({ userId: userData?.id || '' }, {
    enabled: !!userData?.id,
  });

  return (
    <>
      <AddSocialDialog isOpen={socialsModalIsOpen} onCloseHandler={() => setSocialsModalIsOpen(false)} />
      <Card
        sx={sx}>
        <Typography
          variant='body1'
          sx={{
            mb: theme.spacing(1),
            color: 'text.disabled',
          }}
        >
          Bio
        </Typography>
        <Typography
          variant='body1'
          color='text.secondary'
        >
          {userData?.bio || "Add a bio."}
        </Typography>
        <Typography
          variant='body1'
          sx={{
            mb: theme.spacing(2),
            mt: theme.spacing(4),
            color: 'text.disabled',
          }}
        >
          Socials
        </Typography>
        <SocialLinks socialLinks={socialLinksData || []} />
        {socialLinksData && socialLinksData.length < 5 && (
          <Button
            onClick={() => setSocialsModalIsOpen(true)}
            variant="outlined"
            color="secondary"
            startIcon={<Icon icon="zondicons:add-outline" />}
            sx={{
              position: 'relative',
              borderRadius: '20px',
            }}>
            Add link
          </Button>
        )}
      </Card>
    </>
  )
}

export default BioCard
