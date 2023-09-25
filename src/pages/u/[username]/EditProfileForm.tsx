import { Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react'
import { useForm } from 'react-hook-form'
import DateofBirthField from 'src/components/DateofBirthField';
import SexField from 'src/components/SexField';
import UsernameAvailabilityField from 'src/components/UsernameAvailabilityField'
import { api } from 'src/utils/api';

function EditProfileForm() {

  const { data: userData } = api.user.getCurrentUser.useQuery();
  const theme = useTheme();

  const { control, formState: {
    errors
  } } = useForm({
    defaultValues: {
      username: userData?.username || '',
      sex: userData?.sex || '',
      dob: userData && userData.dob ? dayjs(userData.dob.toUTCString()) : ''
    }
  });

  return (
    <>
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
      />
      <Typography mt={6} mb={1}>
        Date of Birth
      </Typography>
      <DateofBirthField control={control} errorMessage={errors.dob?.message} />
      <Typography mt={6}>
        Sex
      </Typography>
      <SexField control={control} errorMessage={errors.sex?.message} />
      <Typography
        mt={6}>
        Country
      </Typography>
    </>
  )
}

export default EditProfileForm
