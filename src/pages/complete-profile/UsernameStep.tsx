import { Box, Button, FormControl, StepContent, TextField } from '@mui/material'
import * as yup from 'yup'
import React from 'react'
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
    const { data, status } = api.profile.findByUsername.useQuery({ text: debouncedValue })

    const {
        control: usernameControl,
        handleSubmit: handleUsernameSubmit,
        formState: { errors: usernameErrors }
    } = useForm({
        defaultValues: { username: '' },
        resolver: yupResolver(usernameSchema)
    })

    const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        const spacesToUnderscore = value.replace(/ /g, '_');
        const withNoSpecialCharacters = spacesToUnderscore.replace(/[^a-zA-Z0-9_]/g, '');

        return setValue(withNoSpecialCharacters)
    }

    return (
        <StepContent>
            <form key={0} onSubmit={handleUsernameSubmit(handleNext)}>
                <FormControl>
                    <Controller
                        name='username'
                        control={usernameControl}
                        render={() => {
                            return (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        value={value}
                                        label='Username'
                                        onChange={onTextChange}
                                        size='small'
                                        error={Boolean(usernameErrors.username)}
                                        aria-describedby='stepper-username'
                                        inputProps={{ maxLength: 20 }}
                                        sx={{ mr: 3 }}
                                    />
                                    {status === 'loading' && <p>Loading...</p>}
                                    {status === 'error' && <p>Error: {data && data.username}</p>}
                                    {status === 'success' && (
                                        <p>{data && data.username}</p>
                                    )}
                                    {usernameErrors.username && (
                                        <p>{usernameErrors.username.message}</p>
                                    )}
                                </Box>
                            )
                        }} />
                </FormControl>
                <div className='button-wrapper'>
                    <Button type='submit' size='small' variant='contained'>
                        Next
                    </Button>
                </div>
            </form>

        </StepContent>
    )
}

export default UsernameStep