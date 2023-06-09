import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { Chip, Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ShopLayout } from 'components';
import { dbOrders } from 'database';
import { IOrder } from 'interfaces';

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
      <Link href={`/orders/${row.orderId}`} style={{ color: 'black' }}>
        Ver orden
      </Link>
    ),
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, idx) => ({
    id: idx + 1,
    paid: order.isPaid,
    fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    orderId: order._id,
  }));

  return (
    <ShopLayout title="Historial de ordenes" pageDescription="Historial de ordenes del cliente">
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>
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
            components={{
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  Sin ordenes
                </Stack>
              ),
            }}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      },
    };
  }

  const orders = await dbOrders.getOrdersByUser(session.user.id);

  return {
    props: { orders },
  };
};

export default HistoryPage;
