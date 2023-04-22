import { Button, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, Stack, StepContent } from '@mui/material'
import * as yup from 'yup'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/utils/api'
import { DatePicker } from '@mui/x-date-pickers'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'

export type PersonalStepProps = {
    handleBack: () => void,
    handleNext: () => void
}

export type DateType = Date | null | undefined

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

    const {
        control: control,
        handleSubmit: handleUsernameSubmit,
        formState: { errors: errors, isValid }
    } = useForm({
        defaultValues: { sex: 'male', dob: '' },
        resolver: yupResolver(formSchema)
    })

    const profileMutation = api.profile.updateProfile.useMutation();

    const updateProfile = async (sex: string, dob: string) => {
        try {
            const updatedProfile = await profileMutation.mutateAsync({
                sex,
                dob: new Date(dob)
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
            <form key={1} onSubmit={handleUsernameSubmit((formValues) => updateProfile(formValues.sex, formValues.dob))}>
                <Controller
                    name='dob'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                        <Stack marginBottom={3}>
                            <FormLabel sx={{ marginBottom: 1 }}>Date of Birth</FormLabel>
                            <DatePicker format="MM-DD-YYYY" value={value} onChange={onChange} />
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
                                onChange={(e) => field.onChange(e.target.value)}
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