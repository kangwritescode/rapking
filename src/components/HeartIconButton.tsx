import { Icon } from '@iconify/react';
import { IconButton, SxProps } from '@mui/material';

interface FireIconButtonProps {
  onClick: () => void;
  isColored?: boolean;
  sx?: SxProps;
  disabled?: boolean;
}
function HeartIconButton({ onClick, isColored, sx, disabled }: FireIconButtonProps) {
  return (
    <IconButton
      className='heart-icon-button'
      sx={{
        paddingRight: 1,
        ...sx
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon {...(isColored ? { color: 'red' } : {})} icon='mdi:heart' />
    </IconButton>
  );
}

export default HeartIconButton;
