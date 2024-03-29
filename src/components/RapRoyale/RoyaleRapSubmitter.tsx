import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { RapRoyale } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';

interface RoyaleRapSubmitterProps {
  royale?: RapRoyale | null;
  onSubmitSuccess?: () => void;
}

function RoyaleRapSubmitter({ royale, onSubmitSuccess }: RoyaleRapSubmitterProps) {
  const session = useSession();
  const userId = session.data?.user?.id || '';
  const [selectedRapId, setSelectedRapId] = useState<string | null>(null);

  // Invalidator
  const { invalidate: invalidateGetRoyale } = api.useUtils().royales.get;

  // Queries
  const { data: rapData } = api.rap.getAllRapsSimple.useQuery(
    {
      userId
    },
    {
      enabled: !!userId
    }
  );
  const { data: userData } = api.user.getCurrentUser.useQuery();

  // Mutations
  const { mutate: submitRap } = api.royales.submitRap.useMutation({
    onSuccess: () => {
      setSelectedRapId(null);
      toast.success('Rap submitted successfully');
      onSubmitSuccess?.();
      invalidateGetRoyale();
    },
    onError: error => {
      toast.error(error.message);
    }
  });

  const submitHandler = async () => {
    if (!selectedRapId || !royale) return;

    submitRap({
      rapId: selectedRapId,
      royaleId: royale.id
    });
  };

  return (
    <Box>
      <Typography>Choose a rap to submit:</Typography>
      <List sx={{ width: '100%', mt: '1rem' }}>
        {rapData?.map(rap => {
          const isSelected = selectedRapId === rap.id;

          return (
            <ListItem key={rap.id} disablePadding>
              <ListItemButton onClick={() => setSelectedRapId(isSelected ? null : rap.id)} dense>
                <ListItemIcon>
                  <Checkbox edge='start' checked={isSelected} tabIndex={-1} disableRipple />
                </ListItemIcon>
                <ListItemText id={rap.id} primary={`${userData?.username} - '${rap.title}'`} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Button
        variant='contained'
        fullWidth
        sx={{
          mt: '1.5rem'
        }}
        disabled={!selectedRapId}
        onClick={submitHandler}
      >
        Submit
      </Button>
    </Box>
  );
}

export default RoyaleRapSubmitter;
