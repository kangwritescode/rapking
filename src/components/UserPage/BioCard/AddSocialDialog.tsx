import { Icon } from '@iconify/react';
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { SocialPlatform } from '@prisma/client';
import React, { useRef, useState } from 'react'
import CustomUrlButton from 'src/components/CustomUrlButton';
import CustomUrlForm from './CustomUrlForm';
import { LoadingButton } from '@mui/lab';


interface AddSocialDialogProps {
  isOpen: boolean;
  onCloseHandler: () => void;
}

function AddSocialDialog({ isOpen, onCloseHandler }: AddSocialDialogProps) {

  const theme = useTheme();

  const [selectedSocial, setSelectedSocial] = useState<SocialPlatform | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = (_: any, reason: string) => {
    if (reason === 'backdropClick') return;
    setSelectedSocial(undefined);
    onCloseHandler();
  }

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle
        display="flex"
        justifyContent={selectedSocial ? "space-between" : "center"}
        alignItems="center"
        sx={{
          p: selectedSocial ? theme.spacing(3) : theme.spacing(4),
        }}
      >
        {selectedSocial && (
          <IconButton onClick={() => setSelectedSocial(undefined)}>
            <Icon icon="zondicons:arrow-left" />
          </IconButton>
        )}
        <Typography display="inline">
          Add Social Link
        </Typography>
        {selectedSocial && (
          <LoadingButton
            variant="contained"
            loading={isLoading}
            size="small"
            sx={{ borderRadius: "20px" }}
            type='submit'
            onClick={() => submitButtonRef.current?.click()}>
            Save
          </LoadingButton>
        )}
        {!selectedSocial && (
          <IconButton
            onClick={() => handleClose(undefined, "")}
            sx={{
              position: 'absolute',
              right: theme.spacing(1),
            }}
          >
            <Icon icon="ph:x" />
          </IconButton>
        )}
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          minWidth: selectedSocial ? "400px" : "300px",
        }}>
        {selectedSocial === "CUSTOM" ?
          <CustomUrlForm
            isLoadingHandler={(isLoading) => setIsLoading(isLoading)}
            isValidChangedHandler={(isValid) => setIsLoading(!isValid)}
            submitButtonRef={submitButtonRef}
            onSuccess={() => handleClose(undefined, "")}
          /> :
          <CustomUrlButton onClickHandler={() => setSelectedSocial("CUSTOM")} />}
      </DialogContent>
    </Dialog>
  )
}

export default AddSocialDialog
