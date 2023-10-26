import { Alert, Autocomplete, Box, Button, CircularProgress, StepContent, TextField } from '@mui/material';
import * as yup from 'yup';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from 'src/utils/api';
import { getLocationsResult } from 'src/server/api/routers/geoDB';
import toast from 'react-hot-toast';

export type LocationStepProps = {
  handleBack: () => void;
  handleCreateProfile: () => void;
};

interface Option {
  label: string;
  state: string;
  city: string;
}

interface FormValues {
  location: Option | null;
  country: string;
}

function LocationStep({ handleBack, handleCreateProfile }: LocationStepProps) {
  // state
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Option[]>([]);

  // queries
  const { data: locationsData } = api.geoDB.getLocationsByZip.useQuery(
    { zipCode: inputValue },
    { enabled: inputValue.length === 5 }
  );
  const { data: userData } = api.user.getCurrentUser.useQuery();
  const { mutateAsync: updateUser, isLoading } = api.user.updateUser.useMutation();

  // initial values
  const initialLocation: Option | null =
    userData?.state && userData?.city
      ? { state: userData?.state, city: userData?.city, label: `${userData?.city}, ${userData?.state}` }
      : null;

  useEffect(() => {
    if (locationsData && locationsData.length > 0) {
      setOptions(locationsData.map((location: getLocationsResult) => ({ state: location.state, city: location.city })));
    } else {
      setOptions([]);
    }
  }, [locationsData, inputValue]);

  const updateLocation = async (formValues: FormValues) => {
    try {
      const updatedProfile = await updateUser({
        state: formValues.location?.state,
        city: formValues.location?.city,
        country: formValues.country
      });
      if (updatedProfile) {
        handleCreateProfile();
      } else {
        toast.error('Failed to update location');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // form schema
  const formSchema = yup.object().shape({
    location: yup.object().required(),
    country: yup.string().required()
  });

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
  });

  return (
    <StepContent>
      <form key={0} onSubmit={handleUsernameSubmit(updateLocation)}>
        <Controller
          control={formControl}
          name='country'
          render={({ field: { onChange, value } }) => (
            <TextField
              disabled
              sx={{ marginBottom: 4, width: '100%' }}
              onChange={onChange}
              size='small'
              value={value}
            />
          )}
        />
        <Controller
          control={formControl}
          name='location'
          render={({ field: { onChange, value } }) => {
            return (
              <Autocomplete
                options={options}
                noOptionsText='No locations'
                onInputChange={(_, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                getOptionLabel={option => `${option.city}, ${option.state}`}
                filterOptions={x => x}
                renderInput={params => (
                  <TextField {...params} sx={{ width: '100%' }} placeholder='Enter ZIP Code' size='small' />
                )}
                isOptionEqualToValue={(option, value) => option.city === value.city}
                onChange={(_, newValue) => onChange(newValue)}
                value={value}
                renderOption={(props, option) => (
                  <Box component='li' {...props} tabIndex={0}>
                    <span>{`${option.city}, ${option.state}`}</span>
                  </Box>
                )}
              />
            );
          }}
        />
        <Alert sx={{ mt: 3 }} severity='error'>
          You can not change your location after creating your profile.
        </Alert>
        <div className='button-wrapper'>
          <Button size='small' variant='outlined' color='secondary' onClick={handleBack}>
            Back
          </Button>
          <Button
            disabled={!isValid || isLoading}
            type='submit'
            sx={{ ml: 4, minHeight: '1.8rem', minWidth: '9.7rem' }}
            size='small'
            variant='contained'
          >
            {isLoading ? <CircularProgress color='inherit' size='1.3rem' /> : 'Complete Profile'}
          </Button>
        </div>
      </form>
    </StepContent>
  );
}

export default LocationStep;
