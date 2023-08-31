import { Box, Button, CardMedia, CircularProgress } from '@mui/material'
import { Rap } from '@prisma/client';
import React, { useRef, useState } from 'react'
import { CDN_URL } from 'src/shared/constants'
import { useGCloudDelete } from 'src/shared/useGCloudDelete';
import { useGCloudUpload } from 'src/shared/useGCloudUpload';
import { api } from 'src/utils/api';

interface EditableCoverArtProps {
  isEditable?: boolean;
  rapData: Rap;
}

function EditableCoverArt({ isEditable, rapData }: EditableCoverArtProps) {

  const { id, coverArtUrl } = rapData;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);

  // Mutations
  const { mutateAsync: updateRap } = api.rap.updateRap.useMutation();

  // Invalidaters
  const { invalidate: invalidateRapQuery } = api.useContext().rap.getRap;

  const { deleteFile } = useGCloudDelete({ url: coverArtUrl || '' })

  const { isUploading } = useGCloudUpload({
    path: `rap/${id}`,
    filename: 'cover-art',
    file,
    onUploadSuccess: async (url) => {
      await updateRap({ id, coverArtUrl: url });
      invalidateRapQuery();
      setFile(null);
      deleteFile();
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
            bottom='1rem'
            zIndex={1}>
            <Button
              onClick={() => fileInputRef?.current?.click()}
              sx={(theme) => ({
                background: theme.palette.background.paper,
                borderRadius: '10rem',
                color: theme.palette.text.primary,
                opacity: 0.6,
                ':hover': {
                  background: theme.palette.background.paper,
                  opacity: 1
                }
              })}
            >
              Update Cover
            </Button>
          </Box>
        )}

        <Box>
          <CardMedia
            component='img'
            alt='rap-cover-art'
            image={
              coverArtUrl ?
                `${CDN_URL}/${coverArtUrl}` :
                `${CDN_URL}/default/cover-art.jpg`
            }
            sx={(theme) => ({
              border: `1px solid ${theme.palette.grey[700]}`,
              height: {
                xs: 150,
                md: 200
              }
            })}
          />
          <Box
            top={0}
            position='absolute'
            height='100%'
            width='100%'
            bgcolor='black'
            sx={{
              opacity: 0.2,
            }} />
        </Box>
      </Box>
    </>

  )
}

export default EditableCoverArt
