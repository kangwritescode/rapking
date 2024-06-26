import { Box, Card, Stack, Typography } from '@mui/material';
import { Promotion, Rap, User } from '@prisma/client';
import RapCard from '../RapCard';
import { Collaborator } from '../WritePage/RapEditor';

interface LatestRapsSectionProps {
  raps?: (Rap & {
    user: Partial<User>;
    collaborators: Array<Collaborator>;
    promotions?: Array<Partial<Promotion>>;
  })[];
}

function LatestRapsSection({ raps }: LatestRapsSectionProps) {
  return (
    <Box component='section' p='2rem 2rem 6rem'>
      <Typography component='h2' sx={{ mb: '2rem', fontSize: '2rem' }} fontFamily='impact'>
        Latest Raps
      </Typography>
      <Stack
        gap='1.5rem'
        sx={{
          flexDirection: {
            xs: 'column',
            md: 'row'
          }
        }}
      >
        {raps?.map(rap => {
          return (
            <Card
              key={rap.id}
              sx={{
                p: '2rem 2rem',
                borderRadius: '1rem',
                flexGrow: 1,
                maxWidth: {
                  xs: '100%',
                  md: '50%'
                }
              }}
            >
              <RapCard rap={rap} showChips contentMaxLength={100} />
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}

export default LatestRapsSection;
