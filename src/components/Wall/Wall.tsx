import { Stack } from '@mui/material';
import { ThreadType } from '@prisma/client';
import ThreadComments from '../RapPage/ThreadComments';
import WallCommentComposer from './WallCommentComposer';

interface WallProps {
  threadId?: string | null;
}

function Wall({ threadId }: WallProps): JSX.Element {
  return (
    <Stack height='100%' py='.5rem' width='100%'>
      <WallCommentComposer
        threadId={threadId}
        sx={{
          flexGrow: 1
        }}
      />
      <ThreadComments
        style={{
          height: 'calc(100% - 5rem)',
          width: 'calc(100% - 2rem)',
          margin: 'auto'
        }}
        threadId={threadId}
        sortBy='RECENT'
        threadType={ThreadType.WALL}
      />
    </Stack>
  );
}

export default Wall;
