import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import YTPlayer from '../YTPlayer';
import AddYTButton from './AddYTButton';

interface YoutubeVideoIdFieldProps {
  youtubeVideoId?: string | null;
  setYoutubeVideoId: (videoId: string) => void;
}

function YoutubeVideoIdField({ youtubeVideoId, setYoutubeVideoId }: YoutubeVideoIdFieldProps) {
  const [videoId, setVideoId] = useState<string>(youtubeVideoId || '');

  useEffect(() => {
    setYoutubeVideoId(videoId);
  }, [videoId, setYoutubeVideoId]);

  const showRemoveButton = Boolean(videoId);

  return (
    <>
      {videoId && (
        <Box
          sx={theme => ({
            position: 'relative',
            border: `1px solid ${theme.palette.grey[800]}`,
            px: '.75rem',
            pt: '.75rem',
            pb: showRemoveButton ? 0 : '.75rem'
          })}
        >
          <YTPlayer
            videoId={videoId}
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
                onClick={() => setVideoId('')}
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

      {!videoId && (
        <AddYTButton
          youtubeVideoIdDefault={videoId || ''}
          setYoutubeVideoId={videoId => setVideoId(videoId)}
        />
      )}
    </>
  );
}

export default YoutubeVideoIdField;
