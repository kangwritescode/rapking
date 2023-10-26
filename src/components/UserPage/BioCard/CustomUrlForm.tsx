import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import { RefObject, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomUrlButton from 'src/components/UserPage/CustomUrlButton';
import { api } from 'src/utils/api';
import { z } from 'zod';

const customLinkFormSchema = z.object({
  displayText: z.string().min(1).max(12),
  url: z.string().url({ message: 'Invalid URL. Must start with https://' })
});

type CustomLinkForm = z.infer<typeof customLinkFormSchema>;

interface CustomUrlFormProps {
  setIsLoading: (isLoading: boolean) => void;
  isValidChangedHandler?: (isValid: boolean) => void;
  submitButtonRef?: RefObject<HTMLButtonElement>;
  onSuccess?: () => void;
}

function CustomUrlForm({ isValidChangedHandler, submitButtonRef, onSuccess, setIsLoading }: CustomUrlFormProps) {
  const theme = useTheme();

  const { mutate } = api.socialLink.postSocialLink.useMutation();

  const { invalidate: invalidateSocialLinks } = api.useContext().socialLink.getSocialLinkByUserId;

  const createSocialLink = (values: CustomLinkForm) => {
    setIsLoading(true);
    mutate(
      {
        link: values.url,
        displayText: values.displayText,
        platform: 'CUSTOM'
      },
      {
        onSuccess: () => {
          reset();
          if (onSuccess) {
            onSuccess();
          }
          setIsLoading(false);
          invalidateSocialLinks();
        },
        onError() {
          setIsLoading(false);
          toast.error('An error occurred while creating your social link.');
        }
      }
    );
  };

  const {
    register,
    formState: { isValid, errors },
    reset,
    handleSubmit
  } = useForm({
    defaultValues: {
      displayText: '',
      url: 'https://'
    },
    resolver: zodResolver(customLinkFormSchema),
    mode: 'onTouched'
  });

  useEffect(() => {
    if (isValidChangedHandler) {
      isValidChangedHandler(isValid);
    }
  }, [isValid, isValidChangedHandler]);

  return (
    <>
      <CustomUrlButton sx={{ pointerEvents: 'none', mb: theme.spacing(4) }} />
      <Box component='form' display='flex' flexDirection='column' onSubmit={handleSubmit(createSocialLink)}>
        <TextField {...register('displayText')} size='small' placeholder='Display text' error={!!errors?.displayText} />
        {errors?.displayText && (
          <Typography sx={{ mt: 1 }} variant='caption' color='error'>
            {errors?.displayText?.message}
          </Typography>
        )}
        <TextField
          sx={{ mt: 3 }}
          {...register('url')}
          size='small'
          placeholder='https://website.com'
          error={!!errors?.url}
        />
        {errors?.url && (
          <Typography sx={{ mt: 1 }} variant='caption' color='error'>
            {errors?.url?.message}
          </Typography>
        )}
        <Button ref={submitButtonRef} type='submit' hidden />
      </Box>
    </>
  );
}

export default CustomUrlForm;
