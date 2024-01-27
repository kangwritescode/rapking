import { Icon } from '@iconify/react';
import {
  Avatar,
  Box,
  CardMedia,
  Divider,
  InputAdornment,
  Stack,
  SxProps,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BUCKET_URL } from 'src/shared/constants';
import { useDebounce } from 'src/shared/utils';
import { api } from 'src/utils/api';

interface GlobalSearchProps {
  sx?: SxProps;
}

const GlobalSearch = ({ sx }: GlobalSearchProps) => {
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const [showPopover, setShowPopover] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);

  const { data: usersData } = api.user.searchUserByUsername.useQuery({
    text: debouncedSearchText,
    limit: 3
  });
  const { data: rapsData } = api.rap.searchRapsByTitle.useQuery({
    text: debouncedSearchText,
    limit: 3
  });

  useEffect(() => {
    if (debouncedSearchText) {
      setShowPopover(true);
    }
  }, [debouncedSearchText]);

  useEffect(() => {
    if (!searchText) {
      setShowPopover(false);
    }
  }, [searchText]);

  const theme = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popoverRef]);

  return (
    <Box
      sx={{
        position: 'relative',
        ...sx
      }}
    >
      <TextField
        value={searchText}
        size='small'
        onChange={e => setSearchText(e.target.value)}
        autoComplete='off'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon icon='mdi:magnify' fontSize='1.5rem' />
            </InputAdornment>
          ),

          sx: { borderRadius: '2rem', height: '2.25rem', fontSize: '0.75rem' },
          placeholder: 'Search'
        }}
        spellCheck={false}
      />
      {showPopover && (
        <Stack
          sx={{
            width: '16rem',
            p: '1.5rem 1.25rem 1rem',
            position: 'absolute',
            top: '3rem',
            background: theme.palette.background.paper,
            borderRadius: '.5rem'
          }}
          ref={popoverRef}
        >
          <Typography variant='caption' textTransform='uppercase'>
            Users
          </Typography>
          <Divider
            sx={{
              mb: '.75rem'
            }}
          />
          {usersData?.length ? (
            usersData.map(user => (
              <Link
                key={user.id}
                href={`/u/${user.username}`}
                style={{ textDecoration: 'unset' }}
                onClick={() => {
                  setShowPopover(false);
                  setSearchText('');
                }}
              >
                <Stack direction='row' alignItems='center' mb='.75rem'>
                  <Avatar
                    src={`${BUCKET_URL}/${user.profileImageUrl}`}
                    sx={{ mr: 2, height: '1.75rem', width: '1.75rem' }}
                  />
                  <Typography component='span'>{user.username}</Typography>
                </Stack>
              </Link>
            ))
          ) : (
            <Typography variant='caption' mb={2}>
              No users found
            </Typography>
          )}
          <Typography variant='caption' textTransform='uppercase' mt='.25rem'>
            Raps
          </Typography>
          <Divider
            sx={{
              mb: '.75rem'
            }}
          />
          {rapsData?.length ? (
            rapsData.map(rap => (
              <Link
                key={rap.id}
                href={`/rap/${rap.id}`}
                style={{ textDecoration: 'unset' }}
                onClick={() => {
                  setShowPopover(false);
                  setSearchText('');
                }}
              >
                <Stack key={rap.id} direction='row' alignItems='center' mb='.75rem'>
                  <CardMedia
                    component='img'
                    src={`${BUCKET_URL}/${rap.coverArtUrl}`}
                    sx={{ mr: 2, height: '1.75rem', width: '1.75rem', borderRadius: '2rem' }}
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevents looping
                      target.src = `${BUCKET_URL}/default/cover-art.jpg`; // Fallback
                    }}
                  />
                  <Typography>{rap.title}</Typography>
                </Stack>
              </Link>
            ))
          ) : (
            <Typography variant='caption' mb={2}>
              No raps found
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default GlobalSearch;
