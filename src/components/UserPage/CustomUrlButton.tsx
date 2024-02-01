import { Icon } from '@iconify/react';
import { Button, SxProps, useTheme } from '@mui/material';

interface CustomUrlButtonProps {
  onClickHandler?: () => void;
  sx?: SxProps;
  text?: string | null;
}

function CustomUrlButton({ onClickHandler, sx, text }: CustomUrlButtonProps) {
  const theme = useTheme();

  return (
    <Button
      variant='contained'
      startIcon={<Icon color='inherit' icon='octicon:link-16' />}
      size='small'
      sx={{
        borderRadius: '20px',
        color: theme.palette.grey[300],
        borderColor: theme.palette.grey[400],
        backgroundColor: theme.palette.grey[800],
        fontSize: '0.75rem',
        ...sx,
        ['&:hover']: {
          borderColor: 'unset',
          backgroundColor: theme.palette.grey[700]
        }
      }}
      onClick={onClickHandler}
    >
      {text || 'Custom URL'}
    </Button>
  );
}

export default CustomUrlButton;
