import { Autocomplete, Button, Stack, TextField, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDebounce } from 'src/shared/utils';
import { api } from 'src/utils/api';
import { Collaborator } from '../WritePage/RapEditor';

interface CollaboratorsInterfaceProps {
  onChange: (value: Array<Collaborator>) => void;
  value?: Array<Collaborator>;
}

function CollaboratorsInterface({ onChange, value }: CollaboratorsInterfaceProps) {
  const [textValue, setTextValue] = useState('');
  const debouncedSearchText = useDebounce(textValue, 400);
  const [autoCompleteValue, setAutoCompleteValue] = useState<Collaborator | null>();

  const ref = useRef<HTMLInputElement | null>(null);

  const { data: searchResults } = api.user.searchUserByUsername.useQuery({
    text: debouncedSearchText,
    limit: 3,
    excludeSelf: true
  });

  const formattedSearchResults =
    searchResults?.map(user => ({
      label: user.username,
      value: {
        username: user.username,
        id: user.id
      } as Collaborator
    })) || [];

  const addButtonClickHandler = () => {
    if (value?.find(collaborator => collaborator.id === autoCompleteValue?.id)) {
      toast.error('You have already added this collaborator');

      return;
    }

    if (autoCompleteValue) {
      onChange([...(value || []), autoCompleteValue]);
      setTextValue('');
      setAutoCompleteValue(null);
      if (ref.current) {
        ref.current.value = '';
      }
    }
  };

  const removeClickHandler = (id: string) => {
    onChange(value?.filter(collaborator => collaborator.id !== id) || []);
  };

  return (
    <Stack>
      <Typography variant='body1' sx={{ mb: '0.5rem' }}>
        Collaborators
      </Typography>
      <Typography variant='caption' sx={{ mb: '1rem' }}>
        Adding collaborators without consent may result in a suspension or ban.
      </Typography>
      <Stack direction='row' spacing={2}>
        <Autocomplete
          disablePortal
          options={formattedSearchResults}
          freeSolo
          onChange={(_, value) => {
            if (typeof value === 'object' && value) {
              setAutoCompleteValue(value.value);
            }
          }}
          sx={{
            flexGrow: 1
          }}
          renderInput={params => (
            <TextField
              {...params}
              placeholder='RapKing Username'
              size='small'
              onChange={event => {
                setTextValue(event.target.value);
              }}
              value={textValue}
              className='collaborators-autocomplete-textfield'
              sx={{
                flexGrow: 1
              }}
              ref={ref}
            />
          )}
        />
        <Button
          disabled={!Boolean(autoCompleteValue)}
          variant='contained'
          color='primary'
          onClick={addButtonClickHandler}
        >
          Add
        </Button>
      </Stack>
      <ul>
        {value?.map(collaborator => (
          <CollaboratorLi
            key={collaborator.id}
            collaborator={collaborator}
            removeClickHandler={removeClickHandler}
          />
        ))}
      </ul>
    </Stack>
  );
}

export default CollaboratorsInterface;

function CollaboratorLi({
  collaborator,
  removeClickHandler
}: {
  collaborator: Collaborator;
  removeClickHandler: (id: string) => void;
}) {
  const theme = useTheme();

  return (
    <li key={collaborator.id}>
      <Typography variant='body1'>
        <Link
          href={`/u/${collaborator.username}`}
          style={{
            textDecoration: 'none',
            color: theme.palette.secondary.main
          }}
        >
          {collaborator.username}
        </Link>
        &nbsp;{' '}
        <Button
          onClick={() => removeClickHandler(collaborator.id)}
          variant='text'
          size='small'
          sx={{ px: 0, color: theme.palette.error.dark, textTransform: 'none' }}
        >
          <span
            style={{
              color: theme.palette.text.secondary
            }}
          >
            (
          </span>
          Remove
          <span
            style={{
              color: theme.palette.text.secondary
            }}
          >
            )
          </span>
        </Button>
      </Typography>
    </li>
  );
}
