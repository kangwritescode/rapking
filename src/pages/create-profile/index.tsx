// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';

// ** Third Party Imports
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ** Custom Components Imports
import StepperCustomDot from '../../components/CreateProfilePage/StepperCustomDot';

// ** Styled Components
import { Box, Stack, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import StepperWrapper from 'src/@core/styles/mui/stepper';
import InviteCodeStep from 'src/components/CreateProfilePage/InviteCodeStep';
import { api } from 'src/utils/api';
import LocationStep from '../../components/CreateProfilePage/LocationStep';
import PersonalStep from '../../components/CreateProfilePage/SexAgeStep';
import UsernameStep from '../../components/CreateProfilePage/UsernameStep';

const steps = [
  {
    title: 'Invite Code',
    subtitle: 'RapKing is currently an exclusive community. You need an invite code to join.'
  },
  {
    title: 'Choose a username',
    subtitle: 'Pick a username for your new account. You can always change it later.'
  },
  {
    title: 'Personal Info',
    subtitle: 'Add this info to be ranked among other wordsmiths in the same categories.'
  },
  {
    title: 'Location',
    subtitle: 'Add your location, or the place you want to represent.'
  }
];

const CompleteProfilePage = () => {
  const { invalidate } = api.useContext().user.getProfileIsComplete;
  const router = useRouter();

  // ** States
  const [activeStep, setActiveStep] = useState<number>(0);
  const [profileIsComplete, setProfileIsComplete] = useState<boolean>(false);

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleCreateProfile = () => {
    invalidate();
    toast.success('Profile created successfully!');
    setProfileIsComplete(true);
  };

  useEffect(() => {
    if (profileIsComplete) {
      router.push(`/`);
    }
  }, [profileIsComplete, router]);

  const theme = useTheme();

  return profileIsComplete ? (
    <Box
      sx={{
        mt: '50vh',
        ml: '50vw'
      }}
    >
      Redirecting...
    </Box>
  ) : (
    <Stack
      width={{
        xs: '100%'
      }}
      height='100%'
      mx='auto'
      sx={{
        padding: `3rem ${theme.spacing(6)} 2rem`,
        transition: 'padding .25s ease-in-out',
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        }
      }}
    >
      <Card>
        <CardHeader title='Create Your Profile' />
        <CardContent>
          <StepperWrapper>
            <Stepper activeStep={activeStep} orientation='vertical'>
              {steps.map((step, index) => {
                return (
                  <Step key={index} className={clsx({ active: activeStep === index })}>
                    <StepLabel StepIconComponent={StepperCustomDot}>
                      <div className='step-label'>
                        <div>
                          <Typography className='step-title'>{step.title}</Typography>
                          <Typography className='step-subtitle'>{step.subtitle}</Typography>
                        </div>
                      </div>
                    </StepLabel>
                    {activeStep === 0 && <InviteCodeStep handleNext={handleNext} />}
                    {activeStep === 1 && (
                      <UsernameStep handleNext={handleNext} handleBack={handleBack} />
                    )}
                    {activeStep === 2 && (
                      <PersonalStep handleBack={handleBack} handleNext={handleNext} />
                    )}
                    {activeStep === 3 && (
                      <LocationStep
                        handleBack={handleBack}
                        handleCreateProfile={handleCreateProfile}
                      />
                    )}
                  </Step>
                );
              })}
            </Stepper>
          </StepperWrapper>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CompleteProfilePage;
