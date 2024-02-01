import { Icon } from '@iconify/react';
import { Box, IconButton, Stack, SxProps, useTheme } from '@mui/material';
import { SocialLink } from '@prisma/client';
import CustomUrlButton from 'src/components/UserPage/CustomUrlButton';
import { api } from 'src/utils/api';

interface SocialLinksProps {
  socialLinks: SocialLink[];
  isCurrentUser: boolean;
  hideDeleteButtons?: boolean;
  sx?: SxProps;
}

function SocialLinks({ socialLinks, isCurrentUser, hideDeleteButtons, sx }: SocialLinksProps) {
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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        ...sx
      }}
    >
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
              {!hideDeleteButtons && isCurrentUser && (
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
                  onClick={() => removeButtonClickHandler(socialLink.id)}
                >
                  <Icon icon='si-glyph:button-remove' />
                </IconButton>
              )}
            </Stack>
          );
        }
      })}
    </Box>
  );
}

export default SocialLinks;
