import { Stack } from '@mui/material';
import { User } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import { api } from 'src/utils/api';
import LeaderboardBar from './LeaderboardBar';
import LeaderboardUserCard from './LeaderboardUserCard';

const PAGE_SIZE = 10;

interface UserLeaderboardProps {
  userClickHandler?: (userId: string) => void;
}

export default function UserLeaderboard({ userClickHandler }: UserLeaderboardProps) {
  // State
  const [rowsData, setRowsData] = useState<User[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [page, setPage] = useState(0);

  // TODO: Remove once pagination is implemented
  console.log(rowCount, setPage);

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
      <LeaderboardBar sx={{ mb: '1rem', position: 'relative', right: '1rem' }} />
      <Stack
        sx={{
          height: 'calc(100% - 3rem)',
          overflowY: 'auto',
          pr: '1rem'
        }}
      >
        {rowsData.length
          ? rowsData.map(u => {
              return (
                <LeaderboardUserCard
                  key={u.id}
                  userData={u}
                  sx={{ mb: '.75rem' }}
                  userClickHandler={userClickHandler}
                />
              );
            })
          : undefined}
      </Stack>
    </>
  );
}
