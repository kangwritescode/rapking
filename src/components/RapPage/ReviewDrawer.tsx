import { Drawer } from '@mui/material';
import { Rap } from '@prisma/client';
import ReviewSection from './ReviewSection';

interface ReviewDrawerProps {
  onCloseHandler: () => void;
  isOpen: boolean;
  rapData?: Rap | null;
}

function ReviewDrawer({ onCloseHandler, isOpen, rapData }: ReviewDrawerProps) {
  return (
    <Drawer
      anchor='right'
      open={isOpen}
      onClose={onCloseHandler}
      sx={{ pt: '.5rem', position: 'relative' }}
    >
      <ReviewSection
        onCloseHandler={onCloseHandler}
        sx={{
          width: {
            xs: '100vw',
            md: '30rem',
            height: '100%'
          }
        }}
        rapData={rapData}
      />
    </Drawer>
  );
}

export default ReviewDrawer;
