import { NextPage } from 'next';
import useSWR from 'swr';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Chip, Grid, Typography } from '@mui/material';
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { AdminLayout, FullScreenLoading } from 'components';
import { IOrder } from 'interfaces';
import Link from 'next/link';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Order ID', width: 250 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'name', headerName: 'Nombre Completo', width: 200 },
  { field: 'total', headerName: 'Monto Total', width: 150 },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    width: 130,
    renderCell: ({ row }) =>
      row.isPaid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      ),
  },
  { field: 'noProducts', headerName: 'No. Productos', align: 'center', width: 130 },
  {
    field: 'check',
    headerName: 'Ver Orden',
    renderCell: ({ row }) => (
      <Link href={`/admin/orders/${row.id}`} target="_blank">
        Ver orden
      </Link>
    ),
  },
  { field: 'createdAt', headerName: 'Fecha Creación', width: 300 },
];

const OrdersPage: NextPage = () => {
  const { data, error, isLoading } = useSWR<IOrder[]>('/api/admin/orders');

  if (error) return <Typography>Error al cargar la información</Typography>;
  if (isLoading) return <FullScreenLoading />;

  const rows = data!.map((order) => ({
    id: order._id,
    email: typeof order.user === 'object' ? order.user.email : '',
    name: typeof order.user === 'object' ? order.user.name : '',
    total: order.total,
    isPaid: order.isPaid,
    noProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
      title="Ordenes"
      subtitle="Mantenimiento de ordenes"
      icon={<ConfirmationNumberOutlined />}>
      <Grid container className="fadeIn">
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
    </AdminLayout>
  );
};

export default OrdersPage;
