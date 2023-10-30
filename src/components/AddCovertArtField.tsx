import { Box, Button, Typography } from '@mui/material';
import { Rap } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BUCKET_URL } from 'src/shared/constants';
import { useGCloudUpload } from 'src/shared/useGCloudUpload';
import DropzoneInput from './DropzoneInput';

interface AddCovertArtFieldProps {
  setNewCoverArtUrl: (url: string | null) => void;
  rapData?: Rap | null;
}

function AddCovertArtField({ setNewCoverArtUrl, rapData }: AddCovertArtFieldProps) {
  const { data } = useSession();
  const currentUserId = data?.user?.id;

  const [file, setFile] = useState<File | null>(null);
  const [displayedImage, setDisplayedImage] = useState<string | null>(null);

  const { isUploading } = useGCloudUpload({
    path: `user/${currentUserId}/temp`,
    filename: 'draft-cover-art',
    file,
    onUploadSuccess: async url => {
      setNewCoverArtUrl(url);
      setDisplayedImage(`${BUCKET_URL}/${url}`);
    }
  });

  useEffect(() => {
    if (rapData?.coverArtUrl) {
      setDisplayedImage(`${BUCKET_URL}/${rapData?.coverArtUrl}`);
    }
  }, [rapData]);

  const handleRemoveeButtonClick = () => {
    setDisplayedImage(null);
    setNewCoverArtUrl(null);
  };

  const handleResetButtonClick = () => {
    setNewCoverArtUrl(rapData?.coverArtUrl || null);
    if (rapData?.coverArtUrl) {
      setDisplayedImage(`${BUCKET_URL}/${rapData?.coverArtUrl}`);
    }
  };

  return (
    <Box sx={theme => ({ p: '.75rem .75rem 0 .75rem', border: `1px solid ${theme.palette.grey[800]}` })}>
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
      {
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {rapData?.coverArtUrl && !displayedImage?.includes(rapData?.coverArtUrl) && (
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
          {displayedImage && (
            <Button
              variant='text'
              onClick={handleRemoveeButtonClick}
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
      }
    </Box>
  );
}

export default AddCovertArtField;
