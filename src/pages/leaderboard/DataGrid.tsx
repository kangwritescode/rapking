import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SxProps } from '@mui/material';
import { Region } from '@prisma/client';

const columns: GridColDef[] = [
  {
    field: 'points',
    headerName: 'Points',
    sortable: false,
    filterable: false,
    hideable: false,
  },
  {
    field: 'username',
    headerName: 'Last name',
    sortable: false,
    filterable: false,
    hideable: false,
  },
  {
    field: 'location',
    headerName: 'Location',
    type: 'number',
    sortable: false,
    filterable: false,
    hideable: false,
  },
  {
    field: 'region',
    headerName: 'Region',
    type: 'number',
    sortable: false,
    filterable: false,
    hideable: false,
  },
  {
    field: 'sex',
    headerName: 'Sex',
    type: 'number',
    sortable: false,
    filterable: false,
    hideable: false,
  },
];

interface Row {
  id: string;
  username: string;
  location: string;
  region: Region;
  sex: string;
  points: number;
}

interface DataGridDemoProps {
  sx?: SxProps;
  rows: Row[]
}

export default function UserLeaderboard({ sx, rows }: DataGridDemoProps) {
  return (
    <Box sx={{
      '& .MuiDataGrid-columnHeaders': {
        background: 'unset',
      },
      ...sx
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooterPagination
        disableRowSelectionOnClick
      />
    </Box>
  );
}
