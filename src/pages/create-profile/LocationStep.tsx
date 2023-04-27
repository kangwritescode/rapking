import { Autocomplete, Box, Button, Grid, StepContent, TextField, Typography } from '@mui/material'
import * as yup from 'yup'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/utils/api'
import { getLocationsResult } from 'src/server/api/routers/geoDB'

export type LocationStepProps = {
    handleNext: () => void
}



interface Option {
    label: string;
    state: string;
    city: string
}

interface FormValues {
    location: Option | null
}


function LocationStep({ handleNext }: LocationStepProps) {
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<Option[]>([]);

    // queries
    const { data: locationsData } = api.geoDB.getLocationsByZip.useQuery({ zipCode: inputValue }, { enabled: inputValue.length === 5 })

    const formSchema = yup.object().shape({
        location: yup
            .object()
            .required()
    })
    
    const {
        control: formControl,
        handleSubmit: handleUsernameSubmit,
        formState: { errors: errors, isValid }
    } = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            location: null
        }
    })

    const profileMutation = api.profile.updateProfile.useMutation();

    useEffect(() => {
        if (locationsData && locationsData.length > 0) {
            setOptions(locationsData.map((location: getLocationsResult) => ({ state: location.state, city: location.city })))
        } else {
            setOptions([])
        }
    }, [locationsData, inputValue])

    const updateProfile = async (formValues: FormValues) => {
        try {
            const updatedProfile = await profileMutation.mutateAsync({
                state: formValues.location?.state,
                city: formValues.location?.city,
                country: 'US'
            })
            if (updatedProfile) {
                handleNext()
            }
            else {
                throw new Error('Failed to update location')
            }
        } catch (error) {
            console.error(error)
        }
    }

    console.log(options)

    return (
        <StepContent>
            <form key={0} onSubmit={handleUsernameSubmit(updateProfile)}>
                <TextField name='country' value='United States' disabled sx={{ marginBottom: 4 }} />
                <Controller control={formControl} name='location' render={({ field: { onChange, value } }) => {
                    return (
                        <Autocomplete
                            options={options}
                            noOptionsText="No locations"
                            onInputChange={(_, newInputValue) => {
                                setInputValue(newInputValue);
                            }}
                            getOptionLabel={(option) => `${option.city}, ${option.state}`}
                            filterOptions={x => x}
                            renderInput={(params) => (
                                <TextField {...params} placeholder='Enter ZIP Code' />
                            )}
                            onChange={(_, newValue) => {
                                console.log(newValue)
                                onChange(newValue)
                            }}
                            value={value}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    <Grid container alignItems="center" spacing={2}>
                                        <Grid item>
                                            <Typography sx={{ display: 'inline', fontWeight: 500, fontSize: 16 }} noWrap>
                                                {`${option.city}, ${option.state}`}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        />
                    )
                }} />
                <div className='button-wrapper'>
                    <Button
                        disabled={!isValid}
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