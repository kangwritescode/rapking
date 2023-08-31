import { Icon } from '@iconify/react';
import { Box, CircularProgress, IconButton, styled } from '@mui/material'
import { User } from '@prisma/client';
import React, { useRef, useState } from 'react'
import { CDN_URL } from 'src/shared/constants'
import { useGCloudUpload } from 'src/shared/useGCloudUpload';
import { api } from 'src/utils/api';

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '100px',
  border: `5px solid ${theme.palette.common.white}`,
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

interface EditableProfilePhotoProps {
  userData: User;
  isEditable?: boolean;
}

const DEFAULT_PROFILE_IMAGE_URL = '/default/profile-male-default.jpg';

function EditableProfilePhoto({ userData, isEditable }: EditableProfilePhotoProps) {

  const { id, profileImageUrl } = userData;

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
    namePrefix: 'profile-img',
    currFileUrl: profileImageUrl,
    file,
    onUploadSuccess: async (url) => {
      await updateUser({ profileImageUrl: url });
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
          <ProfilePicture
            src={`${CDN_URL}/${profileImageUrl}` || CDN_URL + DEFAULT_PROFILE_IMAGE_URL}
            alt='profile-picture'
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
