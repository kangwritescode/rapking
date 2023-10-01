import { Icon } from '@iconify/react';
import { Avatar, Box, CircularProgress, IconButton, useTheme } from '@mui/material'
import { User } from '@prisma/client';
import React, { useRef, useState } from 'react'
import { CDN_URL } from 'src/shared/constants'
import { useGCloudDelete } from 'src/shared/useGCloudDelete';
import { useGCloudUpload } from 'src/shared/useGCloudUpload';
import { api } from 'src/utils/api';

interface EditableProfilePhotoProps {
  userData: User;
  isEditable?: boolean;
}

function EditableProfilePhoto({ userData, isEditable }: EditableProfilePhotoProps) {

  const { id, profileImageUrl } = userData;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);

  // Mutations
  const { mutateAsync: updateUser } = api.user.updateUser.useMutation();

  // Invalidaters
  const { invalidate: invalidateUserQuery } = api.useContext().user.findByUsername;

  const { deleteFile } = useGCloudDelete({ url: profileImageUrl || '' })

  const { isUploading } = useGCloudUpload({
    path: `user/${id}`,
    filename: 'profile-img',
    file,
    onUploadSuccess: async (url) => {
      await updateUser({ profileImageUrl: url });
      invalidateUserQuery();
      setFile(null);
      deleteFile();
    }
  })

  const theme = useTheme();

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
      <Box position='relative'>
        <Box position='relative'>
          {isUploading && (
            <CircularProgress
              sx={{
                marginRight: '1rem',
                color: 'white',
                position: 'absolute',
                top: '50%',
                left: '50%',
                translate: '-50% -50%',
                zIndex: 1,
              }} />
          )}
          <Avatar
            {...(profileImageUrl && {src: `${CDN_URL}/${profileImageUrl}`})}
            alt='profile-picture'
            sx={{
              width: 120,
              height: 120,
              border: `5px solid ${theme.palette.common.white}`,
              position: 'relative',
              [theme.breakpoints.down('md')]: {
                marginBottom: theme.spacing(4)
              }
            }}
          />
        </Box>
        {isEditable && (
          <Box
            position='absolute'
            right='0'
            bottom='0'
            sx={(theme) => ({
              [theme.breakpoints.down('md')]: {
                bottom: '1rem',
              },
            })}>
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
      </Box>
    </>
  )
}

export default EditableProfilePhoto
