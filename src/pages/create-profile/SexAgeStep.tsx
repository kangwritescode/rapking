import { Button, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, Stack, StepContent } from '@mui/material'
import * as yup from 'yup'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/utils/api'
import { DateField } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'

// ** Icon Imports
// import { Icon } from '@iconify/react'

export type PersonalStepProps = {
  handleBack: () => void,
  handleNext: () => void
}

export type DateType = Date | null | undefined
type FormValues = {
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
  const initialValues: FormValues = {
    sex: profileData?.sex || '',
    dob: profileData && profileData.dob ? dayjs(profileData.dob.toUTCString()) : ''
  }

  const {
    control: control,
    handleSubmit: handleUsernameSubmit,
    formState: { errors: errors, isValid },
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(formSchema)
  })

  const profileMutation = api.user.updateUser.useMutation();

  const updateUser = async ({ sex, dob }: FormValues) => {
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
      <form key={1} onSubmit={handleUsernameSubmit((formValues) => updateUser(formValues))}>
        <Controller
          name='dob'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Stack marginBottom={3}>
              <FormLabel sx={{ marginBottom: 1 }}>Date of Birth</FormLabel>
              <DateField format="MM-DD-YYYY" value={value} onChange={onChange} size='small' />
            </Stack>
          )}
        />
        {errors.dob && (
          <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-dob'>
            {errors.dob.message}
          </FormHelperText>
        )}
        <Controller
          name="sex"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Stack marginTop={2}>
              <FormLabel sx={{ marginBottom: -1 }}>Sex</FormLabel>
              <RadioGroup
                row
                aria-label="sex"
                {...field}
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
              </RadioGroup>
            </Stack>
          )}
        />
        {errors.sex && (
          <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-dob'>
            {errors.sex.message}
          </FormHelperText>
        )}
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
