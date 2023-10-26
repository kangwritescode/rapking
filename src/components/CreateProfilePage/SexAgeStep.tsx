import { Button, CircularProgress, StepContent } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { api } from 'src/utils/api';
import dayjs, { Dayjs } from 'dayjs';
import DateofBirthField from 'src/components/FormComponents/DateofBirthField';
import SexField from 'src/components/FormComponents/SexField';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type PersonalStepProps = {
  handleBack: () => void;
  handleNext: () => void;
};

export type DateType = Date | null | undefined;

export type SexAgeForm = {
  sex: string;
  dob: string | Dayjs | null;
};

const formSchema = z.object({
  sex: z.string().min(1),
  dob: z.instanceof(dayjs as any).refine(
    value => {
      const dateOfBirth = value;
      const now = dayjs(new Date());
      const diffInYears = now.diff(dateOfBirth, 'year');

      return diffInYears > 10 && diffInYears < 90;
    },
    {
      message: 'Age should be at least 10 years old and less than 90 years old'
    }
  )
});

function PersonalStep({ handleNext, handleBack }: PersonalStepProps) {
  // queries
  const { data: profileData } = api.user.getCurrentUser.useQuery();

  // initialValues
  const initialValues: SexAgeForm = {
    sex: profileData?.sex || '',
    dob: profileData && profileData.dob ? dayjs(profileData.dob.toUTCString()) : null
  };

  const {
    control,
    handleSubmit,
    formState: { errors: errors, isValid }
  } = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(formSchema)
  });

  const { mutateAsync: updateProfile, isLoading } = api.user.updateUser.useMutation();

  const updateUser = async ({ sex, dob }: SexAgeForm) => {
    try {
      const updatedProfile = await updateProfile({
        sex,
        dob: new Date(dob as string)
      });
      if (updatedProfile) {
        return handleNext();
      }
      throw new Error('Failed to update username');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StepContent>
      <form key={1} onSubmit={handleSubmit(formValues => updateUser(formValues))}>
        <DateofBirthField control={control} errorMessage={errors.dob?.message} label='Date of Birth' />
        <SexField control={control} errorMessage={errors.sex?.message} label='Sex' />
        <div className='button-wrapper'>
          <Button size='small' variant='outlined' color='secondary' onClick={handleBack}>
            Back
          </Button>
          <Button
            disabled={!!errors.sex || !!errors.dob || !isValid || isLoading}
            type='submit'
            size='small'
            sx={{ ml: 4, minHeight: '1.8rem' }}
            variant='contained'
          >
            {isLoading ? <CircularProgress color='inherit' size='1.3rem' /> : 'Next'}
          </Button>
        </div>
      </form>
    </StepContent>
  );
}

export default PersonalStep;
