import { Box, Button, Typography } from '@mui/material';
import { PulsePost } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { api } from 'src/utils/api';

interface PulsePostProps {
  pulsePost: PulsePost;
}

function PulsePost({ pulsePost }: PulsePostProps) {
  const session = useSession();
  const isAdmin = session?.data?.user?.isAdmin;

  const { mutateAsync: deletePost } = api.pulse.deletePost.useMutation();
  const { invalidate: invalidateGetAllPosts } = api.useContext().pulse.getAllPosts;

  const handleDelete = async () => {
    await deletePost({ id: pulsePost.id }).then(() => {
      invalidateGetAllPosts();
    });
  };

  return (
    <>
      <Box component='article' key={pulsePost.id} mb='2rem'>
        <Typography component='h2' fontSize='1.5rem' fontWeight='600'>
          {pulsePost.createdAt.toLocaleDateString()}
        </Typography>
        <Typography
          component='div'
          variant='body1'
          fontSize='1.25rem'
          dangerouslySetInnerHTML={{
            __html: pulsePost.content
          }}
        />
        {isAdmin ? (
          <Button onClick={handleDelete} size='small' color='secondary' variant='outlined'>
            Delete
          </Button>
        ) : undefined}
      </Box>
    </>
  );
}

export default PulsePost;
