import { Chip, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ShopLayout } from 'components';
import Link from 'next/link';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra información si está pagada o no',
    width: 200,
    renderCell: ({ row }) =>
      row.paid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="No pagada" color="error" />
      ),
  },
  {
    field: 'orden',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    renderCell: ({ row }) => (
      <Link href={`/orders/${row.id}`} style={{ color: 'black' }}>
        Ver orden
      </Link>
    ),
  },
];

const rows = [
  { id: 1, paid: true, fullname: 'Gino Carignano' },
  { id: 2, paid: false, fullname: 'Juan Perez' },
  { id: 3, paid: true, fullname: 'Pablo Rosales' },
  { id: 4, paid: false, fullname: 'Pepe Argento' },
  { id: 5, paid: true, fullname: 'Roman Riquelme' },
  { id: 6, paid: false, fullname: 'Lionel Messi' },
];

const HistoryPage = () => {
  return (
    <ShopLayout title="Historial de ordenes" pageDescription="Historial de ordenes del cliente">
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>
      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowSelection={false}
            pageSizeOptions={[5, 10, 20]}
            pagination={true}
            paginationModel={{
              page: 0,
              pageSize: 10,
            }}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default HistoryPage;
