import { useState, useEffect, useCallback, useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SxProps, useMediaQuery, useTheme } from '@mui/material';
import { Region, User } from '@prisma/client';
import { api } from 'src/utils/api';
import { v4 } from 'uuid';
import UserLeaderboardGridStyles from './styles/UserLeaderboardGridStyles';

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

  const theme = useTheme();
  const isSmallBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const columns = useMemo(() => {
    const defaultColumnProps: Partial<GridColDef> = {
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: true,
      sortable: false,
      headerClassName: 'user-leaderboard-header',
    };

    const baseColumns: GridColDef[] = [
      {
        field: 'points',
        headerName: isSmallBreakpoint ? 'Pts' : 'Score',
        headerClassName: 'user-leaderboard-points-header',
        cellClassName: 'user-leaderboard-points-cell',
        width: isSmallBreakpoint ? 70 : 120,
      },
      {
        field: 'username',
        headerName: 'Username',
        width: 150,
      },
      {
        field: 'location',
        headerName: isSmallBreakpoint ? 'State' : 'Location',
        type: 'number',
        width: isSmallBreakpoint ? 76 : 170,
      },
      {
        field: 'region',
        headerName: 'Region',
        type: 'number',
      },
      {
        field: 'sex',
        headerName: 'Sex',
        type: 'number',
        width: isSmallBreakpoint ? 76 : undefined,
      },
    ];

    return baseColumns.map((column) => {  // Assuming 150 as a default width if not provided
      return { ...defaultColumnProps, ...column };
    });

  }, [isSmallBreakpoint]);

  const convertUserDataToRowData = useCallback((userData: User) => {
    const { username, city, state, region, sex, points } = userData;

    return ({
      id: v4(),
      username: username || '',
      location: isSmallBreakpoint ? state || '' : `${city}, ${state}` || '',
      region: region || 'WEST',
      sex: sex ? sex === 'male' ? 'M' : 'F' : '',
      points: points || 0,
    })
  }, [isSmallBreakpoint]);

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
  }, [refetch, convertUserDataToRowData])

  // Effects
  useEffect(() => {
    loadPage();
  }, [page, loadPage]);

  return (
    <UserLeaderboardGridStyles sx={sx}>
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
    </UserLeaderboardGridStyles>
  );
}
