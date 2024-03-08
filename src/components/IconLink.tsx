import { Icon } from '@iconify/react';
import { Box, SxProps } from '@mui/material';
import Link from 'next/link';

interface IconLinkProps {
  href?: string;
  icon: string;
  text: string;
  color: string;
  gap?: string | number;
  fontSize?: string;
  onClick?: () => void;
  sx?: SxProps;
}

function IconLink({
  href = '',
  icon,
  text,
  color,
  gap = '0',
  fontSize = '.75rem',
  onClick,
  sx
}: IconLinkProps) {
  return (
    <Box
      component={href ? Link : 'span'}
      href={href}
      onClick={onClick}
      sx={{
        color,
        textDecoration: 'none',
        display: 'flex',
        width: 'fit-content',
        alignItems: 'center',
        fontSize,
        borderBottom: `1px solid transparent`,
        cursor: 'pointer',
        '&:hover': {
          borderBottomColor: color
        },
        height: '1rem',
        ...sx
      }}
    >
      <Icon icon={icon} style={{ marginRight: gap }} />
      {text}
    </Box>
  );
}

export default IconLink;
