import { Button, StepContent } from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from 'src/utils/api'
import { z } from 'zod'
import UsernameAvailabilityField from 'src/components/UsernameAvailabilityField'

export type UsernameStepProps = {
  handleNext: () => void
}

const usernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^(.*[a-zA-Z]){3}/, 'Must include at least three letters')
})


function UsernameStep({ handleNext }: UsernameStepProps) {

  // queries
  const { data: userData } = api.user.getCurrentUser.useQuery();

  // state
  const userMutation = api.user.updateUser.useMutation();
  const [usernameIsAvailable, setUsernameIsAvailable] = useState<boolean | undefined>(undefined);

  const updateUsername = async (updatedUsername: string) => {
    try {
      const updatedProfile = await userMutation.mutateAsync({
        username: updatedUsername
      })
      if (updatedProfile) {
        return handleNext()
      }
      else {
        throw new Error('Failed to update username')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const {
    control: usernameControl,
    handleSubmit: handleUsernameSubmit,
    formState: { errors: errors, isValid }
  } = useForm({
    defaultValues: { username: userData?.username || '' },
    resolver: zodResolver(usernameSchema)
  })

  return (
    <StepContent>
      <form key={0} onSubmit={handleUsernameSubmit((formValues) => updateUsername(formValues.username))}>
          <UsernameAvailabilityField
            label='Username'
            control={usernameControl}
            initialUsername={userData?.username}
            errorMessage={errors.username?.message as string}
            availabilityChangedHandler={(isAvailable: boolean | undefined) => setUsernameIsAvailable(isAvailable)}
          />
        <div className='button-wrapper'>
          <Button
            disabled={!isValid || !usernameIsAvailable}
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
