import { Icon } from '@iconify/react';
import { Box, Button, IconButton, Stack, SxProps, useTheme } from '@mui/material';
import { SocialLink } from '@prisma/client';
import CustomUrlButton from 'src/components/UserPage/CustomUrlButton';
import { api } from 'src/utils/api';

interface SocialLinksProps {
  socialLinks: SocialLink[];
  isCurrentUser: boolean;
  hideEditButtons?: boolean;
  sx?: SxProps;
  addLinkClickHandler?: () => void;
}

function SocialLinks({
  socialLinks,
  isCurrentUser,
  hideEditButtons,
  sx,
  addLinkClickHandler
}: SocialLinksProps) {
  const theme = useTheme();

  const { mutate: deleteSocialLink } = api.socialLink.deleteSocialLink.useMutation();
  const { invalidate } = api.useUtils().socialLink.getSocialLinkByUserId;

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

  const renderedSocialLinks = socialLinks.map(socialLink => {
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
          {!hideEditButtons && isCurrentUser && (
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
  });

  if (!hideEditButtons && socialLinks && socialLinks.length < 5 && isCurrentUser) {
    renderedSocialLinks.push(
      <Button
        variant='outlined'
        onClick={addLinkClickHandler}
        color='secondary'
        disabled={!isCurrentUser}
        size='small'
        sx={{
          position: 'relative',
          borderRadius: '1.25rem',
          height: '2rem'
        }}
      >
        <Icon icon='zondicons:add-outline' /> &nbsp; Add Social Link
      </Button>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        ...sx
      }}
    >
      {renderedSocialLinks}
    </Box>
  );
}

export default SocialLinks;
