import { Icon } from '@iconify/react';
import { Box, IconButton, Menu, MenuItem, SxProps, Typography } from '@mui/material';
import { Rap, ReportedEntity, User } from '@prisma/client';
import React, { useState } from 'react';
import ReportDialog from '../ReportDialog';

interface RapBarMoreButtonProps {
  sx?: SxProps;
  rapData?:
    | (Rap & {
        user?: Partial<User>;
      })
    | null;
}

const RapBarMoreButton = ({ sx, rapData }: RapBarMoreButtonProps) => {
  const [reportDialogIsOpen, setReportDialogIsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReport = () => {
    setReportDialogIsOpen(true);
    handleClose();
  };

  return (
    <>
      <ReportDialog
        reportedEntity={ReportedEntity.RAP}
        isOpen={reportDialogIsOpen}
        handleClose={() => setReportDialogIsOpen(false)}
        rapData={rapData}
      />
      <Box sx={sx}>
        <IconButton
          aria-label='more'
          id='long-button'
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleClick}
        >
          <Icon icon='mdi:dots-horizontal' />
        </IconButton>
        <Menu
          id='long-menu'
          MenuListProps={{
            'aria-labelledby': 'long-button'
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: '20ch'
            }
          }}
        >
          <MenuItem>
            <Typography variant='body1' color='error' onClick={handleReport}>
              Report rap...
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

export default RapBarMoreButton;
