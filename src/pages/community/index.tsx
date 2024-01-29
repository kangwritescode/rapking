import { Box, Tooltip } from '@mui/material';
import { useState } from 'react';

function Community() {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleUsernameClick = async () => {
    try {
      await navigator.clipboard.writeText('ahhjushi');
      setTooltipOpen(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  return (
    <Box
      sx={{
        width: {
          xs: '100%',
          md: '44rem'
        },
        margin: 'auto',
        mt: '2rem',
        fontSize: '1.5rem'
      }}
    >
      <p>
        Yo. RapKing is currently a private community. We're looking for people who love writing
        raps, reading other people's raps, and contributing to making a dope community.
      </p>
      <p>
        If you're interested in joining, DM me on Discord:{' '}
        <b>
          <Tooltip open={tooltipOpen} title='Saved to clipboard' onClose={handleTooltipClose}>
            <Box
              component='span'
              sx={{
                cursor: 'pointer',
                color: '#7289da',
                ':hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={handleUsernameClick}
            >
              ahhjushi
            </Box>
          </Tooltip>
        </b>
      </p>
    </Box>
  );
}

export default Community;
