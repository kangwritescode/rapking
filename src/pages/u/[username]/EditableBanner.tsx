/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from '@iconify/react';
import { Box, CardMedia, CircularProgress, IconButton } from '@mui/material'
import { User } from '@prisma/client';
import React, { useRef, useState } from 'react'

import { CDN_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';
import { useGCloudUpload } from 'src/shared/useGCloudUpload';

interface EditableBannerProps {
  isEditable?: boolean;
  userData: User;
}

function EditableBanner({ isEditable, userData }: EditableBannerProps) {

  const { id, bannerUrl } = userData;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);

  // Mutations
  const { mutateAsync: updateUser } = api.user.updateUser.useMutation();

  // Invalidaters
  const { invalidate: invalidateUserQuery } = api.useContext().user.findByUsername;

  const { isUploading } = useGCloudUpload({
    entityID: id,
    directory: 'user',
    namePrefix: 'banner',
    currFileUrl: bannerUrl,
    file,
    onUploadSuccess: async (url) => {
      await updateUser({ bannerUrl: url });
      invalidateUserQuery();
      setFile(null);
    }
  })

  return (
    <>
      <input
        accept="image/jpeg, image/png"
        id="image-button-file"
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0])
          }
        }}
        hidden
      />
      <Box
        sx={{
          position: 'relative',
        }}>

        {isUploading && (
          <CircularProgress
            sx={{
              marginRight: '1rem',
              color: 'white',
              position: 'absolute',
              top: '50%',
              left: '50%',
              translate: '-50% -50%',
            }} />
        )}

        {isEditable && (
          <Box
            position='absolute'
            right='1rem'
            bottom='1rem'>
            <IconButton
              onClick={() => fileInputRef?.current?.click()}
              sx={(theme) => ({
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
          image={bannerUrl ? `${CDN_URL}/${bannerUrl}` : `${CDN_URL}/default/profile-banner.jpg`}
          sx={{
            height: { xs: 150, md: 250 }
          }}
        />
      </Box>
    </>
  )
}

export default EditableBanner
