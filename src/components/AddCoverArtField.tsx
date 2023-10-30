import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Rap } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BUCKET_URL } from 'src/shared/constants';
import { useGCloudUpload } from 'src/shared/useGCloudUpload';
import DropzoneInput from './DropzoneInput';

interface AddCoverArtFieldProps {
  setCoverArtUrl: (url: string | null) => void;
  rapData?: Rap | null;
}

function AddCoverArtField({ setCoverArtUrl, rapData }: AddCoverArtFieldProps) {
  const { data } = useSession();
  const currentUserId = data?.user?.id;

  const [file, setFile] = useState<File | null>(null);
  const [displayedImage, setDisplayedImage] = useState<string | null>(null);

  const { isUploading } = useGCloudUpload({
    path: `user/${currentUserId}/temp`,
    filename: 'draft-cover-art',
    file,
    onUploadSuccess: async url => {
      setCoverArtUrl(url);
      setDisplayedImage(`${BUCKET_URL}/${url}`);
    }
  });

  useEffect(() => {
    if (rapData?.coverArtUrl) {
      setDisplayedImage(`${BUCKET_URL}/${rapData?.coverArtUrl}`);
    }
  }, [rapData]);

  const handleRemoveButtonClick = () => {
    setDisplayedImage(null);
    setCoverArtUrl(null);
  };

  const handleResetButtonClick = () => {
    setCoverArtUrl(rapData?.coverArtUrl || null);
    if (rapData?.coverArtUrl) {
      setDisplayedImage(`${BUCKET_URL}/${rapData?.coverArtUrl}`);
    }
  };

  const showResetButton = rapData?.coverArtUrl && !displayedImage?.includes(rapData?.coverArtUrl);
  const showRemoveButton = Boolean(displayedImage);

  return (
    <Box
      sx={theme => ({
        position: 'relative',
        p: `.75rem .75rem ${showRemoveButton || showResetButton ? 0 : '.75rem'} .75rem`,
        border: `1px solid ${theme.palette.grey[800]}`
      })}
    >
      {isUploading && (
        <Box
          sx={{
            background: 'black',
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.5
          }}
        >
          <CircularProgress color='inherit' />
        </Box>
      )}
      {!displayedImage && <DropzoneInput sx={{ height: '7rem' }} setFile={setFile} />}
      {displayedImage && (
        <img
          src={displayedImage}
          alt='cover-art'
          style={{
            width: '100%',
            height: '8rem'
          }}
        />
      )}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {showResetButton && (
          <Button
            variant='text'
            onClick={handleResetButtonClick}
            sx={{
              pt: '.3rem',
              pb: '.3rem',
              pl: 'unset'
            }}
          >
            <Typography variant='caption' color='secondary'>
              Reset
            </Typography>
          </Button>
        )}
        {showRemoveButton && (
          <Button
            variant='text'
            onClick={handleRemoveButtonClick}
            sx={{
              p: '0 0 .3rem 0',
              ml: 'auto'
            }}
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
  );
}

export default AddCoverArtField;
