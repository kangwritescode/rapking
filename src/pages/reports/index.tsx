import { Box, Button, Link, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ThreadComment } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from 'src/utils/api';

function ReportsPage() {
  const router = useRouter();

  // Queries
  const { data: reports, isLoading } = api.reports.getAllReports.useQuery();
  const { data: currentUser } = api.user.getCurrentUser.useQuery();

  // Invalidators
  const { invalidate: invalidateReports } = api.useUtils().reports.getAllReports;

  // State
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Mutations
  const { mutate: deleteReports } = api.reports.deleteReports.useMutation({
    onSuccess: () => {
      toast.success('Deleted successfully');
      invalidateReports();
    }
  });

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      router.push('/');
    }
  }, [currentUser, router]);

  // Define columns for the DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'reportedEntity', headerName: 'Entity', width: 80 },
    { field: 'reporter', headerName: 'Reporter', width: 100 },
    { field: 'reported', headerName: 'Offender', width: 100 },
    { field: 'createdAt', headerName: 'Created At', width: 120, type: 'dateTime' },
    {
      field: 'rap',
      headerName: 'Rap',
      width: 150,
      renderCell: (cellValues: any) => {
        return cellValues.value ? (
          <Link href={`/rap/${cellValues.value.id}`}>{cellValues.value.title}</Link>
        ) : (
          'N/A'
        );
      }
    },
    {
      field: 'rapComment',
      headerName: 'Rap Comment',
      width: 150,
      renderCell: (cellValues: { value: ThreadComment | null }) => {
        return cellValues.value ? (
          <Link href={`/rap/${cellValues.value.rapId}`}>{cellValues.value.content}</Link>
        ) : (
          'N/A'
        );
      }
    }
  ];

  const rows = reports
    ? reports.map(report => ({
        id: report.id,
        type: report.type,
        reportedEntity: report.reportedEntity,
        reporter: report.reporter.username,
        reported: report.reported?.username || 'N/A',
        createdAt: report.createdAt,
        rap: report.rap ?? null,
        rapComment: report.reportedEntity === 'RAP_COMMENT' ? report.threadComment : null
      }))
    : [];

  const handleDelete = () => {
    deleteReports(selectedRows);
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Stack
        sx={{
          p: '1rem'
        }}
        direction='row'
        spacing={2}
        width='100%'
        justifyContent='flex-end'
      >
        <Button
          disabled={!Boolean(selectedRows.length)}
          onClick={handleDelete}
          variant='contained'
          color='error'
        >
          Delete
        </Button>
      </Stack>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onStateChange={state => setSelectedRows(state.rowSelection)}
        />
      )}
    </Box>
  );
}

export default ReportsPage;
