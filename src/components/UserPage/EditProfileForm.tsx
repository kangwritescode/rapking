import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import DateofBirthField from 'src/components/FormComponents/DateofBirthField';
import SexField from 'src/components/FormComponents/SexField';
import UsernameAvailabilityField from 'src/components/FormComponents/UsernameAvailabilityField'
import { api } from 'src/utils/api';
import { z } from 'zod';

const formSchema = z.object({
  sex: z.string(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^(.*[a-zA-Z]){3}/, 'Must include at least three letters'),
  dob: z.instanceof(dayjs as any)
    .refine(value => {
      const dateOfBirth = value;
      const now = dayjs(new Date());
      const diffInYears = now.diff(dateOfBirth, 'year');

      return diffInYears > 10 && diffInYears < 90;
    }, {
      message: 'Age should be at least 10 years old and less than 90 years old'
    })
});

interface EditProfileFormProps {
  closeDialogHandler: () => void;
}

function EditProfileForm({ closeDialogHandler }: EditProfileFormProps) {

  const router = useRouter();

  const { data: userData } = api.user.getCurrentUser.useQuery();
  const { mutate: updateUser } = api.user.updateUser.useMutation();

  // Invalidaters
  const { invalidate: invalidateUserQuery } = api.useContext().user.getCurrentUser;

  const theme = useTheme();

  const [usernameIsAvailable, setUsernameIsAvailable] = useState<boolean | undefined>(undefined);

  const {
    control,
    formState: {
      errors,
      isValid,
      isDirty
    },
    handleSubmit
  } = useForm({
    defaultValues: {
      username: userData?.username || '',
      sex: userData?.sex || '',
      dob: userData && userData.dob ? dayjs(userData.dob.toUTCString()) : ''
    },
    resolver: zodResolver(formSchema),
    mode: 'all'
  });

  const onSubmit = async ({ username, sex, dob }: {
    username: string;
    sex: string;
    dob: dayjs.Dayjs | string;
  }) => {
    updateUser({
      username,
      sex,
      dob: new Date(dob as string)
    }, {
      onSuccess: () => {
        closeDialogHandler();
        invalidateUserQuery();
      }
    })
  }

  return (
    <form onSubmit={handleSubmit((formValues) => onSubmit(formValues))}>
      <Typography
        sx={{
          mb: theme.spacing(1),
        }}>
        Username
      </Typography>
      <UsernameAvailabilityField
        control={control}
        initialUsername={userData?.username}
        sx={{
          mb: theme.spacing(2)
        }}
        errorMessage={errors.username?.message}
        availabilityChangedHandler={(isAvailable: boolean | undefined) => setUsernameIsAvailable(isAvailable)}
      />
      <Typography mt={6} mb={1}>
        Date of Birth
      </Typography>
      <DateofBirthField
        control={control}
        errorMessage={errors.dob?.message}
      />
      <Typography mt={6}>
        Sex
      </Typography>
      <SexField
        control={control}
        errorMessage={errors.sex?.message}
      />
      <Box
        display="flex"
        justifyContent={"flex-end"}
      >
        <Button
          variant="contained"
          type="submit"
          disabled={!isValid || !isDirty || !usernameIsAvailable}
        >
          Update
        </Button>
      </Box>
    </form>
  )
}

export default EditProfileForm
