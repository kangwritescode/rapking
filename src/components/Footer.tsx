import { Icon } from '@iconify/react';
import { Link, Stack, SxProps, Typography } from '@mui/material';

export const footerLinks = [
  {
    icon: 'mdi:email',
    href: 'mailto:support@rapking.io',
    text: 'Contact Us'
  },
  {
    icon: 'mdi:book',
    href: '/rules',
    text: 'Community Guidelines'
  },
  {
    icon: 'ic:baseline-discord',
    href: '/community',
    text: 'Discord'
  }
];

export const FooterIconButton = ({
  icon,
  href,
  text,
  sx
}: {
  icon: string;
  href: string;
  text: string;
  sx?: SxProps;
}) => {
  return (
    <Link
      href={href}
      sx={{
        color: 'text.secondary',
        display: 'flex',
        alignItems: 'center',
        fontSize: '1rem',
        whiteSpace: 'nowrap',
        ...sx
      }}
    >
      <Icon icon={icon} fontSize='1rem' style={{ marginRight: '.25rem' }} />
      <Typography variant='caption'>{text}</Typography>
    </Link>
  );
};

interface FooterProps {
  sx?: SxProps;
}

function Footer({ sx }: FooterProps) {
  return (
    <Stack
      component='nav'
      direction='row'
      alignItems='center'
      justifyContent='center'
      py='1.25rem'
      sx={{
        ...sx
      }}
    >
      {footerLinks.map((link, index) => {
        return (
          <FooterIconButton
            key={index}
            href={link.href}
            icon={link.icon}
            text={link.text}
            sx={{
              mr: index === footerLinks.length - 1 ? 0 : '2rem'
            }}
          />
        );
      })}
    </Stack>
  );
}

export default Footer;
