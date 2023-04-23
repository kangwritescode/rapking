import { Autocomplete, Button, FormHelperText, StepContent, TextField } from '@mui/material'
import * as yup from 'yup'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/utils/api'

export type LocationStepProps = {
    handleNext: () => void
}

const formSchema = yup.object().shape({
    country: yup
        .string()
        .required()
})

function LocationStep({ handleNext }: LocationStepProps) {

    // queries
    const profileMutation = api.profile.updateProfile.useMutation();
    const { data: locationsData } = api.geoDB.getLocationsByZip.useQuery({ zipCode: '94612' })

    const {
        control: countryControl,
        handleSubmit: handleUsernameSubmit,
        formState: { errors: errors }
    } = useForm({
        defaultValues: { country: '' },
        resolver: yupResolver(formSchema)
    })


    const updateProfile = async (country: string) => {
        try {
            const updatedProfile = await profileMutation.mutateAsync({
                country
            })
            if (updatedProfile) {
                handleNext()
            }
            else {
                throw new Error('Failed to update country')
            }
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <StepContent>
            <form key={0} onSubmit={handleUsernameSubmit((formValues) => updateProfile(formValues.country))}>
                <Controller
                    control={countryControl}
                    name='country'
                    render={({ field }) => (
                        <Autocomplete
                            options={[{ label: 'United States' }]}
                            getOptionLabel={(option) => option.label}
                            renderInput={(params) => (
                                <TextField {...params} label="Zip Code" variant="outlined" />
                            )}
                            onInputChange={() => undefined}
                            onChange={(event, value) => field.onChange(value)}
                            value={field.value}
                        />
                    )}
                />
                {locationsData ? JSON.stringify(locationsData) : undefined}
                {errors.country && (
                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-dob'>
                        {errors.country.message}
                    </FormHelperText>
                )}
                <div className='button-wrapper'>
                    <Button
                        type='submit'
                        size='small'
                        variant='contained'>
                        Next
                    </Button>
                </div>
            </form>
        </StepContent>
    )
}

export default LocationStep