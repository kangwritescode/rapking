import { Icon } from '@iconify/react';
import { Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { SocialPlatform } from '@prisma/client';
import React, { useRef, useState } from 'react'
import CustomUrlButton from 'src/components/CustomUrlButton';
import CustomUrlForm from './CustomUrlForm';

interface AddSocialDialogProps {
  isOpen: boolean;
  onCloseHandler: () => void;
}

function AddSocialDialog({ isOpen, onCloseHandler }: AddSocialDialogProps) {

  const theme = useTheme();

  const [selectedSocial, setSelectedSocial] = useState<SocialPlatform | undefined>("CUSTOM");
  const [isValid, setIsValid] = useState(false);

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
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
          <Button
            disabled={!isValid}
            variant="contained"
            size="small"
            sx={{ borderRadius: "20px" }}
            type='submit'
            onClick={() => submitButtonRef.current?.click()}>
            Save
          </Button>
        )}
        {!selectedSocial && (
          <IconButton
            onClick={handleClose}
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
          width: selectedSocial ? "400px" : "300px",
        }}>
        {selectedSocial === "CUSTOM" ?
          <CustomUrlForm
            isValidChangedHandler={(isValid) => setIsValid(isValid)}
            submitButtonRef={submitButtonRef}
            onSuccess={handleClose}
          /> :
          <CustomUrlButton onClickHandler={() => setSelectedSocial("CUSTOM")} />}
      </DialogContent>
    </Dialog>
  )
}

export default AddSocialDialog
