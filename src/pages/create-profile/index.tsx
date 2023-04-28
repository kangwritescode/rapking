// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import clsx from 'clsx'
import toast from 'react-hot-toast'

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import UsernameStep from './UsernameStep'
import PersonalStep from './SexAgeStep'
import LocationStep from './LocationStep'

const steps = [
    {
        title: 'Choose a username',
        subtitle: 'Pick a username for your new account. You can always change it later.',
    },
    {
        title: 'Personal Info',
        subtitle: 'Add this info to be ranked among other wordsmiths in the same categories.',
    },
    {
        title: 'Location',
        subtitle: 'Add your location, or the place you want to represent.',
    }
]

const CompleteProfilePage = () => {

    // ** States
    const [activeStep, setActiveStep] = useState<number>(1)

    // Handle Stepper
    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }
    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1)
        if (activeStep === steps.length - 1) {
            toast.success('Completed All Steps!!')
        }
    }
    const handleReset = () => {
        setActiveStep(0)
    }

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
                                    {activeStep === 1 && <PersonalStep handleBack={handleBack} handleNext={handleNext} />}
                                    {activeStep === 2 && <LocationStep handleBack={handleBack} handleNext={handleNext} />}
                                </Step>
                            )
                        })}
                    </Stepper>
                </StepperWrapper>
                {activeStep === steps.length && (
                    <Box sx={{ mt: 4 }}>
                        <Typography>All steps are completed!</Typography>
                        <Button size='small' sx={{ mt: 2 }} variant='contained' onClick={handleReset}>
                            Reset
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    )
}

export default CompleteProfilePage

import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext } from 'next';
import { appRouter } from 'src/server/api/root';
import superjson from 'superjson';
import { createTRPCContext } from 'src/server/api/trpc'

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: await createTRPCContext(context),
        transformer: superjson,
    });
    await helpers.profile.getProfile.prefetch()

    return {
        props: {
            trpcState: helpers.dehydrate(),
        }
    }
}