import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SxProps } from '@mui/material';
import { Region } from '@prisma/client';
import { api } from 'src/utils/api';
import { useInView } from 'react-intersection-observer';

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

interface RowData {
  id: string;
  username: string;
  location: string;
  region: Region;
  sex: string;
  points: number;
}

interface DataGridDemoProps {
  sx?: SxProps;
}

export default function UserLeaderboard({ sx }: DataGridDemoProps) {

  // State
  const [page, setPage] = useState(1);
  const [rowsData, setRowsData] = useState<RowData[]>([]);

  // Queries
  const { refetch } = api
    .leaderboard
    .getTopUsersByPoints
    .useQuery({ page },
      { enabled: false });

  // Hooks
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1)
    }
  }, [inView]);

  useEffect(() => {
    refetch()
      .then(({ data }) => {
        console.log({data, page});
        if (data) {
          const newRows = data.map(({ user, points }) => ({
            id: user?.id || '',
            username: user?.username || '',
            location: user?.city || '',
            region: user?.region || 'WEST',
            sex: user?.sex || '',
            points: points || 0,
          }));
          setRowsData((prev) => [...prev, ...newRows])
        }
      });
  }, [page, refetch])

  return (
    <Box sx={{
      '& .MuiDataGrid-columnHeaders': {
        background: 'unset',
      },
      ...sx
    }}>
      <DataGrid
        rows={rowsData}
        columns={columns}
        hideFooterPagination
        disableRowSelectionOnClick
      />
      <Box ref={ref} />
    </Box>
  );
}
