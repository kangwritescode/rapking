import { Box, Button, Stack, SxProps, Typography, useTheme } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneInputProps {
  sx?: SxProps;
}

function DropzoneInput({ sx }: DropzoneInputProps) {
  const [file, setFile] = useState<File | null>(null);

  const dropAcceptedHandler = useCallback((acceptedFiles: File[]) => {
    const acceptedFile = acceptedFiles[0];
    setFile(acceptedFile);
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDropAccepted: dropAcceptedHandler
  });
  const theme = useTheme();

  const getColor = useCallback(
    (props: any) => {
      if (props.isDragAccept) {
        return '#00e676';
      }
      if (props.isDragReject) {
        return '#ff1744';
      }
      if (props.isFocused) {
        return '#2196f3';
      }

      return theme.palette.grey[700];
    },
    [theme]
  );

  const objectURL = file ? URL.createObjectURL(file) : '';

  return (
    <Box sx={{ p: '.75rem', height: '100%', position: 'relative', ...sx }}>
      {file ? (
        <img
          src={objectURL}
          alt='cover-art'
          style={{
            width: '100%',
            height: '7rem'
          }}
        />
      ) : (
        <Box
          {...getRootProps({ isFocused, isDragAccept, isDragReject })}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: '1px',
            borderColor: getColor({ isFocused, isDragAccept, isDragReject }),
            borderStyle: 'dashed',
            outline: 'none',
            transition: 'border 0.24s ease-in-out',
            cursor: 'pointer',
            height: '7rem'
          }}
        >
          <Typography variant='caption'>Add Cover Art</Typography>
        </Box>
      )}
      <input hidden {...getInputProps()} />
      {file && (
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='top'
          sx={{
            mt: '.3rem'
          }}
        >
          <Typography
            variant='caption'
            lineHeight='.1'
            sx={{
              pointerEvents: 'none'
            }}
          >
            {file.name.length > 20 ? file.name.slice(0, 20) + '...' : file.name}
          </Typography>
          <Button
            variant='text'
            sx={{
              p: 'unset',
              position: 'relative',
              left: '.4rem',
              top: '.1rem'
            }}
            onClick={() => setFile(null)}
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
              lineHeight='.1'
            >
              Remove
            </Typography>
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export default DropzoneInput;
