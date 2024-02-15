import { Icon } from '@iconify/react';
import { IconButton, SxProps } from '@mui/material';

interface ColoredIconButtonProps {
  onClick: () => void;
  isColored?: boolean;
  sx?: SxProps;
  disabled?: boolean;
  icon: string;
  iconColor: string;
}
function ColoredIconButton({
  onClick,
  isColored,
  sx,
  disabled,
  iconColor,
  icon
}: ColoredIconButtonProps) {
  return (
    <IconButton
      className='colored-icon-button'
      sx={{
        ...sx
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon {...(isColored ? { color: iconColor } : {})} icon={icon} />
    </IconButton>
  );
}

export default ColoredIconButton;
