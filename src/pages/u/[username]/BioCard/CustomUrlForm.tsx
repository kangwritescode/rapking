import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, TextField, useTheme } from '@mui/material'
import React, { RefObject, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import CustomUrlButton from 'src/components/CustomUrlButton'
import { api } from 'src/utils/api'
import { z } from 'zod'

const customLinkFormSchema = z.object({
  displayText: z
    .string()
    .min(1)
    .max(12),
  url: z
    .string()
    .min(10)
    .max(30)
})

type CustomLinkForm = z.infer<typeof customLinkFormSchema>;

interface CustomUrlFormProps {
  isValidChangedHandler?: (isValid: boolean) => void;
  submitButtonRef?: RefObject<HTMLButtonElement>;
  onSuccess?: () => void;
};

function CustomUrlForm({
  isValidChangedHandler,
  submitButtonRef,
  onSuccess,
}: CustomUrlFormProps) {

  const theme = useTheme();

  const { mutate } = api.socialLink.postSocialLink.useMutation();
  const { invalidate: invalidateSocialLinks } = api.useContext().socialLink.getSocialLinkByUserId;

  const createSocialLink = (values: CustomLinkForm) => {
    mutate({
      link: values.url,
      displayText: values.displayText,
      platform: "CUSTOM",
    }, {
      onSuccess: () => {
        reset();
        if (onSuccess) {
          onSuccess();
        }
        invalidateSocialLinks();
      }
    })
  };

  const {
    register,
    formState: {
      isValid,
    },
    reset,
    handleSubmit
  } = useForm({
    defaultValues: {
      displayText: "",
      url: "https://",
    },
    resolver: zodResolver(customLinkFormSchema)
  })

  useEffect(() => {
    if (isValidChangedHandler) {
      isValidChangedHandler(isValid);
    }
  }, [isValid, isValidChangedHandler])

  return (
    <>
      <CustomUrlButton sx={{ pointerEvents: "none", mb: theme.spacing(4) }} />
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        onSubmit={handleSubmit(createSocialLink)}
      >
        <TextField
          {...register('displayText')}
          size='small'
          placeholder="Display text"
          sx={{ mb: theme.spacing(3) }}
        />
        <TextField
          {...register('url')}
          size='small'
          placeholder="https://website.com"
        />
        <Button ref={submitButtonRef} type="submit" hidden />
      </Box>
    </>
  )
}

export default CustomUrlForm
