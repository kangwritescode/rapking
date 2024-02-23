import { Stack, useTheme } from '@mui/material';

function ReviewInbox() {
  const theme = useTheme();

  return (
    <Stack
      direction='row'
      sx={{
        height: '100%',
        position: 'relative',
        width: '100%'
      }}
    >
      <Stack
        sx={{
          borderRight: `1px solid ${theme.palette.divider}`,
          width: '35%'
        }}
      >
        hello
      </Stack>
      <Stack flexGrow='1'>govnah</Stack>
    </Stack>
  );
}

export default ReviewInbox;
