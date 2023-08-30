/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from '@iconify/react';
import { Box, CardMedia, CircularProgress, IconButton } from '@mui/material'
import { User } from '@prisma/client';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast';
import { v4 } from 'uuid';

import { deleteFile, uploadFile } from 'src/gcloud/clientMethods';
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

  // Queries
  const { data: writeUrl } = api
    .gcloud
    .generateWriteUrl
    .useQuery({ fileName: newFilename }, {
      enabled: !!newFilename
    });

  const { data: deleteUrl } = api
    .gcloud
    .generateDeleteUrl
    .useQuery({ fileName: bannerUrl || '' }, {
      enabled: !!newFilename && !!bannerUrl
    });

  // Mutations
  const { mutateAsync: updateUser } = api.user.updateUser.useMutation();

  // Invalidaters
  const { invalidate: invalidateUserQuery } = api.useContext().user.findByUsername;

  // Generates new filename when file is selected
  useEffect(() => {
    if (file) {
      const fileExtension = file?.name.split('.').pop();
      const newFileName = `users/${id}/banner-${v4()}.${fileExtension}`;
      setNewFilename(newFileName);
    }
  }, [file])

  // Uploads file to GCloud when presignedUrl is generated and file is selected
  useEffect(() => {
    if (writeUrl && file && newFilename) {
      const uploadBanner = async () => {
        setIsUploading(true);
        try {
          await uploadFile(writeUrl, file);
          if (deleteUrl) {
            await deleteFile(deleteUrl);
          }
          await updateUser({ bannerUrl: newFilename });
          invalidateUserQuery();

          setFile(null);
          setNewFilename('');
          setIsUploading(false);

          toast.success('Updated Banner!')
        } catch (error) {
          setIsUploading(false);
        }
      }

      uploadBanner()
    }

  }, [writeUrl])

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
