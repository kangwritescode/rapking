import { Autocomplete, Box, Button, StepContent, TextField } from '@mui/material'
import * as yup from 'yup'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/utils/api'
import { getLocationsResult } from 'src/server/api/routers/geoDB'

export type LocationStepProps = {
  handleBack: () => void,
  handleCreateProfile: () => void
}

interface Option {
  label: string;
  state: string;
  city: string
}

interface FormValues {
  location: Option | null,
  country: string
}

function LocationStep({ handleBack, handleCreateProfile }: LocationStepProps) {
  // state
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<Option[]>([]);

  // queries
  const { data: locationsData } = api.geoDB.getLocationsByZip.useQuery({ zipCode: inputValue }, { enabled: inputValue.length === 5 })
  const { data: userData } = api.user.getUser.useQuery();
  const profileMutation = api.user.updateUser.useMutation();

  // initial values
  const initialLocation: Option | null = userData?.state && userData?.city ?
    { state: userData?.state, city: userData?.city, label: `${userData?.city}, ${userData?.state}` } : null

  useEffect(() => {
    if (locationsData && locationsData.length > 0) {
      setOptions(locationsData.map((location: getLocationsResult) => ({ state: location.state, city: location.city })))
    } else {
      setOptions([])
    }
  }, [locationsData, inputValue])

  const updateUser = async (formValues: FormValues) => {
    try {
      const updatedProfile = await profileMutation.mutateAsync({
        state: formValues.location?.state,
        city: formValues.location?.city,
        country: formValues.country
      })

      // on successful update
      if (updatedProfile) {
        handleCreateProfile()
      }
      else {
        throw new Error('Failed to update location')
      }
    } catch (error) {
      console.error(error)
    }
  }

  // form schema
  const formSchema = yup.object().shape({
    location: yup
      .object()
      .required(),
    country: yup
      .string()
      .required()
  })

  // form control
  const {
    control: formControl,
    handleSubmit: handleUsernameSubmit,
    formState: { isValid }
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      location: initialLocation,
      country: 'United States'
    }
  })

  return (
    <StepContent>
      <form key={0} onSubmit={handleUsernameSubmit(updateUser)}>
        <Controller
          control={formControl}
          name='country'
          render={({ field: { onChange, value } }) => (
            <TextField
              disabled
              sx={{ marginBottom: 4, width: '100%' }}
              onChange={onChange}
              size='small'
              value={value} />
          )}
        />
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
                <TextField {...params} sx={{ width: '100%' }} placeholder='Enter ZIP Code' size='small' />
              )}
              onChange={(_, newValue) => onChange(newValue)}
              value={value}
              renderOption={(props, option) => (
                <Box component="li" {...props} tabIndex={0}>
                  <span>{`${option.city}, ${option.state}`}</span>
                </Box>
              )}
            />
          )
        }} />
        <div className='button-wrapper'>
          <Button
            size='small'
            variant='outlined'
            color='primary'
            onClick={handleBack}>
            Back
          </Button>
          <Button
            disabled={!isValid}
            type='submit'
            sx={{ ml: 4 }}
            size='small'
            variant='contained'>
            Complete Profile
          </Button>
        </div>
      </form>
    </StepContent>
  )
}

export default LocationStep
