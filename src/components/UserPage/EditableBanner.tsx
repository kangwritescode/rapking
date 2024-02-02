/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from '@iconify/react';
import { Box, CardMedia, CircularProgress, IconButton } from '@mui/material';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';

import { BUCKET_URL } from 'src/shared/constants';
import { useGCloudDelete } from 'src/shared/useGCloudDelete';
import { useGCloudUpload } from 'src/shared/useGCloudUpload';
import { api } from 'src/utils/api';

interface EditableBannerProps {
  isEditable?: boolean;
  userData?: Partial<User> | null;
}

function EditableBanner({ isEditable, userData }: EditableBannerProps) {
  const { id, bannerUrl } = userData || {};
  const session = useSession();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);

  // Mutations
  const { mutateAsync: updateUser } = api.user.updateUser.useMutation();

  // Invalidaters
  const { invalidate: invalidateUserQuery } = api.useContext().user.findByUsername;

  const { deleteFile } = useGCloudDelete({
    url: bannerUrl || '',
    isAuthenticated: session?.status === 'authenticated'
  });

  const { isUploading } = useGCloudUpload({
    path: `user/${id}`,
    filename: 'banner',
    file,
    onUploadSuccess: async url => {
      await updateUser({ bannerUrl: url });
      invalidateUserQuery();
      setFile(null);
      deleteFile();
    }
  });

  return (
    <>
      <input
        accept='image/jpeg, image/png'
        id='image-button-file'
        type='file'
        ref={fileInputRef}
        onChange={e => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
        hidden
      />
      <Box
        sx={{
          position: 'relative'
        }}
      >
        {isUploading && (
          <CircularProgress
            sx={{
              marginRight: '1rem',
              color: 'white',
              position: 'absolute',
              top: '50%',
              left: '50%',
              translate: '-50% -50%'
            }}
          />
        )}

        {isEditable && (
          <Box position='absolute' right='1rem' bottom='1rem' zIndex={10}>
            <IconButton
              onClick={() => fileInputRef?.current?.click()}
              sx={theme => ({
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                opacity: 0.6,
                ':hover': {
                  background: theme.palette.background.paper,
                  opacity: 1
                }
              })}
            >
              <Icon icon='mdi:camera-plus-outline' />
            </IconButton>
          </Box>
        )}

        <CardMedia
          component='img'
          alt='profile-header'
          image={
            bannerUrl ? `${BUCKET_URL}/${bannerUrl}` : `${BUCKET_URL}/default/profile-banner.jpg`
          }
          sx={{
            height: 150
          }}
        />
      </Box>
    </>
  );
}

export default EditableBanner;
