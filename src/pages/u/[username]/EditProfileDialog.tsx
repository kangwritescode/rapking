import { Dialog, DialogContent, DialogTitle, Divider } from '@mui/material'
import React from 'react'
import EditProfileForm from './EditProfileForm'

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
      <DialogContent sx={{ minWidth: "400px" }}>
        <EditProfileForm />
      </DialogContent>
    </Dialog >
  )
}

export default EditProfileDialog
