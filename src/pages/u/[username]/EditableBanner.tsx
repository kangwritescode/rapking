import { Icon } from '@iconify/react';
import { Box, CardMedia, CircularProgress, IconButton } from '@mui/material'
import { User } from '@prisma/client';
import { set } from 'nprogress';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast';

// import { toast } from 'react-hot-toast';
import { uploadFile } from 'src/gcloud/clientMethods';
import { bucketPATH } from 'src/shared/constants';
import { api } from 'src/utils/api';

interface EditableBannerProps {
  isEditable?: boolean;
  userData: User;
}

function EditableBanner({ isEditable = true, userData }: EditableBannerProps) {

  const { id, bannerVersion } = userData;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // File upload
  const fileExtension = file?.name.split('.').pop();
  const nextBannerVersion = bannerVersion + 1;
  const newFileName = `users/${id}/banner-${nextBannerVersion}.${fileExtension}`;

  // Queries
  const { data: presignedUrl } = api.gcloud.generatePresignedUrl.useQuery({ fileName: newFileName }, {
    enabled: !!file
  });

  // Mutations
  const { mutateAsync: updateUser } = api.user.updateUser.useMutation();

  // Invalidaters
  const { invalidate: invalidateUser } = api.useContext().user.findByUsername;

  // Uploads file to GCloud when presignedUrl is generated and file is selected
  useEffect(() => {
    if (presignedUrl && file && nextBannerVersion) {
      const uploadBanner = async () => {
        setIsUploading(true);
        try {
          const { status } = await uploadFile(presignedUrl, file);
          if (status === 200) {
            await updateUser({ bannerVersion: nextBannerVersion });
            setFile(null);
            invalidateUser();
            toast.success('Updated Banner!')
          }
          setIsUploading(false);
        } catch (error) {
          setIsUploading(false);
        }
      }
      uploadBanner()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presignedUrl, file, nextBannerVersion])

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
            <Icon icon='mdi:camera-plus-outline'/>
          </IconButton>
        </Box>

        <CardMedia
          component='img'
          alt='profile-header'
          image={bannerVersion ?
            `${bucketPATH}/users/${id}/banner-${bannerVersion}.jpg` :
            `${bucketPATH}/default/profile-banner.jpg`}
          sx={{
            height: { xs: 150, md: 250 }
          }}
        />
      </Box>
    </>
  )
}

export default EditableBanner
