import { Icon } from '@iconify/react';
import { Button, SxProps, useTheme } from '@mui/material';
import React from 'react';

interface CustomUrlButtonProps {
  onClickHandler?: () => void;
  sx?: SxProps;
  text?: string | null;
}

function CustomUrlButton({ onClickHandler, sx, text }: CustomUrlButtonProps) {
  const theme = useTheme();

  return (
    <Button
      variant='outlined'
      startIcon={<Icon color='inherit' icon='octicon:link-16' />}
      size='small'
      sx={{
        borderRadius: '20px',
        color: theme.palette.grey[400],
        borderColor: theme.palette.grey[400],
        ...sx,
        ['&:hover']: {
          borderColor: 'unset'
        }
      }}
      onClick={onClickHandler}
    >
      {text || 'Custom URL'}
    </Button>
  );
}

export default CustomUrlButton;
