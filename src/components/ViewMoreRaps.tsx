import { Box, Stack, SxProps, Typography } from '@mui/material';
import { Rap } from '@prisma/client';
import { api } from 'src/utils/api';
import RapPreviewCell from './RapPreviewCell';

function ViewMoreRaps({ sx, viewedRap }: { sx?: SxProps; viewedRap: Partial<Rap> }) {
  const { data: randomRapsData } = api.rap.getRandomRaps.useQuery({
    viewedRapId: viewedRap.id || '',
    limit: 4
  });

  return (
    <Stack
      direction='column'
      alignItems='center'
      padding={{
        xs: '2rem 1rem',
        md: '5rem 2.5rem'
      }}
    >
      <Stack sx={sx} width={{ xs: '100%', md: '44rem' }} mx='auto'>
        <Typography variant='h4' fontFamily='impact' sx={{ mb: '4rem' }}>
          View More Raps
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(10rem, 1fr))',
            rowGap: '3rem',
            columnGap: '2rem'
          }}
        >
          {randomRapsData?.map(rap => (
            <RapPreviewCell key={rap.id} rap={rap} />
          ))}
        </Box>
      </Stack>
    </Stack>
  );
}

export default ViewMoreRaps;
