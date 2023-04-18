import { Box, Button, FormControl, StepContent, TextField } from '@mui/material'
import * as yup from 'yup'
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { api } from 'src/utils/api'
import { useDebounce } from './utils';

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

    const [value, setValue] = React.useState<string>('');
    const debouncedValue = useDebounce(value, 500);
    const [controlledIsAvailable, setControlledIsAvailable] = React.useState<boolean>(false);
    const { data, status } = api.profile.usernameIsAvailable.useQuery({ text: debouncedValue }, { enabled: debouncedValue.length > 2 })

    const {
        control: usernameControl,
        handleSubmit: handleUsernameSubmit,
        formState: { errors: usernameErrors }
    } = useForm({
        defaultValues: { username: '' },
        resolver: yupResolver(usernameSchema)
    })

    useEffect(() => {
        if (data) {
            setControlledIsAvailable(data.isAvailable)
        }
    }, [data])

    return (
        <StepContent>
            <form key={0} onSubmit={handleUsernameSubmit(handleNext)}>
                <FormControl>
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
                                                setControlledIsAvailable(false)
                                                onChange(sanitizedInput)
                                            }}
                                            size='small'
                                            error={Boolean(usernameErrors.username)}
                                            aria-describedby='stepper-username'
                                            inputProps={{ maxLength: 20 }}
                                            sx={{ mr: 3 }}
                                        />
                                        {(status === 'loading' && value.length > 2) ? <span>Loading...</span> : undefined}
                                        {status === 'error' && <span>Error: {data?.isAvailable}</span>}
                                        {status === 'success' && (
                                            <span>{data.isAvailable}</span>
                                        )}
                                    </Box>
                                    {usernameErrors.username && (
                                        <Box sx={{ color: 'error.main' }}>
                                            <span>{usernameErrors.username.message}</span>
                                        </Box>
                                    )}
                                </>
                            )
                        }} />
                </FormControl>
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