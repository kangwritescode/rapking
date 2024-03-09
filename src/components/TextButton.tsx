import { Button, ButtonProps, useTheme } from '@mui/material';

function TextButton({
  children,
  sx,
  ...rest
}: {
  children: string;
} & ButtonProps) {
  const theme = useTheme();

  return (
    <Button
      variant='text'
      size='small'
      sx={{
        color: theme.palette.text.secondary,
        textTransform: 'unset',
        p: 0,
        minWidth: 'unset',
        ...sx
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}

export default TextButton;
