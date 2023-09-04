import { Box, Divider, List, ListItem, ListItemButton, Typography, useTheme } from '@mui/material';
import { Rap } from '@prisma/client'
import React from 'react'

interface ExistingRapsListProps {
  rapsData?: Rap[];
}

function ExistingRapsList({ rapsData }: ExistingRapsListProps) {

  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(4),
        minWidth: '16rem',
        background: theme.palette.background.paper
      }}
    >
      <Typography fontWeight={300} pb={1}>
        Existing Raps
      </Typography>
      <Divider />
      <List>
        {rapsData?.map(({ id, title, dateCreated }) => (
          <ListItem key={id} disablePadding>
            <ListItemButton
              sx={{
                padding: theme.spacing(0),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'baseline',
                margin: theme.spacing(1),
              }}
            >
              <Box fontSize={12}>
                {dateCreated.toLocaleDateString()}
              </Box>
              <Typography fontSize={12}>
                {title}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default ExistingRapsList
