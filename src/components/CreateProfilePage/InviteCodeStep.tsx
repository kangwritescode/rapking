import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { Alert, Button, CircularProgress, Stack, StepContent, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';
import { z } from 'zod';

export type InviteCodeStepProps = {
  handleNext: () => void;
};

const usernameSchema = z.object({
  inviteCode: z.string().min(1)
});

function InviteCodeStep({ handleNext }: InviteCodeStepProps) {
  const { data: isInWhitelist } = api.whitelist.userIsInWhitelist.useQuery();

  // state
  const { mutateAsync: verifyCode, isLoading } = api.inviteToken.verifyCode.useMutation();

  // ** Invalidators
  const { invalidate: invalidateUserIsInWhitelist } = api.useContext().whitelist.userIsInWhitelist;
  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = useForm({
    defaultValues: { inviteCode: '' },
    resolver: zodResolver(usernameSchema)
  });

  const submitHandler = async (formValues: { inviteCode: string }) => {
    const { inviteCode } = formValues;

    try {
      await verifyCode({ code: inviteCode });
      invalidateUserIsInWhitelist();
    } catch (err) {
      toast.error('Invalid invite code');
    }
  };

  return (
    <StepContent>
      <form key={0} onSubmit={handleSubmit(submitHandler)}>
        <Stack direction='row' mt='.5rem'>
          <TextField
            placeholder='Enter your invite code'
            variant='outlined'
            size='small'
            autoComplete='off'
            {...register('inviteCode')}
          />
          <Button
            disabled={!isValid}
            type='submit'
            size='small'
            variant='contained'
            sx={{ ml: '1rem' }}
          >
            Check
          </Button>
        </Stack>
        {isInWhitelist && (
          <Alert
            icon={<Icon icon='simple-line-icons:check' />}
            severity='success'
            sx={{ mt: '1rem' }}
          >
            You're in! Welcome to RapKing.
          </Alert>
        )}
        <div className='button-wrapper'>
          <Button
            disabled={!isInWhitelist}
            type='submit'
            size='small'
            variant='contained'
            sx={{ minHeight: '1.8rem' }}
            onClick={handleNext}
          >
            {isLoading ? <CircularProgress color='inherit' size='1.3rem' /> : 'Next'}
          </Button>
        </div>
      </form>
    </StepContent>
  );
}

export default InviteCodeStep;
