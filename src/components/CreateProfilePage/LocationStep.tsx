import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  CircularProgress,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  StepContent
} from '@mui/material';
import { Country } from '@prisma/client';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import z from 'zod';

const englishSpeakingCountries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'IE', name: 'Ireland' }
];

export type LocationStepProps = {
  handleBack: () => void;
  handleCreateProfile: () => void;
};

interface FormValues {
  country: Country;
}

function LocationStep({ handleBack, handleCreateProfile }: LocationStepProps) {
  const { mutateAsync: updateUser, isLoading } = api.user.updateUser.useMutation();

  const updateLocation = async (formValues: FormValues) => {
    try {
      const updatedProfile = await updateUser({
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
  const formSchema = z.object({ country: z.string() });

  // form control
  const {
    control: formControl,
    handleSubmit: handleUsernameSubmit,
    formState: { isValid }
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: Country.US
    }
  });

  return (
    <StepContent>
      <form key={0} onSubmit={handleUsernameSubmit(updateLocation)}>
        <Stack>
          <FormLabel
            sx={{
              mb: 1
            }}
          >
            Country
          </FormLabel>
          <Controller
            control={formControl}
            name='country'
            render={({ field: { onChange, value } }) => (
              <Select variant='outlined' value={value} onChange={onChange}>
                {englishSpeakingCountries.map(country => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </Stack>

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
