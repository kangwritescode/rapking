import { Link, Stack, Typography } from '@mui/material';

const LandingFooter = () => {
  const footerLinkData = [
    {
      title: 'Contact Us',
      path: 'mailto:support@rapking.io'
    }
  ];

  return (
    <Stack width='100%' alignItems='center'>
      <Stack alignItems='center' direction='row' py='1.5rem' gap='2rem'>
        {footerLinkData.map(({ title, path }) => (
          <Link key={title} href={path} color='inherit'>
            <Typography variant='body2' color='text.secondary'>
              {title}
            </Typography>
          </Link>
        ))}
      </Stack>
    </Stack>
  );
};

export default LandingFooter;
