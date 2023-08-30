/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from '@iconify/react';
import { Box, CardMedia, CircularProgress, IconButton } from '@mui/material'
import { User } from '@prisma/client';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast';
import { v4 } from 'uuid';

// import { toast } from 'react-hot-toast';
import { uploadFile } from 'src/gcloud/clientMethods';
import { CDN_URL } from 'src/shared/constants';
import { api } from 'src/utils/api';

interface EditableBannerProps {
  isEditable?: boolean;
  userData: User;
}

function EditableBanner({ isEditable, userData }: EditableBannerProps) {

  const { id, bannerUrl } = userData;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);
  const [newFilename, setNewFilename] = useState('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (file) {
      const fileExtension = file?.name.split('.').pop();
      const newFileName = `users/${id}/banner-${v4()}.${fileExtension}`;
      setNewFilename(newFileName);
    }
  }, [file])

  // Queries
  const { data: presignedUrl } = api.gcloud.generatePresignedUrl.useQuery({ fileName: newFilename }, {
    enabled: !!newFilename
  });

  // Mutations
  const { mutateAsync: updateUser } = api.user.updateUser.useMutation();

  // Invalidaters
  const { invalidate: invalidateUser } = api.useContext().user.findByUsername;

  // Uploads file to GCloud when presignedUrl is generated and file is selected
  useEffect(() => {
    if (presignedUrl && file && newFilename) {

      const uploadBanner = async () => {
        setIsUploading(true);
        try {
          const { status } = await uploadFile(presignedUrl, file);
          if (status === 200) {
            await updateUser({ bannerUrl: newFilename });
            invalidateUser();
            setFile(null);
            setNewFilename('');
            toast.success('Updated Banner!')
          }
          setIsUploading(false);
        } catch (error) {
          setIsUploading(false);
        }
      }

      uploadBanner()
    }

  }, [presignedUrl, file, newFilename])

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
          zIndex: 0,
        }}>

        {isUploading && (
          <CircularProgress
            sx={{
              marginRight: '1rem',
              color: 'white',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translateY(-50%) translateX(-50%)'
            }} />
        )}

        {isEditable && (
          <Box
            position='absolute'
            right='1rem'
            bottom='1rem'
            display='flex'>
            <IconButton
              onClick={() => fileInputRef?.current?.click()}
              sx={(theme) => ({
                background: theme.palette.background.paper,
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
