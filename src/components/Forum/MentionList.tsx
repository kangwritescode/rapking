import { Box, useTheme } from '@mui/material';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export type MentionListRef = {
  onKeyDown: (props: { event: Event }) => boolean;
};

interface MentionListProps {
  items: string[];
  command: (params: { id: string }) => void;
}

const MentionList = forwardRef((props: MentionListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();

        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();

        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();

        return true;
      }

      return false;
    }
  }));

  const theme = useTheme();

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '0.5rem',
        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1)',
        color: theme.palette.text.primary,
        fontSize: '0.9rem',
        overflow: 'hidden',
        padding: '0.4rem',
        position: 'relative'
      }}
    >
      {props.items.length ? (
        props.items.map((item, index) => (
          <Box
            component='button'
            className={`${index === selectedIndex ? 'is-selected' : ''}`}
            sx={{
              background: 'transparent',
              borderRadius: '0.5rem',
              border: `1px solid transparent`,
              display: 'block',
              margin: 0,
              padding: '0.25rem 0.5rem',
              textAlign: 'left',
              color: theme.palette.text.primary,
              width: '100%',
              '&.is-selected': {
                border: `1px solid ${theme.palette.divider}`
              }
            }}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item}
          </Box>
        ))
      ) : (
        <Box
          sx={{
            background: 'transparent',
            borderRadius: '0.4rem',
            display: 'block',
            border: 'none',
            margin: 0,
            padding: '0.2rem 0.4rem',
            textAlign: 'left',
            width: '100%',
            color: theme.palette.text.primary
          }}
        >
          No result
        </Box>
      )}
    </Box>
  );
});

export default MentionList;
