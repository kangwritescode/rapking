import { Button, useTheme } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Rap, User } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  submissions: (Rap & {
    user: Partial<User>;
  })[];
};

const SubmissionsDataGrid: React.FC<Props> = ({ submissions }) => {
  const router = useRouter();
  const rows: GridRowsProp = submissions.map(sub => ({
    id: sub.id,
    title: sub.title,
    username: sub.user.username,
    likesCount: sub.likesCount
  }));

  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'Entrant',
      width: 200,
      renderCell: params => (
        <Button color='secondary' onClick={() => router.push(`/u/${params.value}`)}>
          {params.value}
        </Button>
      )
    },
    {
      field: 'title',
      headerName: 'Rap Title',
      width: 200,
      renderCell: params => (
        <Button color='secondary' onClick={() => router.push(`/rap/${params.row.id}`)}>
          {params.value}
        </Button>
      )
    },
    { field: 'likesCount', headerName: 'Likes', type: 'number', width: 130 }
  ];

  const theme = useTheme();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        sx={{
          mt: '1rem',
          '& .MuiDataGrid-columnHeaders': {
            background: theme.palette.grey[900]
          },
          ' & .MuiDataGrid-row': {
            cursor: 'pointer',
            '&:hover': {
              background: theme.palette.background.default
            }
          }
        }}
        rows={rows}
        columns={columns}
        hideFooter
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isRowSelectable={_ => false}
        checkboxSelection={false}
      />
    </div>
  );
};

export default SubmissionsDataGrid;
