import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SCPlayer from '../SCPlayer';
import AddSCButton from './AddSCButton';

interface SoundcloudUrlFieldProps {
  soundcloudUrl?: string | null;
  setSoundcloudUrl: (url: string) => void;
}

function SoundcloudUrlField({ soundcloudUrl, setSoundcloudUrl }: SoundcloudUrlFieldProps) {
  const [url, setUrl] = useState<string>(soundcloudUrl || '');

  useEffect(() => {
    setSoundcloudUrl(url);
  }, [url, setSoundcloudUrl]);

  const showRemoveButton = Boolean(url);

  return (
    <>
      {url && (
        <Box
          sx={theme => ({
            position: 'relative',
            border: `1px solid ${theme.palette.grey[800]}`,
            px: '.75rem',
            pt: '.75rem',
            pb: showRemoveButton ? 0 : '.75rem'
          })}
        >
          <SCPlayer
            url={url}
            sx={{
              height: '8rem'
            }}
          />
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            {showRemoveButton && (
              <Button
                variant='text'
                sx={{
                  p: '0 0 .3rem 0',
                  ml: 'auto'
                }}
                onClick={() => setUrl('')}
              >
                <Typography
                  variant='caption'
                  color='error'
                  sx={{
                    opacity: 0.7,
                    ':hover': {
                      opacity: 1
                    }
                  }}
                >
                  Remove
                </Typography>
              </Button>
            )}
          </Box>
        </Box>
      )}

      {!url && (
        <AddSCButton soundCloudUrlDefault={url || ''} setSoundcloudUrl={url => setUrl(url)} />
      )}
    </>
  );
}

export default SoundcloudUrlField;
