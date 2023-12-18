import { Stack } from '@mui/material';
import { User } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import { api } from 'src/utils/api';
import LeaderboardBar from './LeaderboardBar';
import LeaderboardUserCard from './LeaderboardUserCard';

const PAGE_SIZE = 20;

interface UserLeaderboardProps {
  userClickHandler?: (userId: string) => void;
  selectedUserId: string | null;
}

export default function UserLeaderboard({
  userClickHandler,
  selectedUserId
}: UserLeaderboardProps) {
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
    <Stack height='100%'>
      <LeaderboardBar sx={{ mb: '1rem', position: 'relative', right: '1rem' }} />
      <Stack
        sx={theme => ({
          height: '100%',
          overflowY: 'auto',
          pr: '1.2rem',
          pl: '.2rem',
          py: '.1rem',
          '&::-webkit-scrollbar': {
            width: '.25rem'
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey[800]
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            '&:hover': {
              background: '#555'
            }
          }
        })}
      >
        {rowsData.length
          ? rowsData.map((u, index) => {
              const place = index + 1 + page * PAGE_SIZE;

              return (
                <LeaderboardUserCard
                  key={u.id}
                  selected={u.id === selectedUserId}
                  userData={u}
                  userClickHandler={userClickHandler}
                  place={place}
                  sx={{ mb: '.75rem' }}
                />
              );
            })
          : undefined}
      </Stack>
    </Stack>
  );
}
