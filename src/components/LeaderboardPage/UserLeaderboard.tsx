import { SxProps, useTheme } from '@mui/material';
import { Region, User } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import { api } from 'src/utils/api';
import LeaderboardUserCard from './LeaderboardUserCard';

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

  // const isSmallBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  // State
  const [rowsData, setRowsData] = useState<User[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [page, setPage] = useState(0);

  // Queries
  const { refetch } = api.leaderboard.getTopUsersByPoints.useQuery(
    { page, pageSize: PAGE_SIZE },
    { enabled: false }
  );

  // Handlers
  const loadPage = useCallback(async () => {
    try {
      const { data } = await refetch();
      if (data) {
        const { rowData, rowCount } = data;
        setRowsData(rowData);
        setRowCount(rowCount);
      }
    } catch (err) {
      console.log(err);
    }
  }, [refetch]);

  // Effects
  useEffect(() => {
    loadPage();
  }, [page, loadPage]);

  return (
    <>
      {rowsData.length &&
        rowsData.map(u => {
          return <LeaderboardUserCard key={u.id} userData={u} sx={{ mb: '.75rem' }} />;
        })}
    </>
  );
}
