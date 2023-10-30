import { Box, SxProps, Typography, useTheme } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneInputProps {
  sx?: SxProps;
  setFile: (file: File | null) => void;
}

function DropzoneInput({ sx, setFile }: DropzoneInputProps) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDropAccepted: (acceptedFiles: File[]) => {
      const acceptedFile = acceptedFiles[0];
      setFile(acceptedFile);
    }
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

  return (
    <Box sx={{ height: '100%', position: 'relative', ...sx }}>
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
      <input hidden {...getInputProps()} />
    </Box>
  );
}

export default DropzoneInput;
