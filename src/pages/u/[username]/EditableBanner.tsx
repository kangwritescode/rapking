import { Icon } from '@iconify/react';
import { Box, CardMedia, IconButton } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { bucketPATH } from 'src/shared/constants';
import { api } from 'src/utils/api';

interface EditableBannerProps {
  isEditable?: boolean;
  userId?: string;
}

function EditableBanner({ isEditable = true, userId }: EditableBannerProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentFiles = fileInputRef?.current?.files
  const file = currentFiles && currentFiles[0];
  const fileExtension = file?.name.split('.').pop();

  const { data: presignedUrl } = api.gcloud.generatePresignedUrl.useQuery({ fileName: `users/${userId}/banner.${fileExtension}` || '' }, {
    enabled: !!fileExtension && !!userId
  });

  console.log(presignedUrl)

  useEffect(() => {
    if (presignedUrl && file) {
      axios.put(presignedUrl, file, {
      }).then(() => {
        console.log('success')
      }).catch((err) => {
        console.log(err)
      })

    }
  }, [presignedUrl, file])

  return (
    <>
      <input
        accept="image/jpeg, image/png"
        id="image-button-file"
        type="file"
        ref={fileInputRef}
        hidden
      />
      <Box
        sx={{
          ...(isEditable && { cursor: 'pointer' }),
          position: 'relative',
          zIndex: 0,
        }}>

        <IconButton
          onClick={() => fileInputRef?.current?.click()}
          sx={{
            position: 'absolute',
            right: '1rem',
            bottom: '1rem',
          }}
        >
          <Icon icon='mdi:camera-plus-outline' width={24} height={24} />
        </IconButton>
        <CardMedia
          component='img'
          alt='profile-header'
          image={bucketPATH + '/default/turntable-background.jpg'}
          sx={{
            height: { xs: 150, md: 250 }
          }}
        />
      </Box>
    </>
  )
}

export default EditableBanner
