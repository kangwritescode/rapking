import { Drawer } from '@mui/material';
import { useRouter } from 'next/router';
import RapThread from '../RapThread/RapThread';

interface ThreadDrawerProps {
  onCloseHandler: () => void;
  isOpen: boolean;
  threadId?: string | null;
}

function ThreadDrawer({ onCloseHandler, isOpen, threadId }: ThreadDrawerProps) {
  const { commentId } = useRouter().query;

  return (
    <Drawer
      anchor='right'
      open={isOpen}
      onClose={onCloseHandler}
      sx={{
        width: {
          xs: '100%',
          md: 'unset'
        }
      }}
    >
      <RapThread
        sortByDefaultValue={commentId ? 'RECENT' : 'POPULAR'}
        threadId={threadId}
        closeButtonClickHandler={onCloseHandler}
        sx={{
          px: 6,
          pt: 6
        }}
      />
    </Drawer>
  );
}

export default ThreadDrawer;
