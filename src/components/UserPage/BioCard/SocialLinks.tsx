import { Icon } from '@iconify/react';
import { IconButton, Stack, useTheme } from '@mui/material';
import { SocialLink } from '@prisma/client';
import React from 'react';
import CustomUrlButton from 'src/components/UserPage/CustomUrlButton';
import { api } from 'src/utils/api';

interface SocialLinksProps {
  socialLinks: SocialLink[];
}

function SocialLinks({ socialLinks }: SocialLinksProps) {
  const theme = useTheme();

  const { mutate: deleteSocialLink } = api.socialLink.deleteSocialLink.useMutation();
  const { invalidate } = api.useContext().socialLink.getSocialLinkByUserId;

  const removeButtonClickHandler = (id: string) => {
    deleteSocialLink(
      { id },
      {
        onSuccess: () => {
          invalidate();
        }
      }
    );
  };

  return (
    <>
      {socialLinks.map(socialLink => {
        if (socialLink.platform === 'CUSTOM') {
          return (
            <Stack
              key={socialLink.id}
              direction='row'
              alignItems='center'
              sx={{ mr: theme.spacing(2), mb: theme.spacing(3) }}
            >
              <CustomUrlButton
                text={socialLink.displayText}
                onClickHandler={() => window.open(socialLink.link, '_blank')}
              />
              <IconButton
                color='error'
                size='small'
                sx={{
                  opacity: 0.3,
                  '&:hover': {
                    opacity: 'unset'
                  },
                  marginLeft: theme.spacing(1)
                }}
              >
                <Icon icon='si-glyph:button-remove' onClick={() => removeButtonClickHandler(socialLink.id)} />
              </IconButton>
            </Stack>
          );
        }
      })}
    </>
  );
}

export default SocialLinks;
