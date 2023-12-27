import { Icon } from '@iconify/react';
import { Box, InputAdornment, Popover, SxProps, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'src/shared/utils';

interface GlobalSearchProps {
  sx?: SxProps;
}

const GlobalSearch = ({ sx }: GlobalSearchProps) => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null); // Updated type to match the ref
  const searchFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedSearchText) {
      setAnchorEl(searchFieldRef.current);
    } else {
      setAnchorEl(null);
    }
  }, [debouncedSearchText]);

  const open = Boolean(anchorEl);
  const id = open ? 'global-search-popover' : undefined;

  return (
    <Box sx={sx}>
      <TextField
        ref={searchFieldRef}
        value={searchText}
        size='small'
        onChange={e => setSearchText(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon='mdi:magnify' fontSize='1.5rem' />
            </InputAdornment>
          ),
          sx: { borderRadius: '2rem' },
          placeholder: 'Search'
        }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)} // Added to handle closing of the Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Box p={2}>{/* Display search results here */}</Box>
      </Popover>
    </Box>
  );
};

export default GlobalSearch;
