import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SxProps } from '@mui/material';
import { Region, User } from '@prisma/client';
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

const convertUserDataToRowData = (userData: User) => {
  const { username, id, city, region, sex, points } = userData;

  return ({
    id: id || '',
    username: username || '',
    location: city || '',
    region: region || 'WEST',
    sex: sex || '',
    points: points || 0,
  })
}

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
  const [page, setPage] = useState(0);
  const [rowsData, setRowsData] = useState<RowData[]>([]);

  // Queries
  const { refetch } = api.leaderboard.getTopUsersByPoints.useQuery({ page },
    { enabled: false });

  // Hooks
  const { ref, inView } = useInView();

  // Handlers
  const loadNextPage = useCallback(async () => {
    try {
      const { data: usersData } = await refetch();
      if (usersData) {
        const newRowsData = usersData.map(convertUserDataToRowData);
        setRowsData((prev) => [...prev, ...newRowsData])
        setPage((prev) => prev + 1);
      }
    }
    catch (err) {
      console.log(err);
    }
  }, [refetch])

  // Effects
  useEffect(() => {
    if (inView) {
      loadNextPage();
    }
  }, [inView, refetch, setPage, loadNextPage]);


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
