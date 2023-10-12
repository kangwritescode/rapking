import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SxProps } from '@mui/material';
import { Region, User } from '@prisma/client';
import { api } from 'src/utils/api';
import { useInView } from 'react-intersection-observer';
import { v4 } from 'uuid';

let columns: GridColDef[] = [
  {
    field: 'points',
    headerName: 'Score',
    width: 120,
    headerClassName: 'user-leaderboard-points-header',
    cellClassName: 'user-leaderboard-points-cell',
  },
  {
    field: 'username',
    headerName: 'Username',
    width: 150,
    sortable: false,
    headerClassName: 'user-leaderboard-header',
  },
  {
    field: 'location',
    headerName: 'Location',
    type: 'number',
    width: 170,
    sortable: false,
    headerClassName: 'user-leaderboard-header',
  },
  {
    field: 'region',
    headerName: 'Region',
    type: 'number',
    sortable: false,
    headerClassName: 'user-leaderboard-header',
  },
  {
    field: 'sex',
    headerName: 'Sex',
    type: 'number',
    sortable: false,
    headerClassName: 'user-leaderboard-header',
  },
];

columns = columns.map((column) => ({
  ...column,
  headerAlign: 'center',
  align: 'center',
  disableColumnMenu: true
}));

const convertUserDataToRowData = (userData: User) => {
  const { username, city, region, sex, points } = userData;

  return ({
    id: v4(),
    username: username || '',
    location: city || '',
    region: region || 'WEST',
    sex: sex ? sex === 'male' ? 'M' : 'F' : '',
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
        background: 'black',
      },
      '& .user-leaderboard-header .MuiDataGrid-columnHeaderTitle': {
        fontFamily: 'Impact',
        fontSize: '1.2rem',
      },
      '& .user-leaderboard-points-header .MuiDataGrid-columnHeaderTitle': {
        fontFamily: 'PressStart2P',
        fontSize: '1rem',
      },
      '& .user-leaderboard-points-cell .MuiDataGrid-cellContent': {
        fontFamily: 'PressStart2P',
        fontSize: '1rem',
      },
      ...sx
    }}>
      <DataGrid
        rows={rowsData}
        columns={columns}
        hideFooterPagination
        disableRowSelectionOnClick
        sx={{
          height: 700
        }}
      />
      <Box ref={ref} />
    </Box>
  );
}
