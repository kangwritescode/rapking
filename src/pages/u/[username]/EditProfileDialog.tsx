import { Dialog, DialogContent, DialogContentText, DialogTitle, Divider } from '@mui/material'
import React from 'react'

interface EditProfileDialogProps {
  isOpen: boolean,
  handleClose: () => void
}

function EditProfileDialog({ isOpen, handleClose }: EditProfileDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
    >
      <DialogTitle
        display="flex"
        justifyContent="center">
        Edit Profile
      </DialogTitle>
      <Divider />
      <DialogContent
        sx={{
          minWidth: "400px"
        }}>
        <DialogContentText id="alert-dialog-description">
          Content
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileDialog
