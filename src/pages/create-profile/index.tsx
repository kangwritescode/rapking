// ** React Imports
import { useState } from 'react';

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
import StepperWrapper from 'src/@core/styles/mui/stepper';
import { api } from 'src/utils/api';
import LocationStep from '../../components/CreateProfilePage/LocationStep';
import PersonalStep from '../../components/CreateProfilePage/SexAgeStep';
import UsernameStep from '../../components/CreateProfilePage/UsernameStep';

const steps = [
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

  // ** States
  const [activeStep, setActiveStep] = useState<number>(0);

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
  };

  return (
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
                  {activeStep === 0 && <UsernameStep handleNext={handleNext} />}
                  {activeStep === 1 && (
                    <PersonalStep handleBack={handleBack} handleNext={handleNext} />
                  )}
                  {activeStep === 2 && (
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
  );
};

export default CompleteProfilePage;
