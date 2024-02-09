import { Alert, Box, Stack, Typography } from '@mui/material';

function RulesPage() {
  return (
    <Stack
      direction='column'
      alignItems='center'
      padding={{
        xs: '2rem 1rem',
        md: '2.5rem'
      }}
    >
      <Stack width={{ xs: '100%', md: '44rem' }}>
        <h1
          style={{
            fontFamily: 'impact',
            fontSize: '3rem',
            marginBlockEnd: '0',
            lineHeight: '3rem'
          }}
        >
          RapKing Community Guidelines
        </h1>
        <Typography variant='body2' mb='2rem'>
          Last updated: February 9th, 2024
        </Typography>
        <Alert severity='error' style={{ marginBottom: '1rem' }}>
          These rules are in progress and are subject to change at any time.
          <br />
          <br />
          TLDR - Don't be stupid or you'll be banned.
        </Alert>
        <Typography variant='h6' fontWeight={600} mb='.5rem'>
          Partaking in any of the following will result in a suspension or immediate and permanent
          ban:
        </Typography>
        <Box
          component='ul'
          sx={{
            li: {
              marginBottom: '1rem'
            }
          }}
        >
          <li>Posting gore, porn, or any other "shocking" media on any parts of the website.</li>
          <li>Stealing content from other users and claiming it as your own.</li>
          <li>Impersonating other users.</li>
          <li>
            <b> Racist shit does not fly here.</b> Zero tolerance for racist content. If your
            clowning in rap lyrics and it's all in good fun, that's one thing, but blatantly racist
            lyrics, comments, images, etc., or some ignorant casual 4Chan-esque racist meme shit
            &nbsp;
            <b>will result in an immediate and permanent ban.</b>
          </li>
        </Box>
      </Stack>
    </Stack>
  );
}

export default RulesPage;
