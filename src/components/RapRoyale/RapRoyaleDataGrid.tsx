import { Box, Button, Typography, useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import { getDayMonthYear } from 'src/@core/utils/get-formatted-date';
import { api } from 'src/utils/api';

const RapRoyaleDataGrid: React.FC = () => {
  const { data, isLoading, error } = api.royales.getAll.useQuery();

  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      width: 150,
      renderCell: params => (
        <Typography
          sx={{
            cursor: 'pointer'
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: params => (
        <Box
          sx={{
            color:
              params.value === 'OPEN'
                ? 'success.main'
                : params.value == 'NOT_STARTED'
                ? 'default'
                : 'error.main',
            cursor: 'pointer'
          }}
        >
          {params.value === 'NOT_STARTED' ? 'NOT STARTED' : params.value}
        </Box>
      )
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 150,
      renderCell: params => (
        <Box
          sx={{
            cursor: 'pointer'
          }}
        >
          {getDayMonthYear(params.value as Date)}
        </Box>
      )
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 150,
      renderCell: params => (
        <Box
          sx={{
            cursor: 'pointer'
          }}
        >
          {getDayMonthYear(params.value as Date)}
        </Box>
      )
    },
    {
      field: 'winner',
      headerName: 'Winner',
      width: 150,
      renderCell: params => {
        if (!params.value) return <Typography>N/A</Typography>;

        function onClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
          e.stopPropagation();
          router.push(`/u/${(params.value as User).username}`);
        }

        return (
          <Button color='secondary' onClick={onClickHandler}>
            {(params.value as User).username}
          </Button>
        );
      }
    }
  ];
  const theme = useTheme();

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>An error occurred: {error.message}</div>;

  return (
    <DataGrid
      sx={{
        mt: '1rem',
        '& .MuiDataGrid-columnHeaders': {
          background: theme.palette.grey[900]
        },
        ' & .MuiDataGrid-row': {
          cursor: 'pointer'
        }
      }}
      rows={data || []}
      columns={columns}
      onRowClick={params => {
        router.push(`/royale/${params.id}`);
      }}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isRowSelectable={_ => false}
      checkboxSelection={false}
      hideFooter
    />
  );
};

export default RapRoyaleDataGrid;
