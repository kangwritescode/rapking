import { Box, Button, CircularProgress, FormHelperText, StepContent, TextField } from '@mui/material'
import * as yup from 'yup'
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/utils/api'
import { useDebounce } from './utils';
import { Icon } from '@iconify/react'

// ** Icon Imports
// import Icon from 'src/@core/components/icon'

export type UsernameStepProps = {
    handleNext: () => void
}

const usernameSchema = yup.object().shape({
    username: yup
        .string()
        .required()
        .min(3)
        .max(20)
        .matches(/^(.*[a-zA-Z]){3}/, 'Must include at least three letters'),
})

function UsernameStep({ handleNext }: UsernameStepProps) {

    // state
    const [value, setValue] = React.useState<string>('');
    const [controlledIsAvailable, setControlledIsAvailable] = React.useState<boolean | undefined>(undefined);

    // queries
    const debouncedValue = useDebounce(value, 500);
    const { data, status } = api.profile.usernameIsAvailable.useQuery({ text: debouncedValue }, { enabled: debouncedValue.length > 2 })
    const profileMutation = api.profile.updateProfile.useMutation();

    const {
        control: usernameControl,
        handleSubmit: handleUsernameSubmit,
        formState: { errors: errors }
    } = useForm({
        defaultValues: { username: '' },
        resolver: yupResolver(usernameSchema)
    })

    useEffect(() => {
        if (data) {
            setControlledIsAvailable(data.isAvailable)
        }
    }, [data])

    const updateUsername = async (updatedUsername: string) => {
        try {
            const updatedProfile = await profileMutation.mutateAsync({
                username: updatedUsername
            })
            if (updatedProfile) {
                handleNext()
            }
            else {
                throw new Error('Failed to update username')
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <StepContent>
            <form key={0} onSubmit={handleUsernameSubmit(() => updateUsername(debouncedValue))}>
                <Controller
                    name='username'
                    control={usernameControl}
                    render={({ field: { value, onChange } }) => {
                        return (
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        value={value}
                                        label='Username'
                                        onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
                                            const sanitizedInput = value
                                                .replace(/ /g, '_')             // replace spaces with underscores
                                                .replace(/[^a-zA-Z0-9_]/g, '')  // remove non-alphanumeric characters
                                                .toLowerCase();                 // convert to lowercase
                                            setValue(sanitizedInput)
                                            setControlledIsAvailable(undefined)
                                            onChange(sanitizedInput)
                                        }}
                                        size='small'
                                        error={Boolean(errors.username)}
                                        aria-describedby='stepper-username'
                                        inputProps={{ maxLength: 20 }}
                                        sx={{ mr: 3 }}
                                    />
                                    {(status === 'loading' && value.length > 2 && controlledIsAvailable === undefined) ? (
                                        <CircularProgress color='secondary' size={24} />
                                    ) : undefined}
                                    {controlledIsAvailable && (
                                        <Icon color='green' icon="material-symbols:check-circle-rounded" width={24} />
                                    )}
                                    {controlledIsAvailable === false && (
                                        <Icon color='red' icon="ph:x-circle" width={24} />
                                    )}
                                </Box>
                                {errors.username && (
                                    <FormHelperText sx={{color: 'error.main' }} id='validation-basic-dob'>
                                        {errors.username.message}
                                    </FormHelperText>
                                )}
                            </>
                        )
                    }} />
                <div className='button-wrapper'>
                    <Button
                        disabled={!value || !controlledIsAvailable}
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

export default UsernameStep