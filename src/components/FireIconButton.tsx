import { Icon } from '@iconify/react';
import { IconButton, SxProps } from '@mui/material';
import React from 'react';

interface FireIconButtonProps {
  onClick: () => void;
  isColored?: boolean;
  sx?: SxProps;
  disabled?: boolean;
}
function FireIconButton({ onClick, isColored, sx, disabled }: FireIconButtonProps) {
  return (
    <IconButton
      sx={{
        paddingRight: 1,
        ...sx
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon {...(isColored ? { color: 'orange' } : {})} icon='mdi:fire' />
    </IconButton>
  );
}

export default FireIconButton;
