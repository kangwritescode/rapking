import { Box, CardMedia, IconButton } from '@mui/material'
import React from 'react'
import { CDN_URL } from 'src/shared/constants'

interface EditableCoverArtProps {

}

function EditableCoverArt(props: EditableRapBannerProps) {
  return (

    <>
      {/* <input
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
      /> */}
      <Box
        sx={{
          position: 'relative',
        }}>

        {/* {isUploading && (
          <CircularProgress
            sx={{
              marginRight: '1rem',
              color: 'white',
              position: 'absolute',
              top: '50%',
              left: '50%',
              translate: '-50% -50%',
            }} />
        )} */}

        {/* {isEditable && (
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
        )} */}

        <CardMedia
          component='img'
          alt='rap-banner'
          image={`${CDN_URL}/default/profile-banner.jpg`}
          sx={(theme) => ({
            border: `1px solid ${theme.palette.grey[700]}`,
            height: {
              xs: 150,
              md: 250
            }
          })}
        />
      </Box>
    </>

  )
}

export default EditableCoverArt
