import { Button, StepContent } from '@mui/material'
import * as yup from 'yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/utils/api'
import dayjs, { Dayjs } from 'dayjs'
import DateofBirthField from 'src/components/DateofBirthField'
import SexField from 'src/components/SexField'

export type PersonalStepProps = {
  handleBack: () => void,
  handleNext: () => void
}

export type DateType = Date | null | undefined

export type SexAgeForm = {
  sex: string,
  dob: string | Dayjs
}

const formSchema = yup.object().shape({
  sex: yup
    .string()
    .required(),
  dob: yup
    .string()
    .required()
    .test('invalid-dob', 'Invalid Date of Birth', value => value !== 'Invalid Date')
    .test('invalid-age', 'Age should be at least 10 years old', function (value) {
      const dateOfBirth = new Date(value);
      const now = new Date();
      const diffInYears = now.getFullYear() - dateOfBirth.getFullYear();

      return diffInYears > 10 && diffInYears < 90;
    })
})

function PersonalStep({ handleNext, handleBack }: PersonalStepProps) {

  // queries
  const { data: profileData } = api.user.getCurrentUser.useQuery();

  // initialValues
  const initialValues: SexAgeForm = {
    sex: profileData?.sex || '',
    dob: profileData && profileData.dob ? dayjs(profileData.dob.toUTCString()) : ''
  }

  const {
    control: control,
    handleSubmit,
    formState: { errors: errors, isValid },
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(formSchema)
  })

  const profileMutation = api.user.updateUser.useMutation();

  const updateUser = async ({ sex, dob }: SexAgeForm) => {
    try {
      const updatedProfile = await profileMutation.mutateAsync({
        sex,
        dob: new Date(dob as string)
      })
      if (updatedProfile) {
        return handleNext()
      }
      throw new Error('Failed to update username')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <StepContent>
      <form key={1} onSubmit={handleSubmit((formValues) => updateUser(formValues))}>
        <DateofBirthField control={control} errorMessage={errors.dob?.message} label="Date of Birth" />
        <SexField control={control} errorMessage={errors.sex?.message} label="Sex" />
        <div className='button-wrapper'>
          <Button
            size='small'
            variant='outlined'
            color='primary'
            onClick={handleBack}>
            Back
          </Button>
          <Button
            disabled={!!errors.sex || !!errors.dob || !isValid}
            type='submit'
            size='small'
            sx={{ ml: 4 }}
            variant='contained'>
            Next
          </Button>
        </div>
      </form>

    </StepContent>
  )
}

export default PersonalStep
