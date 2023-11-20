import { FormControlLabel, Switch } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { RapEditorFormValues } from './RapEditor';

interface PublishedFieldProps {
  control: Control<RapEditorFormValues>;
}

function PublishedField({ control }: PublishedFieldProps) {
  return (
    <Controller
      name='published'
      control={control}
      render={({ field }) => {
        return (
          <FormControlLabel
            sx={{
              '.MuiFormControlLabel-label': {
                opacity: field.value ? 1 : 0.5
              }
            }}
            control={<Switch checked={field.value} onChange={field.onChange} />}
            label='Published'
          />
        );
      }}
    />
  );
}

export default PublishedField;
