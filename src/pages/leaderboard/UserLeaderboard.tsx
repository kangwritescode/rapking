import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SxProps } from '@mui/material';
import { Region, User } from '@prisma/client';
import { api } from 'src/utils/api';
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

const PAGE_SIZE = 10;

export default function UserLeaderboard({ sx }: DataGridDemoProps) {

  // State
  const [rowsData, setRowsData] = useState<RowData[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [page, setPage] = useState(0);

  // Queries
  const { refetch } = api.leaderboard.getTopUsersByPoints.useQuery({ page, pageSize: PAGE_SIZE },
    { enabled: false });

  // Handlers
  const loadPage = useCallback(async () => {
    try {
      const { data } = await refetch();
      if (data) {
        const {
          rowData,
          rowCount
        } = data;
        const newRowsData = rowData.map(convertUserDataToRowData);
        setRowsData(newRowsData)
        setRowCount(rowCount);
      }
    }
    catch (err) {
      console.log(err);
    }
  }, [refetch])

  // Effects
  useEffect(() => {
    loadPage();
  }, [page, loadPage]);

  return (
    <Box sx={{
      '& .MuiDataGrid-columnHeaders': {
        background: 'rgba(0, 0, 0, 0.7)',
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
      '& .MuiDataGrid-row:nth-child(odd)': {
        background: 'rgba(0, 0, 0, 0.5)',
      },
      '& .MuiDataGrid-row:nth-child(even)': {
        background: 'rgba(20, 12, 0, 0.623)',
      },
      '& .MuiDataGrid-footerContainer': {
        background: 'rgba(0, 0, 0, 0.7)',
        borderBottomLeftRadius: '0.5rem',
        borderBottomRightRadius: '0.5rem',
      },
      ...sx
    }}>
      <DataGrid
        rows={rowsData}
        columns={columns}
        disableRowSelectionOnClick
        autoPageSize
        paginationModel={{
          page,
          pageSize: PAGE_SIZE,
        }}
        paginationMode='server'
        onPaginationModelChange={({ page }) => setPage(page)}
        rowCount={rowCount}
      />
    </Box>
  );
}
